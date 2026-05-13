// NativeTalk Design System — single source of truth for all colors, spacing, typography.

export const C = {
  // Backgrounds
  bg:          '#FFFBFA',   // warm cream – main screen background
  card:        '#FFFFFF',   // pure white cards
  cardAlt:     '#FFF6F0',   // light orange tint card

  // Primary brand orange
  primary:     '#E87028',   // main CTA orange
  primaryDark: '#C95E1E',   // pressed / darker orange
  primaryLight:'#FFF0E6',   // very light orange tint (chip bg, input focus)
  primaryMid:  '#FFD4B0',   // medium orange (dividers, tags)

  // Text
  text:        '#28221B',   // dark brown-black body text
  textSub:     '#7E6D66',   // secondary / muted text
  textPlaceholder: '#B8A49C', // placeholder
  textLight:   '#FFFFFF',   // text on dark/orange bg

  // Borders & dividers
  border:      '#EAD9D0',   // default input / card border
  divider:     '#F2E4DC',   // very light divider

  // Status
  success:     '#3CB371',
  successBg:   '#EAF7EE',
  error:       '#D84040',
  danger:      '#D84040',
  errorBg:     '#FDEAEA',
  warning:     '#F5A623',
  warningBg:   '#FEF8EC',

  // Misc
  overlay:     'rgba(40,34,27,0.45)',
  shadow:      '#28221B',
} as const;

export const F = {
  heading: 'Domine',
  body:    'Outfit',
  label:   'Epilogue',
} as const;

export const R = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;
