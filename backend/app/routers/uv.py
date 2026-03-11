from __future__ import annotations

from fastapi import APIRouter, Query

from app.schemas.uv import UVHistoryResponse, UVResponse
from app.services.uv_service import get_current_uv, get_uv_by_coordinates, get_uv_history


router = APIRouter(prefix="/api/uv", tags=["uv"])


@router.get("/current", response_model=UVResponse)
def current_uv(
    location: str | None = Query(default=None, description="Location name such as Melbourne or Melbourne, VIC."),
) -> UVResponse:
    return get_current_uv(location)


@router.get("/by-coordinates", response_model=UVResponse)
def uv_by_coordinates(
    lat: float = Query(description="Latitude in decimal degrees."),
    lng: float = Query(description="Longitude in decimal degrees."),
) -> UVResponse:
    return get_uv_by_coordinates(lat, lng)


@router.get("/history", response_model=UVHistoryResponse)
def uv_history(
    location: str | None = Query(default=None, description="Location name such as Melbourne or Melbourne, VIC."),
) -> UVHistoryResponse:
    return get_uv_history(location)
