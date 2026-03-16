from __future__ import annotations

from app.api.routes import get_yahoo_client, router
from app.clients.yahoo_finance import InstrumentSearchResultData
from fastapi import FastAPI
from fastapi.testclient import TestClient


class _StubYahooClient:
    def search_instruments(
        self,
        query: str,
        *,
        max_results: int = 10,
    ) -> list[InstrumentSearchResultData]:
        assert query == "tesla"
        assert max_results == 5
        return [
            InstrumentSearchResultData(
                symbol="TSLA",
                name="Tesla, Inc.",
                exchange="NASDAQ",
                asset_type="EQUITY",
                currency="USD",
                logo_url="/api/market-data/logos/by-domain/tesla.com",
            )
        ]


def test_search_instruments_route_returns_normalized_api_shape() -> None:
    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_yahoo_client] = lambda: _StubYahooClient()

    client = TestClient(app)
    response = client.get("/api/instruments/search?q=tesla&limit=5")

    assert response.status_code == 200
    assert response.json() == [
        {
            "symbol": "TSLA",
            "name": "Tesla, Inc.",
            "exchange": "NASDAQ",
            "assetType": "EQUITY",
            "currency": "USD",
            "logoUrl": "/api/market-data/logos/by-domain/tesla.com",
        }
    ]
