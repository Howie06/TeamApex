from __future__ import annotations

from fastapi import APIRouter

from app.schemas.awareness import AwarenessTrendResponse, MythFactListResponse
from app.services.awareness_service import get_myths, get_skin_cancer_trend, get_uv_trend


router = APIRouter(prefix="/api/awareness", tags=["awareness"])


@router.get("/skin-cancer-trend", response_model=AwarenessTrendResponse)
def skin_cancer_trend() -> AwarenessTrendResponse:
    return get_skin_cancer_trend()


@router.get("/uv-trend", response_model=AwarenessTrendResponse)
def uv_trend() -> AwarenessTrendResponse:
    return get_uv_trend()


@router.get("/myths", response_model=MythFactListResponse)
def myths() -> MythFactListResponse:
    return get_myths()
