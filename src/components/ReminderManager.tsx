import { useState, type FormEvent } from 'react'
import type {
  Reminder,
  ReminderCreatePayload,
  ReminderUpdatePayload,
} from '../types/api'

type ReminderManagerProps = {
  reminders: Reminder[]
  loading: boolean
  saving: boolean
  error: string | null
  onCreate: (payload: ReminderCreatePayload) => Promise<void>
  onUpdate: (reminderId: number, payload: ReminderUpdatePayload) => Promise<void>
  onDelete: (reminderId: number) => Promise<void>
}

const initialForm = {
  title: '',
  reminder_time: '12:30 PM',
  frequency: 'daily',
  status: 'active',
  notes: '',
}

function ReminderManager({
  reminders,
  loading,
  saving,
  error,
  onCreate,
  onDelete,
  onUpdate,
}: ReminderManagerProps) {
  const [form, setForm] = useState(initialForm)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    await onCreate({
      title: form.title.trim(),
      reminder_time: form.reminder_time,
      frequency: form.frequency,
      status: form.status,
      notes: form.notes.trim(),
    })

    setForm(initialForm)
  }

  return (
    <div className="reminder-manager">
      <form className="reminder-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Reminder title</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Afternoon sunscreen reapply"
          />
        </label>

        <div className="planner-form-grid reminder-form-grid">
          <label className="form-field">
            <span>Time</span>
            <input
              type="text"
              value={form.reminder_time}
              onChange={(event) =>
                setForm((current) => ({ ...current, reminder_time: event.target.value }))
              }
              placeholder="03:15 PM"
            />
          </label>

          <label className="form-field">
            <span>Frequency</span>
            <select
              value={form.frequency}
              onChange={(event) =>
                setForm((current) => ({ ...current, frequency: event.target.value }))
              }
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="form-field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>
        </div>

        <label className="form-field">
          <span>Notes</span>
          <input
            type="text"
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Before sport, commute, or lunch outdoors."
          />
        </label>

        <button className="header-action reminder-submit" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add reminder'}
        </button>
      </form>

      {error ? <p className="state-note state-note-error">{error}</p> : null}
      {loading ? <p className="state-note">Loading reminder plan...</p> : null}

      <div className="reminder-list">
        {reminders.map((reminder) => (
          <article className="timeline-item reminder-item-card" key={reminder.id}>
            <span className="timeline-time">{reminder.reminder_time}</span>
            <div className="reminder-item-body">
              <strong>{reminder.title}</strong>
              <p>{reminder.notes || 'No extra notes saved for this reminder.'}</p>

              <div className="reminder-item-controls">
                <select
                  value={reminder.frequency}
                  onChange={(event) => void onUpdate(reminder.id, { frequency: event.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="custom">Custom</option>
                </select>

                <input
                  type="text"
                  value={reminder.reminder_time}
                  onChange={(event) =>
                    void onUpdate(reminder.id, { reminder_time: event.target.value })
                  }
                />

                <button
                  className={`toggle-button ${reminder.status === 'active' ? 'toggle-on' : ''}`.trim()}
                  type="button"
                  onClick={() =>
                    void onUpdate(reminder.id, {
                      status: reminder.status === 'active' ? 'paused' : 'active',
                    })
                  }
                >
                  {reminder.status === 'active' ? 'Active' : 'Paused'}
                </button>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => void onDelete(reminder.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ReminderManager
