from __future__ import annotations

from pydantic import BaseModel


class AwarenessPoint(BaseModel):
    label: str
    value: float
    description: str


class AwarenessTrendResponse(BaseModel):
    title: str
    metric: str
    source: str
    series: list[AwarenessPoint]


class MythFactResponse(BaseModel):
    id: int
    title: str
    myth: str
    fact: str
    category: str


class MythFactListResponse(BaseModel):
    source: str
    items: list[MythFactResponse]
