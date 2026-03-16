from __future__ import annotations

from app.core.database import get_connection
from app.core.config import DEFAULT_LOCATION_NAME, UV_PROVIDER_MODE, UV_REQUEST_TIMEOUT_SECONDS
from app.core.exceptions import AppError
from app.models.entities import LocationModel, UVReadingModel
from app.providers.uv_provider import MockUVProvider, OpenMeteoUVProvider, get_uv_provider
from app.schemas.uv import (
    UVHistoryPoint,
    UVHistoryResponse,
    UVProviderDebugResponse,
    UVProviderReadingDebug,
    UVResponse,
)
from app.services.location_service import get_location_by_coordinates, get_location_by_name
from app.services.risk_service import map_uv_risk


def _store_current_reading(location: LocationModel, reading: UVReadingModel) -> None:
    with get_connection() as connection:
        existing = connection.execute(
            """
            SELECT id
            FROM uv_readings
            WHERE location_id = ? AND recorded_at = ?
            LIMIT 1
            """,
            (location.id, reading.recorded_at),
        ).fetchone()

        if existing is None:
            connection.execute(
                """
                INSERT INTO uv_readings (location_id, uv_index, recorded_at, source)
                VALUES (?, ?, ?, ?)
                """,
                (location.id, reading.uv_index, reading.recorded_at, reading.source),
            )
        else:
            connection.execute(
                """
                UPDATE uv_readings
                SET uv_index = ?, source = ?
                WHERE id = ?
                """,
                (reading.uv_index, reading.source, existing["id"]),
            )
        connection.commit()


def _store_history(location: LocationModel, history: list[UVReadingModel]) -> None:
    if not history:
        return

    with get_connection() as connection:
        connection.execute(
            "DELETE FROM uv_readings WHERE location_id = ?",
            (location.id,),
        )
        connection.executemany(
            """
            INSERT INTO uv_readings (location_id, uv_index, recorded_at, source)
            VALUES (?, ?, ?, ?)
            """,
            [
                (
                    location.id,
                    reading.uv_index,
                    reading.recorded_at,
                    reading.source,
                )
                for reading in history
            ],
        )
        connection.commit()


def _build_response(location: LocationModel, reading: UVReadingModel) -> UVResponse:
    display_name = f"{location.name}, {location.state}"
    risk = map_uv_risk(reading.uv_index, display_name)

    return UVResponse(
        location=display_name,
        uv_index=reading.uv_index,
        risk_level=risk.level,
        risk_color=risk.color,
        warning_message=risk.warning_message,
        human_alert=risk.human_alert,
        estimated_damage_window=risk.estimated_damage_window,
        recorded_at=reading.recorded_at,
        source=reading.source,
        peak_window=location.peak_window,
    )


def get_current_uv(location_name: str | None = None) -> UVResponse:
    location = get_location_by_name(location_name or DEFAULT_LOCATION_NAME)
    provider = get_uv_provider()
    reading = provider.get_latest_reading(location)
    _store_current_reading(location, reading)
    return _build_response(location, reading)


def get_uv_by_coordinates(latitude: float, longitude: float) -> UVResponse:
    location = get_location_by_coordinates(latitude, longitude)
    provider = get_uv_provider()
    reading = provider.get_latest_reading(location, latitude, longitude)
    _store_current_reading(location, reading)
    return _build_response(location, reading)


def get_uv_history(location_name: str | None = None) -> UVHistoryResponse:
    location = get_location_by_name(location_name or DEFAULT_LOCATION_NAME)
    provider = get_uv_provider()
    history = provider.get_history(location)
    _store_history(location, history)

    return UVHistoryResponse(
        location=f"{location.name}, {location.state}",
        series=[
            UVHistoryPoint(recorded_at=reading.recorded_at, uv_index=reading.uv_index)
            for reading in history
        ],
        source=history[-1].source,
    )


def get_uv_provider_debug(location_name: str | None = None) -> UVProviderDebugResponse:
    location = get_location_by_name(location_name or DEFAULT_LOCATION_NAME)
    display_name = f"{location.name}, {location.state}"
    live_provider = OpenMeteoUVProvider()
    fallback_provider = MockUVProvider()

    fallback_reading = fallback_provider.get_latest_reading(location)
    live_reading: UVReadingModel | None = None
    live_error_type: str | None = None
    live_error_detail: str | None = None

    try:
        live_reading = live_provider.get_latest_reading(location)
    except AppError as exc:
        live_error_type = exc.__class__.__name__
        live_error_detail = exc.detail
    except Exception as exc:
        live_error_type = exc.__class__.__name__
        live_error_detail = str(exc)

    return UVProviderDebugResponse(
        location=display_name,
        provider_mode=UV_PROVIDER_MODE,
        timeout_seconds=UV_REQUEST_TIMEOUT_SECONDS,
        live_success=live_reading is not None,
        live_reading=(
            UVProviderReadingDebug(
                uv_index=live_reading.uv_index,
                recorded_at=live_reading.recorded_at,
                source=live_reading.source,
            )
            if live_reading is not None
            else None
        ),
        live_error_type=live_error_type,
        live_error_detail=live_error_detail,
        fallback_reading=UVProviderReadingDebug(
            uv_index=fallback_reading.uv_index,
            recorded_at=fallback_reading.recorded_at,
            source=fallback_reading.source,
        ),
    )
