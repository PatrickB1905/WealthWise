from __future__ import annotations

from dataclasses import dataclass

import httpx
import pytest
from app.clients.yahoo_finance import YahooFinanceClient
from app.core.config import Settings
from app.main import create_app
from fastapi.testclient import TestClient


@dataclass(frozen=True)
class _FakeRow:
    symbol: str
    current_price: float
    daily_change_percent: float


def test_quotes_endpoint_maps_response_fields_and_uses_default_di(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import app.services.quotes as quotes_mod

    def fake_compute(symbols: list[str]) -> dict[str, _FakeRow]:
        return {
            "AAPL": _FakeRow("AAPL", 123.0, 1.23),
            "MSFT": _FakeRow("MSFT", 234.0, 2.34),
        }

    monkeypatch.setattr(quotes_mod, "_compute_from_download", fake_compute)

    def fake_get_instrument_metadata(self: YahooFinanceClient, symbol: str):
        class _Meta:
            def __init__(self, logo_domain: str) -> None:
                self.logo_domain = logo_domain

        sym = symbol.strip().upper()
        domain = "apple.com" if sym == "AAPL" else "microsoft.com"
        return _Meta(domain)

    monkeypatch.setattr(YahooFinanceClient, "get_instrument_metadata", fake_get_instrument_metadata)

    app = create_app(Settings(max_symbols=50))
    with TestClient(app) as client:
        r = client.get("/api/quotes", params={"symbols": "AAPL,MSFT"})

    assert r.status_code == 200
    data = r.json()
    assert {d["symbol"] for d in data} == {"AAPL", "MSFT"}
    assert all("currentPrice" in d for d in data)
    assert all("dailyChangePercent" in d for d in data)
    assert all("logoUrl" in d for d in data)
    assert all("updatedAt" in d for d in data)
    assert data[0]["logoUrl"].startswith("/api/market-data/logos/by-domain/")


def test_quotes_endpoint_respects_max_symbols(monkeypatch: pytest.MonkeyPatch) -> None:
    import app.services.quotes as quotes_mod

    def fake_compute(symbols: list[str]) -> dict[str, _FakeRow]:
        # Pretend all symbols returned prices
        return {s: _FakeRow(s, 1.0, 0.0) for s in symbols}

    monkeypatch.setattr(quotes_mod, "_compute_from_download", fake_compute)

    monkeypatch.setattr(
        YahooFinanceClient,
        "get_instrument_metadata",
        lambda self, symbol: type("Meta", (), {"logo_domain": "example.com"})(),
    )

    app = create_app(Settings(MARKET_DATA_MAX_SYMBOLS=2))
    with TestClient(app) as client:
        r = client.get("/api/quotes", params={"symbols": "AAPL,MSFT,GOOG,TSLA"})

    assert r.status_code == 200
    data = r.json()
    assert [d["symbol"] for d in data] == ["AAPL", "MSFT"]


def test_logo_proxy_endpoint_returns_upstream_bytes(monkeypatch: pytest.MonkeyPatch) -> None:
    class _FakeResponse:
        status_code = 200
        content = b"fake-image"
        headers = {
            "content-type": "image/png",
            "cache-control": "public, max-age=86400, stale-while-revalidate=600",
        }

    class _FakeClient:
        def __init__(self, *args, **kwargs) -> None:
            pass

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb) -> None:
            return None

        def get(self, url: str):
            assert "token=" in url
            return _FakeResponse()

    monkeypatch.setattr("app.api.routes.httpx.Client", _FakeClient)

    app = create_app(Settings(logo_dev_token="test-token"))
    with TestClient(app) as client:
        r = client.get("/api/logos/by-domain/apple.com")

    assert r.status_code == 200
    assert r.content == b"fake-image"
    assert r.headers["content-type"].startswith("image/png")
    assert "max-age=86400" in r.headers["cache-control"]


def test_logo_proxy_endpoint_rejects_invalid_domain() -> None:
    app = create_app(Settings(LOGO_DEV_TOKEN="test-token"))
    with TestClient(app) as client:
        r = client.get("/api/logos/by-domain/not a real domain")

    assert r.status_code == 400


def test_logo_proxy_endpoint_returns_502_on_upstream_failure(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class _FakeClient:
        def __init__(self, *args, **kwargs) -> None:
            pass

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb) -> None:
            return None

        def get(self, url: str):
            raise httpx.ConnectError("boom")

    monkeypatch.setattr("app.api.routes.httpx.Client", _FakeClient)

    app = create_app(Settings(LOGO_DEV_TOKEN="test-token"))
    with TestClient(app) as client:
        r = client.get("/api/logos/by-domain/apple.com")

    assert r.status_code == 502
