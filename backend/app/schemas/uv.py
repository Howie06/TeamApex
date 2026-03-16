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


class UVProviderReadingDebug(BaseModel):
    uv_index: float
    recorded_at: str
    source: str


class UVProviderDebugResponse(BaseModel):
    location: str
    provider_mode: str
    timeout_seconds: float
    live_success: bool
    live_reading: UVProviderReadingDebug | None = None
    live_error_type: str | None = None
    live_error_detail: str | None = None
    fallback_reading: UVProviderReadingDebug | None = None
