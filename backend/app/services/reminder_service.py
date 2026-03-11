from __future__ import annotations

from datetime import datetime

from app.core.database import get_connection
from app.core.exceptions import NotFoundError
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate


def _row_to_response(row) -> ReminderResponse:
    return ReminderResponse(
        id=row["id"],
        title=row["title"],
        reminder_time=row["reminder_time"],
        frequency=row["frequency"],
        status=row["status"],
        notes=row["notes"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


def list_reminders() -> list[ReminderResponse]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT *
            FROM reminders
            ORDER BY reminder_time ASC, id ASC
            """
        ).fetchall()

    return [_row_to_response(row) for row in rows]


def create_reminder(payload: ReminderCreate) -> ReminderResponse:
    now = datetime.now().isoformat(timespec="seconds")

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO reminders (title, reminder_time, frequency, status, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.title,
                payload.reminder_time,
                payload.frequency,
                payload.status,
                payload.notes,
                now,
                now,
            ),
        )
        connection.commit()
        row = connection.execute(
            "SELECT * FROM reminders WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

    return _row_to_response(row)


def update_reminder(reminder_id: int, payload: ReminderUpdate) -> ReminderResponse:
    with get_connection() as connection:
        existing_row = connection.execute(
            "SELECT * FROM reminders WHERE id = ?",
            (reminder_id,),
        ).fetchone()

        if existing_row is None:
            raise NotFoundError(f"Reminder {reminder_id} was not found.")

        updated_values = {
            "title": payload.title if payload.title is not None else existing_row["title"],
            "reminder_time": (
                payload.reminder_time
                if payload.reminder_time is not None
                else existing_row["reminder_time"]
            ),
            "frequency": (
                payload.frequency
                if payload.frequency is not None
                else existing_row["frequency"]
            ),
            "status": payload.status if payload.status is not None else existing_row["status"],
            "notes": payload.notes if payload.notes is not None else existing_row["notes"],
            "updated_at": datetime.now().isoformat(timespec="seconds"),
            "id": reminder_id,
        }

        connection.execute(
            """
            UPDATE reminders
            SET title = :title,
                reminder_time = :reminder_time,
                frequency = :frequency,
                status = :status,
                notes = :notes,
                updated_at = :updated_at
            WHERE id = :id
            """,
            updated_values,
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM reminders WHERE id = ?",
            (reminder_id,),
        ).fetchone()

    return _row_to_response(row)


def delete_reminder(reminder_id: int) -> None:
    with get_connection() as connection:
        cursor = connection.execute(
            "DELETE FROM reminders WHERE id = ?",
            (reminder_id,),
        )
        connection.commit()

    if cursor.rowcount == 0:
        raise NotFoundError(f"Reminder {reminder_id} was not found.")
