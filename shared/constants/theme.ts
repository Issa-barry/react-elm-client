import { Platform } from 'react-native';

// ─── Palette bleue (PrimeVue blue) ─────────────────────────────────────────
export const blue = {
  50:  '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
} as const;

// ─── Surface slate (PrimeVue slate) ────────────────────────────────────────
export const slate = {
  50:  '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const;

// ─── Tokens Design ─────────────────────────────────────────────────────────
export const Colors = {
  // couleur principale
  primary:          blue[600],   // #2563eb
  primaryLight:     blue[100],   // #dbeafe
  primaryDark:      blue[700],   // #1d4ed8

  // fonds
  background:       '#e8edf5',   // fond général (inspiré PayPal)
  surface:          '#ffffff',   // cartes / composants sur le fond
  overlay:          '#ffffff',
  surfaceAlt:       slate[50],   // fond alternatif (inputs verrouillés, en-têtes)
  cardActive:       blue[50],    // fond d'item actif/sélectionné

  // textes
  text:             slate[950],  // quasi-noir
  textMuted:        slate[500],  // gris moyen
  textLight:        slate[400],

  // bordures & séparateurs
  border:           slate[200],
  borderLight:      slate[100],

  // états
  danger:           '#ef4444',
  warning:          '#f59e0b',
  success:          '#22c55e',

  // fonds sémantiques (badges, alertes)
  dangerBg:         '#fee2e2',
  warningBg:        '#fef9c3',
  successBg:        '#dcfce7',
  infoBg:           '#eff6ff',

  // tab bar
  tabActive:        blue[600],
  tabInactive:      slate[400],

  // compatibilité ancien thème (ne pas casser les imports)
  light: {
    text:           slate[950],
    background:     '#e8edf5',
    tint:           blue[600],
    icon:           slate[500],
    tabIconDefault: slate[400],
    tabIconSelected: blue[600],
  },
} as const;

// ─── Palette sombre ────────────────────────────────────────────────────────
export const DarkColors = {
  primary:      blue[400],
  primaryLight: blue[900],
  primaryDark:  blue[300],

  background:   slate[950],
  surface:      slate[800],
  overlay:      slate[800],
  surfaceAlt:   slate[700],   // inputs verrouillés, en-têtes de table
  cardActive:   blue[900],    // item actif en mode sombre

  text:         slate[50],
  textMuted:    slate[400],
  textLight:    slate[500],

  border:       slate[700],
  borderLight:  slate[800],

  danger:       '#ef4444',
  warning:      '#f59e0b',
  success:      '#22c55e',

  // fonds sémantiques sombres
  dangerBg:     '#450a0a',
  warningBg:    '#451a03',
  successBg:    '#052e16',
  infoBg:       '#172554',

  tabActive:    blue[400],
  tabInactive:  slate[500],

  light: {
    text:            slate[50],
    background:      slate[950],
    tint:            blue[400],
    icon:            slate[400],
    tabIconDefault:  slate[500],
    tabIconSelected: blue[400],
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', system-ui, sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});
