import type { SkinToneOption } from '../data/siteData'

type SkinToneGuideProps = {
  profiles: SkinToneOption[]
  selectedToneId: string
  onSelect: (toneId: string) => void
}

function SkinToneGuide({ profiles, selectedToneId, onSelect }: SkinToneGuideProps) {
  return (
    <div className="tone-picker" role="list" aria-label="Skin tone options">
      {profiles.map((tone) => (
        <button
          key={tone.id}
          className={`tone-button ${tone.id === selectedToneId ? 'tone-button-active' : ''}`.trim()}
          style={{ backgroundColor: tone.swatch }}
          type="button"
          onClick={() => onSelect(tone.id)}
          aria-pressed={tone.id === selectedToneId}
        >
          <span className="sr-only">{tone.label}</span>
        </button>
      ))}
    </div>
  )
}

export default SkinToneGuide
