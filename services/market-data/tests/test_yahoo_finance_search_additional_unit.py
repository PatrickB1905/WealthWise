from __future__ import annotations

from typing import Any

import pytest
from app.clients.yahoo_finance import InstrumentMetadata, YahooFinanceClient


def test_search_instruments_returns_empty_when_yfinance_search_is_unavailable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", None)

    client = YahooFinanceClient()
    assert client.search_instruments("apple") == []


def test_search_instruments_returns_empty_when_search_raises(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class BoomSearch:
        def __init__(self, **_: Any) -> None:
            raise RuntimeError("boom")

    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", BoomSearch)

    client = YahooFinanceClient()
    assert client.search_instruments("apple") == []


def test_search_instruments_calls_search_method_when_quotes_is_none(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class SearchWithLateQuotes:
        def __init__(self, **_: Any) -> None:
            self.quotes = None

        def search(self) -> None:
            self.quotes = [
                {
                    "symbol": "AAPL",
                    "shortname": "Apple Inc.",
                    "exchange": "NASDAQ",
                    "quoteType": "EQUITY",
                    "currency": "USD",
                }
            ]

    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", SearchWithLateQuotes)

    client = YahooFinanceClient()
    monkeypatch.setattr(
        client,
        "get_instrument_metadata",
        lambda _symbol: InstrumentMetadata(logo_domain=""),
    )

    results = client.search_instruments("apple")
    assert [item.symbol for item in results] == ["AAPL"]


def test_get_instrument_metadata_uses_cache(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    client = YahooFinanceClient()
    calls = {"count": 0}

    def fake_fetch_info(symbol: str) -> dict[str, object]:
        calls["count"] += 1
        return {
            "website": "https://www.apple.com",
            "logo_url": "",
        }

    monkeypatch.setattr(client, "_fetch_info", fake_fetch_info)

    first = client.get_instrument_metadata("AAPL")
    second = client.get_instrument_metadata("AAPL")

    assert first.logo_domain == "apple.com"
    assert second.logo_domain == first.logo_domain
    assert calls["count"] == 1
