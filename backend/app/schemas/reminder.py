from __future__ import annotations

from pydantic import BaseModel, Field


class ReminderBase(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    reminder_time: str = Field(min_length=1, max_length=64)
    frequency: str = Field(default="daily", min_length=1, max_length=32)
    status: str = Field(default="active", min_length=1, max_length=32)
    notes: str = Field(default="", max_length=500)


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    reminder_time: str | None = Field(default=None, min_length=1, max_length=64)
    frequency: str | None = Field(default=None, min_length=1, max_length=32)
    status: str | None = Field(default=None, min_length=1, max_length=32)
    notes: str | None = Field(default=None, max_length=500)


class ReminderResponse(ReminderBase):
    id: int
    created_at: str
    updated_at: str
