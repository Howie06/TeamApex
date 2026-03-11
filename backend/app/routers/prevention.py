from __future__ import annotations

from fastapi import APIRouter, Query

from app.schemas.prevention import (
    PreventionRecommendationResponse,
    SkinGuidanceResponse,
    SunscreenDosageResponse,
)
from app.services.prevention_service import (
    get_recommendations,
    get_skin_guidance,
    get_sunscreen_dosage,
)


router = APIRouter(prefix="/api/prevention", tags=["prevention"])


@router.get("/recommendations", response_model=PreventionRecommendationResponse)
def prevention_recommendations(
    uv_index: float = Query(description="UV index to evaluate."),
) -> PreventionRecommendationResponse:
    return get_recommendations(uv_index)


@router.get("/sunscreen-dosage", response_model=SunscreenDosageResponse)
def sunscreen_dosage(
    uv_index: float = Query(description="UV index to evaluate."),
) -> SunscreenDosageResponse:
    return get_sunscreen_dosage(uv_index)


@router.get("/skin-guidance", response_model=SkinGuidanceResponse)
def skin_guidance(
    uv_index: float = Query(description="UV index to evaluate."),
    skin_type: str = Query(description="Seeded skin type: light, medium, olive, or deep."),
) -> SkinGuidanceResponse:
    return get_skin_guidance(uv_index, skin_type)
