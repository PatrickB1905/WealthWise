from __future__ import annotations

import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response
from starlette.requests import Request

from app.api.schemas import InstrumentSearchResult, Quote
from app.clients.yahoo_finance import (
    YahooFinanceClient,
    build_logo_dev_url,
    is_valid_logo_domain,
    normalize_logo_domain,
)
from app.core.config import Settings
from app.services.quotes import fetch_quotes

log = logging.getLogger(__name__)
router = APIRouter()


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_yahoo_client() -> YahooFinanceClient:
    return YahooFinanceClient()


@router.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "OK"}


@router.get("/api/quotes", response_model=list[Quote])
def quotes(
    symbols: str = Query(..., description="Comma-separated symbols, e.g. AAPL,MSFT"),
    settings: Settings = Depends(get_settings),
    client: YahooFinanceClient = Depends(get_yahoo_client),
) -> list[Quote]:
    data = fetch_quotes(symbols, client=client, max_symbols=settings.max_symbols)
    return [
        Quote(
            symbol=q.symbol,
            currentPrice=q.current_price,
            dailyChangePercent=q.daily_change_percent,
            logoUrl=q.logo_url,
            updatedAt=q.updated_at,
        )
        for q in data
    ]


@router.get("/api/instruments/search", response_model=list[InstrumentSearchResult])
def search_instruments(
    q: str = Query(..., min_length=2, description="Ticker or company name"),
    limit: int = Query(10, ge=1, le=15),
    client: YahooFinanceClient = Depends(get_yahoo_client),
) -> list[InstrumentSearchResult]:
    results = client.search_instruments(q, max_results=limit)

    return [
        InstrumentSearchResult(
            symbol=item.symbol,
            name=item.name,
            exchange=item.exchange,
            assetType=item.asset_type,
            currency=item.currency,
            logoUrl=item.logo_url,
        )
        for item in results
    ]


@router.get("/api/logos/by-domain/{domain:path}")
def proxy_logo_by_domain(
    domain: str = Path(..., description="Normalized public website domain"),
    settings: Settings = Depends(get_settings),
) -> Response:
    normalized_domain = normalize_logo_domain(domain)
    if not is_valid_logo_domain(normalized_domain):
        raise HTTPException(status_code=400, detail="Invalid logo domain")

    upstream_url = build_logo_dev_url(
        normalized_domain,
        token=settings.logo_dev_token,
        base_url=settings.logo_dev_base_url,
    )
    if not upstream_url:
        raise HTTPException(status_code=404, detail="Logo provider is not configured")

    try:
        with httpx.Client(
            timeout=settings.logo_proxy_timeout_seconds, follow_redirects=True
        ) as client:
            upstream = client.get(upstream_url)
    except httpx.HTTPError:
        log.exception("Logo proxy request failed for domain=%s", normalized_domain)
        raise HTTPException(status_code=502, detail="Failed to fetch logo") from None

    if upstream.status_code == 404:
        raise HTTPException(status_code=404, detail="Logo not found")

    if upstream.status_code >= 400:
        log.warning(
            "Logo provider returned upstream error status=%s domain=%s",
            upstream.status_code,
            normalized_domain,
        )
        raise HTTPException(status_code=502, detail="Failed to fetch logo")

    content_type = upstream.headers.get("content-type", "image/png")
    cache_control = upstream.headers.get(
        "cache-control",
        "public, max-age=86400, stale-while-revalidate=600",
    )

    return Response(
        content=upstream.content,
        media_type=content_type,
        headers={
            "Cache-Control": cache_control,
            "X-Content-Type-Options": "nosniff",
        },
    )
