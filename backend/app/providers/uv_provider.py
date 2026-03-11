from __future__ import annotations

from typing import Protocol

from app.core.config import UV_PROVIDER_MODE
from app.core.database import get_connection
from app.core.exceptions import NotFoundError, ServiceUnavailableError
from app.models.entities import LocationModel, UVReadingModel


class UVProvider(Protocol):
    def get_latest_reading(self, location: LocationModel) -> UVReadingModel:
        ...

    def get_history(self, location: LocationModel) -> list[UVReadingModel]:
        ...


class MockUVProvider:
    def get_latest_reading(self, location: LocationModel) -> UVReadingModel:
        with get_connection() as connection:
            row = connection.execute(
                """
                SELECT *
                FROM uv_readings
                WHERE location_id = ?
                ORDER BY recorded_at DESC
                LIMIT 1
                """,
                (location.id,),
            ).fetchone()

        if row is None:
            raise NotFoundError(f"No UV reading found for {location.name}.")

        return UVReadingModel(
            id=row["id"],
            location_id=row["location_id"],
            uv_index=row["uv_index"],
            recorded_at=row["recorded_at"],
            source=row["source"],
        )

    def get_history(self, location: LocationModel) -> list[UVReadingModel]:
        with get_connection() as connection:
            rows = connection.execute(
                """
                SELECT *
                FROM uv_readings
                WHERE location_id = ?
                ORDER BY recorded_at ASC
                """,
                (location.id,),
            ).fetchall()

        if not rows:
            raise NotFoundError(f"No UV history found for {location.name}.")

        return [
            UVReadingModel(
                id=row["id"],
                location_id=row["location_id"],
                uv_index=row["uv_index"],
                recorded_at=row["recorded_at"],
                source=row["source"],
            )
            for row in rows
        ]


def get_uv_provider() -> UVProvider:
    if UV_PROVIDER_MODE != "mock":
        raise ServiceUnavailableError(
            f"UV provider mode '{UV_PROVIDER_MODE}' is not configured. Only the mock provider is available in this demo."
        )

    return MockUVProvider()
