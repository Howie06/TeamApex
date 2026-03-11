from __future__ import annotations

from pydantic import BaseModel


class PreventionRecommendationResponse(BaseModel):
    uv_index: float
    risk_level: str
    clothing_advice: str
    sunscreen_advice: str
    general_advice: str
    checklist: list[str]


class DosageGuideItem(BaseModel):
    area: str
    amount: str
    note: str


class SunscreenDosageResponse(BaseModel):
    uv_index: float
    risk_level: str
    dosage_advice: str
    dosage_guide: list[DosageGuideItem]


class SkinGuidanceResponse(BaseModel):
    uv_index: float
    skin_type: str
    burn_window: str
    guidance: str
    emphasis: str
