from __future__ import annotations

from pydantic import BaseModel


class UVResponse(BaseModel):
    location: str
    uv_index: float
    risk_level: str
    risk_color: str
    warning_message: str
    human_alert: str
    estimated_damage_window: str
    recorded_at: str
    source: str
    peak_window: str


class UVHistoryPoint(BaseModel):
    recorded_at: str
    uv_index: float


class UVHistoryResponse(BaseModel):
    location: str
    series: list[UVHistoryPoint]
    source: str
