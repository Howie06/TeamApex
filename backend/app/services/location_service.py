from __future__ import annotations

import math
from sqlite3 import Row

from app.core.database import get_connection
from app.core.exceptions import NotFoundError
from app.models.entities import LocationModel
from app.schemas.location import LocationResponse


def _row_to_location(row: Row) -> LocationModel:
    return LocationModel(
        id=row["id"],
        name=row["name"],
        state=row["state"],
        country=row["country"],
        latitude=row["latitude"],
        longitude=row["longitude"],
        search_terms=row["search_terms"],
        peak_window=row["peak_window"],
    )


def _display_name(location: LocationModel) -> str:
    return f"{location.name}, {location.state}"


def _to_response(location: LocationModel) -> LocationResponse:
    return LocationResponse(
        id=location.id,
        name=location.name,
        state=location.state,
        country=location.country,
        latitude=location.latitude,
        longitude=location.longitude,
        display_name=_display_name(location),
        peak_window=location.peak_window,
    )


def list_locations() -> list[LocationResponse]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM locations ORDER BY name ASC"
        ).fetchall()
    return [_to_response(_row_to_location(row)) for row in rows]


def search_locations(query: str | None) -> list[LocationResponse]:
    if not query:
        return list_locations()

    like_query = f"%{query.strip().lower()}%"
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT *
            FROM locations
            WHERE lower(name) LIKE ?
               OR lower(state) LIKE ?
               OR lower(search_terms) LIKE ?
            ORDER BY name ASC
            """,
            (like_query, like_query, like_query),
        ).fetchall()

    return [_to_response(_row_to_location(row)) for row in rows]


def get_location_by_name(location_name: str) -> LocationModel:
    normalized = location_name.strip().lower()

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM locations
            WHERE lower(name) = ?
               OR lower(name || ', ' || state) = ?
            LIMIT 1
            """,
            (normalized, normalized),
        ).fetchone()

        if row is None:
            like_query = f"%{normalized}%"
            row = connection.execute(
                """
                SELECT *
                FROM locations
                WHERE lower(name) LIKE ?
                   OR lower(state) LIKE ?
                   OR lower(search_terms) LIKE ?
                ORDER BY name ASC
                LIMIT 1
                """,
                (like_query, like_query, like_query),
            ).fetchone()

    if row is None:
        raise NotFoundError(f"Location '{location_name}' was not found.")

    return _row_to_location(row)


def _haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    radius_km = 6371
    lat1_rad, lng1_rad = math.radians(lat1), math.radians(lng1)
    lat2_rad, lng2_rad = math.radians(lat2), math.radians(lng2)
    d_lat = lat2_rad - lat1_rad
    d_lng = lng2_rad - lng1_rad

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(d_lng / 2) ** 2
    )
    return 2 * radius_km * math.asin(math.sqrt(a))


def get_location_by_coordinates(latitude: float, longitude: float) -> LocationModel:
    with get_connection() as connection:
        rows = connection.execute("SELECT * FROM locations").fetchall()

    if not rows:
        raise NotFoundError("No locations are available in the database.")

    locations = [_row_to_location(row) for row in rows]
    return min(
        locations,
        key=lambda location: _haversine_distance(
            latitude,
            longitude,
            location.latitude,
            location.longitude,
        ),
    )
