from __future__ import annotations

import pytest
from app.clients.yahoo_finance import InstrumentMetadata, YahooFinanceClient


class _FakeSearch:
    def __init__(
        self,
        *,
        query: str,
        max_results: int,
        news_count: int,
        include_cb: bool,
        include_nav_links: bool,
        enable_fuzzy_query: bool,
    ) -> None:
        self.quotes = [
            {
                "symbol": "TSLA",
                "shortname": "Tesla, Inc.",
                "exchange": "NMS",
                "quoteType": "EQUITY",
                "currency": "USD",
            },
            {
                "symbol": "AMZN",
                "shortname": "Amazon.com, Inc.",
                "exchange": "NASDAQ",
                "quoteType": "EQUITY",
                "currency": "USD",
                "logoUrl": "https://logo.example/amzn.png",
            },
            {
                "symbol": "SHOP",
                "shortname": "Shopify Inc.",
                "exchange": "TOR",
                "quoteType": "EQUITY",
                "currency": "CAD",
            },
            {
                "symbol": "SPY",
                "shortname": "SPDR S&P 500 ETF Trust",
                "exchange": "NYSEArca",
                "quoteType": "ETF",
                "currency": "USD",
            },
        ]


def test_search_instruments_filters_to_us_equities_and_enriches_missing_logos(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", _FakeSearch)

    client = YahooFinanceClient()

    def fake_get_metadata(symbol: str) -> InstrumentMetadata:
        if symbol == "TSLA":
            return InstrumentMetadata(logo_domain="tesla.com")
        return InstrumentMetadata(logo_domain="")

    monkeypatch.setattr(client, "get_instrument_metadata", fake_get_metadata)

    results = client.search_instruments("tes", max_results=10)

    assert [item.symbol for item in results] == ["TSLA", "AMZN"]
    assert results[0].logo_url == "/api/market-data/logos/by-domain/tesla.com"
    assert results[1].logo_url == "/api/market-data/logos/by-domain/logo.example"


def test_search_instruments_prefers_exact_symbol_matches(monkeypatch: pytest.MonkeyPatch) -> None:
    class _ExactMatchSearch:
        def __init__(self, **_: object) -> None:
            self.quotes = [
                {
                    "symbol": "AAP",
                    "shortname": "Advance Auto Parts, Inc.",
                    "exchange": "NYSE",
                    "quoteType": "EQUITY",
                    "currency": "USD",
                },
                {
                    "symbol": "AAPL",
                    "shortname": "Apple Inc.",
                    "exchange": "NASDAQ",
                    "quoteType": "EQUITY",
                    "currency": "USD",
                },
            ]

    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", _ExactMatchSearch)

    client = YahooFinanceClient()
    monkeypatch.setattr(
        client,
        "get_instrument_metadata",
        lambda _symbol: InstrumentMetadata(logo_domain=""),
    )

    results = client.search_instruments("AAPL", max_results=10)

    assert [item.symbol for item in results] == ["AAPL", "AAP"]


def test_search_instruments_does_not_lookup_metadata_when_logo_already_exists(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr("app.clients.yahoo_finance.yf.Search", _FakeSearch)

    client = YahooFinanceClient()
    calls: list[str] = []

    def fake_get_metadata(symbol: str) -> InstrumentMetadata:
        calls.append(symbol)
        return InstrumentMetadata(logo_domain=f"{symbol.lower()}.com")

    monkeypatch.setattr(client, "get_instrument_metadata", fake_get_metadata)

    results = client.search_instruments("amz", max_results=10)

    amzn = next(item for item in results if item.symbol == "AMZN")
    assert amzn.logo_url == "/api/market-data/logos/by-domain/logo.example"
    assert "AMZN" not in calls
