import { useEffect, useState } from 'react'
import { createReminder, deleteReminder, listReminders, updateReminder } from '../lib/api'
import type {
  Reminder,
  ReminderCreatePayload,
  ReminderUpdatePayload,
} from '../types/api'

type ReminderState = {
  reminders: Reminder[]
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: ReminderState = {
  reminders: [],
  loading: true,
  saving: false,
  error: null,
}

export function useReminders() {
  const [state, setState] = useState<ReminderState>(initialState)

  useEffect(() => {
    let cancelled = false

    async function loadReminders() {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }))

      try {
        const reminders = await listReminders()

        if (cancelled) {
          return
        }

        setState({
          reminders,
          loading: false,
          saving: false,
          error: null,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setState({
          reminders: [],
          loading: false,
          saving: false,
          error: error instanceof Error ? error.message : 'Failed to load reminders.',
        })
      }
    }

    void loadReminders()

    return () => {
      cancelled = true
    }
  }, [])

  async function addReminder(payload: ReminderCreatePayload) {
    setState((current) => ({
      ...current,
      saving: true,
      error: null,
    }))

    try {
      const reminder = await createReminder(payload)
      setState((current) => ({
        ...current,
        reminders: [...current.reminders, reminder].sort((left, right) =>
          left.reminder_time.localeCompare(right.reminder_time),
        ),
        saving: false,
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to create reminder.',
      }))
    }
  }

  async function editReminder(reminderId: number, payload: ReminderUpdatePayload) {
    setState((current) => ({
      ...current,
      saving: true,
      error: null,
    }))

    try {
      const updatedReminder = await updateReminder(reminderId, payload)
      setState((current) => ({
        ...current,
        reminders: current.reminders
          .map((reminder) => (reminder.id === reminderId ? updatedReminder : reminder))
          .sort((left, right) => left.reminder_time.localeCompare(right.reminder_time)),
        saving: false,
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to update reminder.',
      }))
    }
  }

  async function removeReminder(reminderId: number) {
    setState((current) => ({
      ...current,
      saving: true,
      error: null,
    }))

    try {
      await deleteReminder(reminderId)
      setState((current) => ({
        ...current,
        reminders: current.reminders.filter((reminder) => reminder.id !== reminderId),
        saving: false,
      }))
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : 'Failed to delete reminder.',
      }))
    }
  }

  return {
    ...state,
    addReminder,
    editReminder,
    removeReminder,
  }
}
