from __future__ import annotations

import pytest


@pytest.fixture(autouse=True)
def _clear_market_data_caches() -> None:
    import app.clients.yahoo_finance as yahoo_mod
    import app.services.quotes as quotes_mod

    quotes_mod._CACHE.clear()
    quotes_mod._CACHE_TS.clear()

    yahoo_mod._METADATA_CACHE.clear()
    yahoo_mod._METADATA_CACHE_TS.clear()
