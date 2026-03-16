from __future__ import annotations

from typing import Any

import pandas as pd
import pytest
from app.clients.yahoo_finance import YahooFinanceClient


def test_returns_none_for_blank_symbol() -> None:
    c = YahooFinanceClient()
    assert c.fetch_quote("   ") is None


def test_builds_internal_logo_path_when_website_present(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import yfinance as yf

    class DummyTicker:
        @property
        def info(self) -> dict[str, Any]:
            return {"website": "https://www.microsoft.com"}

        def history(self, *args: Any, **kwargs: Any) -> pd.DataFrame:
            return pd.DataFrame({"Close": [100.0, 110.0]})

    monkeypatch.setattr(yf, "Ticker", lambda _ticker: DummyTicker())

    c = YahooFinanceClient()
    q = c.fetch_quote("msft")

    assert q is not None
    assert q.symbol == "MSFT"
    assert q.current_price == 110.0
    assert q.daily_change_percent == 10.0
    assert q.logo_url == "/api/market-data/logos/by-domain/microsoft.com"
    assert q.updated_at is not None


def test_returns_empty_logo_when_no_domain_can_be_resolved(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import yfinance as yf

    class DummyTicker:
        @property
        def info(self) -> dict[str, Any]:
            return {
                "logo_url": "",
                "website": "",
            }

        def history(self, *args: Any, **kwargs: Any) -> pd.DataFrame:
            return pd.DataFrame({"Close": [100.0, 110.0]})

    monkeypatch.setattr(yf, "Ticker", lambda _ticker: DummyTicker())

    c = YahooFinanceClient()
    q = c.fetch_quote("AAPL")

    assert q is not None
    assert q.logo_url == ""


def test_returns_none_when_not_enough_history(monkeypatch: pytest.MonkeyPatch) -> None:
    import yfinance as yf

    class DummyTicker:
        @property
        def info(self) -> dict[str, Any]:
            return {}

        def history(self, *args: Any, **kwargs: Any) -> pd.DataFrame:
            return pd.DataFrame({"Close": [100.0]})

    monkeypatch.setattr(yf, "Ticker", lambda _ticker: DummyTicker())

    c = YahooFinanceClient()
    assert c.fetch_quote("AAPL") is None


def test_returns_none_when_history_is_none(monkeypatch: pytest.MonkeyPatch) -> None:
    import yfinance as yf

    class DummyTicker:
        @property
        def info(self) -> dict[str, Any]:
            return {}

        def history(self, *args: Any, **kwargs: Any) -> Any:
            return None

    monkeypatch.setattr(yf, "Ticker", lambda _ticker: DummyTicker())

    c = YahooFinanceClient()
    assert c.fetch_quote("AAPL") is None


def test_returns_none_on_exception(monkeypatch: pytest.MonkeyPatch) -> None:
    import yfinance as yf

    def boom(_: str) -> Any:
        raise RuntimeError("fail")

    monkeypatch.setattr(yf, "Ticker", boom)

    c = YahooFinanceClient()
    assert c.fetch_quote("AAPL") is None
