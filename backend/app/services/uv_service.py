from __future__ import annotations

from app.core.database import get_connection
from app.core.config import DEFAULT_LOCATION_NAME
from app.models.entities import LocationModel, UVReadingModel
from app.providers.uv_provider import get_uv_provider
from app.schemas.uv import UVHistoryPoint, UVHistoryResponse, UVResponse
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
