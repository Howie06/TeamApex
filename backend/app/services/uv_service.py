from __future__ import annotations

from app.core.config import DEFAULT_LOCATION_NAME
from app.providers.uv_provider import get_uv_provider
from app.schemas.uv import UVHistoryPoint, UVHistoryResponse, UVResponse
from app.services.location_service import get_location_by_coordinates, get_location_by_name
from app.services.risk_service import map_uv_risk


def get_current_uv(location_name: str | None = None) -> UVResponse:
    location = get_location_by_name(location_name or DEFAULT_LOCATION_NAME)
    provider = get_uv_provider()
    reading = provider.get_latest_reading(location)
    risk = map_uv_risk(reading.uv_index, f"{location.name}, {location.state}")

    return UVResponse(
        location=f"{location.name}, {location.state}",
        uv_index=reading.uv_index,
        risk_level=risk.level,
        risk_color=risk.color,
        warning_message=risk.warning_message,
        recorded_at=reading.recorded_at,
        source=reading.source,
        peak_window=location.peak_window,
    )


def get_uv_by_coordinates(latitude: float, longitude: float) -> UVResponse:
    location = get_location_by_coordinates(latitude, longitude)
    return get_current_uv(location.name)


def get_uv_history(location_name: str | None = None) -> UVHistoryResponse:
    location = get_location_by_name(location_name or DEFAULT_LOCATION_NAME)
    provider = get_uv_provider()
    history = provider.get_history(location)

    return UVHistoryResponse(
        location=f"{location.name}, {location.state}",
        series=[
            UVHistoryPoint(recorded_at=reading.recorded_at, uv_index=reading.uv_index)
            for reading in history
        ],
        source=history[-1].source,
    )
