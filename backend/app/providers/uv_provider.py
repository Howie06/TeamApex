from __future__ import annotations

import json
from typing import Protocol
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from app.core.config import OPEN_METEO_BASE_URL, UV_PROVIDER_MODE, UV_REQUEST_TIMEOUT_SECONDS
from app.core.database import get_connection
from app.core.exceptions import NotFoundError, ServiceUnavailableError
from app.models.entities import LocationModel, UVReadingModel


class UVProvider(Protocol):
    def get_latest_reading(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> UVReadingModel:
        ...

    def get_history(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> list[UVReadingModel]:
        ...


class MockUVProvider:
    def get_latest_reading(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> UVReadingModel:
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

    def get_history(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> list[UVReadingModel]:
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


class OpenMeteoUVProvider:
    source_name = "Open-Meteo Weather API"

    def _resolve_coordinates(
        self,
        location: LocationModel,
        latitude: float | None,
        longitude: float | None,
    ) -> tuple[float, float]:
        return (
            latitude if latitude is not None else location.latitude,
            longitude if longitude is not None else location.longitude,
        )

    def _fetch_payload(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> dict:
        resolved_latitude, resolved_longitude = self._resolve_coordinates(
            location,
            latitude,
            longitude,
        )
        query = urlencode(
            {
                "latitude": resolved_latitude,
                "longitude": resolved_longitude,
                "current": "uv_index",
                "hourly": "uv_index",
                "forecast_days": 1,
                "timezone": "auto",
            }
        )

        try:
            with urlopen(
                f"{OPEN_METEO_BASE_URL}?{query}",
                timeout=UV_REQUEST_TIMEOUT_SECONDS,
            ) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            raise ServiceUnavailableError(
                f"Real UV provider request failed: {exc}"
            ) from exc

    def get_latest_reading(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> UVReadingModel:
        payload = self._fetch_payload(location, latitude, longitude)
        current = payload.get("current") or {}
        current_uv = current.get("uv_index")
        current_time = current.get("time")

        if current_uv is None or current_time is None:
            history = self.get_history(location, latitude, longitude)
            return history[-1]

        return UVReadingModel(
            id=0,
            location_id=location.id,
            uv_index=float(current_uv),
            recorded_at=str(current_time),
            source=self.source_name,
        )

    def get_history(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> list[UVReadingModel]:
        payload = self._fetch_payload(location, latitude, longitude)
        hourly = payload.get("hourly") or {}
        times = hourly.get("time") or []
        values = hourly.get("uv_index") or []

        readings = [
            UVReadingModel(
                id=0,
                location_id=location.id,
                uv_index=float(uv_index),
                recorded_at=str(recorded_at),
                source=self.source_name,
            )
            for recorded_at, uv_index in zip(times, values)
            if uv_index is not None
        ]

        if not readings:
            raise ServiceUnavailableError("Real UV provider returned no usable hourly data.")

        return readings


class HybridUVProvider:
    def __init__(self):
        self.live_provider = OpenMeteoUVProvider()
        self.fallback_provider = MockUVProvider()

    def get_latest_reading(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> UVReadingModel:
        try:
            return self.live_provider.get_latest_reading(location, latitude, longitude)
        except ServiceUnavailableError:
            return self.fallback_provider.get_latest_reading(location, latitude, longitude)

    def get_history(
        self,
        location: LocationModel,
        latitude: float | None = None,
        longitude: float | None = None,
    ) -> list[UVReadingModel]:
        try:
            return self.live_provider.get_history(location, latitude, longitude)
        except ServiceUnavailableError:
            return self.fallback_provider.get_history(location, latitude, longitude)


def get_uv_provider() -> UVProvider:
    if UV_PROVIDER_MODE == "mock":
        return MockUVProvider()

    if UV_PROVIDER_MODE == "real":
        return OpenMeteoUVProvider()

    if UV_PROVIDER_MODE == "hybrid":
        return HybridUVProvider()

    raise ServiceUnavailableError(
        f"UV provider mode '{UV_PROVIDER_MODE}' is not configured."
    )
