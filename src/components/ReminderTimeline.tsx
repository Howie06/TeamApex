type ReminderItem = {
  time: string
  label: string
  detail: string
}

type ReminderTimelineProps = {
  items: ReminderItem[]
  enabled: boolean
  onToggle: () => void
}

function ReminderTimeline({ items, enabled, onToggle }: ReminderTimelineProps) {
  return (
    <>
      <div className="timeline-topline">
        <p className="timeline-caption">Reminder status follows the current UV risk and plan length.</p>
        <button
          className={`toggle-button ${enabled ? 'toggle-on' : ''}`.trim()}
          type="button"
          onClick={onToggle}
          aria-pressed={enabled}
        >
          {enabled ? 'On' : 'Off'}
        </button>
      </div>

      <div className="timeline">
        {items.map((item) => (
          <div className="timeline-item" key={item.time}>
            <span className="timeline-time">{item.time}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{enabled ? item.detail : 'Reminder notifications are paused.'}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ReminderTimeline
