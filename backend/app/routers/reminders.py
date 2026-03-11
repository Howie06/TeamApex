from __future__ import annotations

from fastapi import APIRouter, Path, status

from app.schemas.common import MessageResponse
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate
from app.services.reminder_service import (
    create_reminder,
    delete_reminder,
    list_reminders,
    update_reminder,
)


router = APIRouter(prefix="/api/reminders", tags=["reminders"])


@router.get("", response_model=list[ReminderResponse])
def get_reminders() -> list[ReminderResponse]:
    return list_reminders()


@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def post_reminder(payload: ReminderCreate) -> ReminderResponse:
    return create_reminder(payload)


@router.patch("/{reminder_id}", response_model=ReminderResponse)
def patch_reminder(
    payload: ReminderUpdate,
    reminder_id: int = Path(ge=1),
) -> ReminderResponse:
    return update_reminder(reminder_id, payload)


@router.delete("/{reminder_id}", response_model=MessageResponse)
def remove_reminder(reminder_id: int = Path(ge=1)) -> MessageResponse:
    delete_reminder(reminder_id)
    return MessageResponse(message=f"Reminder {reminder_id} deleted.")
