from __future__ import annotations

import time

from app.clients.yahoo_finance import InstrumentMetadata, QuoteData
from app.services import quotes as quotes_mod


class _DummyClient:
    def get_instrument_metadata(self, symbol: str) -> InstrumentMetadata:
        return InstrumentMetadata(logo_domain=f"{symbol.lower()}.com")


def test_parse_symbols_deduplicates_normalizes_and_limits() -> None:
    result = quotes_mod.parse_symbols(" aapl , msft, AAPL, , nvda ", max_symbols=2)
    assert result == ["AAPL", "MSFT"]


def test_fetch_quotes_uses_cached_quote_when_download_has_no_row(monkeypatch) -> None:
    now = time.time()
    cached = QuoteData(
        symbol="AAPL",
        current_price=150.0,
        daily_change_percent=2.5,
        logo_url="/api/market-data/logos/by-domain/apple.com",
        updated_at="2026-03-13T20:00:00Z",
    )

    quotes_mod._cache_put(cached, now=now)
    monkeypatch.setattr(quotes_mod.time, "time", lambda: now)
    monkeypatch.setattr(quotes_mod, "_compute_from_download", lambda symbols: {})

    result = quotes_mod.fetch_quotes(
        "AAPL",
        client=_DummyClient(),
        max_symbols=10,
    )

    assert result == [cached]


def test_fetch_quotes_uses_logo_from_metadata_when_price_download_succeeds(monkeypatch) -> None:
    monkeypatch.setattr(
        quotes_mod,
        "_compute_from_download",
        lambda symbols: {
            "AAPL": quotes_mod._QuoteRow(
                symbol="AAPL",
                current_price=200.0,
                daily_change_percent=5.0,
            )
        },
    )

    result = quotes_mod.fetch_quotes(
        "AAPL",
        client=_DummyClient(),
        max_symbols=10,
    )

    assert len(result) == 1
    assert result[0].symbol == "AAPL"
    assert result[0].current_price == 200.0
    assert result[0].daily_change_percent == 5.0
    assert result[0].logo_url == "/api/market-data/logos/by-domain/aapl.com"
    assert result[0].updated_at is not None
