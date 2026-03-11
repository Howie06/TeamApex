from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class LocationModel:
    id: int
    name: str
    state: str
    country: str
    latitude: float
    longitude: float
    search_terms: str
    peak_window: str


@dataclass(slots=True)
class UVReadingModel:
    id: int
    location_id: int
    uv_index: float
    recorded_at: str
    source: str


@dataclass(slots=True)
class AwarenessStatModel:
    id: int
    category: str
    label: str
    metric_value: float
    unit: str
    description: str
    sort_order: int


@dataclass(slots=True)
class ProtectionRuleModel:
    id: int
    min_uv: float
    max_uv: float
    risk_level: str
    clothing_advice: str
    sunscreen_advice: str
    general_advice: str
    checklist_json: str
    dosage_advice: str
    dosage_json: str


@dataclass(slots=True)
class MythFactModel:
    id: int
    title: str
    myth: str
    fact: str
    category: str
    sort_order: int


@dataclass(slots=True)
class SkinToneGuidanceModel:
    id: int
    skin_type: str
    min_uv: float
    max_uv: float
    burn_window: str
    guidance: str
    emphasis: str


@dataclass(slots=True)
class ReminderModel:
    id: int
    title: str
    reminder_time: str
    frequency: str
    status: str
    notes: str
    created_at: str
    updated_at: str
