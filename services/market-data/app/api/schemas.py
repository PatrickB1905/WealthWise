from __future__ import annotations

from pydantic import BaseModel


class Quote(BaseModel):
    symbol: str
    currentPrice: float
    dailyChangePercent: float
    logoUrl: str
    updatedAt: str | None = None


class InstrumentSearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str
    assetType: str
    currency: str
    logoUrl: str
