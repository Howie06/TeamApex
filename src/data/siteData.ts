export type NavItem = {
  label: string
  path: string
}

export type SkinToneOption = {
  id: string
  label: string
  skinType: string
  swatch: string
}

export const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Skin Guide', path: '/skin-guide' },
  { label: 'Prevention', path: '/prevention' },
]

export const skinToneOptions: SkinToneOption[] = [
  {
    id: 'tone-light',
    label: 'Light',
    skinType: 'light',
    swatch: '#f3d7c1',
  },
  {
    id: 'tone-medium',
    label: 'Medium',
    skinType: 'medium',
    swatch: '#d4a784',
  },
  {
    id: 'tone-olive',
    label: 'Olive',
    skinType: 'olive',
    swatch: '#a77455',
  },
  {
    id: 'tone-deep',
    label: 'Deep',
    skinType: 'deep',
    swatch: '#6c4735',
  },
]

export const skinInterpretationRows = [
  {
    label: 'Awareness outcome',
    value: 'Users can see how invisible UV exposure connects to long-term skin harm and cancer trends.',
  },
  {
    label: 'Tone guidance outcome',
    value: 'Users can compare how skin-tone context changes urgency, timing, and advice emphasis.',
  },
  {
    label: 'Design goal',
    value: 'Complex health and climate information should feel readable within a few seconds.',
  },
]
