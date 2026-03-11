from __future__ import annotations

from pydantic import BaseModel


class LocationResponse(BaseModel):
    id: int
    name: str
    state: str
    country: str
    latitude: float
    longitude: float
    display_name: str
    peak_window: str
