export type NavItem = {
  label: string
  path: string
}

export type FeatureItem = {
  id: string
  story: string
  title: string
  category: string
  description: string
  benefit: string
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

export const coreFeatures: FeatureItem[] = [
  {
    id: 'epic1',
    story: 'EPIC 1',
    title: 'Track local UV levels',
    category: 'Track',
    description:
      'The homepage keeps live local UV information front and center so users can see risk immediately.',
    benefit: 'US1.1 Must have: real-time localised UV alerts.',
    path: '/',
  },
  {
    id: 'epic2',
    story: 'EPIC 2',
    title: 'Understand skin impact',
    category: 'Understand',
    description:
      'Visualisations and skin-tone guidance turn climate and health data into simple awareness.',
    benefit: 'US2.1 Must have plus US2.2 Should have.',
    path: '/skin-guide',
  },
  {
    id: 'epic3',
    story: 'EPIC 3',
    title: 'Prevent overexposure',
    category: 'Prevent',
    description:
      'Protection guidance translates awareness into clothing, dosage, and reminder actions.',
    benefit: 'US3.3 Must have with US3.1 and US3.2 as supporting stories.',
    path: '/prevention',
  },
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
    label: 'US2.1 outcome',
    value: 'Users can see how invisible UV exposure connects to long-term skin harm and cancer trends.',
  },
  {
    label: 'US2.2 outcome',
    value: 'Users can compare how skin-tone context changes urgency, timing, and advice emphasis.',
  },
  {
    label: 'Design goal',
    value: 'Complex health and climate information should feel readable within a few seconds.',
  },
]
