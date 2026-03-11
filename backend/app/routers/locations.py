from __future__ import annotations

from fastapi import APIRouter, Query

from app.schemas.location import LocationResponse
from app.services.location_service import list_locations, search_locations


router = APIRouter(prefix="/api/locations", tags=["locations"])


@router.get("", response_model=list[LocationResponse])
def get_locations() -> list[LocationResponse]:
    return list_locations()


@router.get("/search", response_model=list[LocationResponse])
def search_for_locations(
    q: str | None = Query(default=None, description="Search by location name, state, or seed terms."),
) -> list[LocationResponse]:
    return search_locations(q)
