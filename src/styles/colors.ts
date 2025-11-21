/**
 * Palette de couleurs LAU (Leadership Academy University)
 * 
 * Cette palette définit les couleurs officielles de la marque LAU
 * à utiliser dans toute l'application pour maintenir la cohérence visuelle.
 */

export const LAUColors = {
  // Couleur primaire - Rouge
  primary: {
    DEFAULT: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Couleur secondaire - Bleu foncé
  secondary: {
    DEFAULT: '#1e3a8a',
    light: '#3b82f6',
    dark: '#1e40af',
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Couleur tertiaire - Cyan/Bleu clair
  tertiary: {
    DEFAULT: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Noir - Pour les textes principaux
  black: {
    DEFAULT: '#111827',
    light: '#374151',
    dark: '#000000',
  },

  // Blanc - Pour les fonds et textes sur fond foncé
  white: {
    DEFAULT: '#ffffff',
    off: '#f9fafb',
  },

  // Couleurs neutres (gris) - Pour les éléments secondaires
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

/**
 * Utilisation des couleurs par contexte
 */
export const LAUColorUsage = {
  // Boutons principaux (CTA)
  primaryButton: {
    background: LAUColors.primary.DEFAULT,
    hover: LAUColors.primary.dark,
    text: LAUColors.white.DEFAULT,
  },

  // Boutons secondaires
  secondaryButton: {
    background: LAUColors.secondary.DEFAULT,
    hover: LAUColors.secondary.dark,
    text: LAUColors.white.DEFAULT,
  },

  // Boutons tertiaires
  tertiaryButton: {
    background: LAUColors.tertiary.DEFAULT,
    hover: LAUColors.tertiary.dark,
    text: LAUColors.white.DEFAULT,
  },

  // Liens
  link: {
    default: LAUColors.primary.DEFAULT,
    hover: LAUColors.primary.dark,
  },

  // Textes
  text: {
    primary: LAUColors.black.DEFAULT,
    secondary: LAUColors.neutral[600],
    tertiary: LAUColors.neutral[500],
    inverse: LAUColors.white.DEFAULT,
  },

  // Fonds
  background: {
    primary: LAUColors.white.DEFAULT,
    secondary: LAUColors.neutral[50],
    tertiary: LAUColors.neutral[100],
  },

  // Bordures
  border: {
    default: LAUColors.neutral[200],
    focus: LAUColors.primary.DEFAULT,
    error: LAUColors.primary.DEFAULT,
  },

  // États
  states: {
    success: LAUColors.tertiary.DEFAULT,
    error: LAUColors.primary.DEFAULT,
    warning: '#f59e0b',
    info: LAUColors.secondary.DEFAULT,
  },
};

/**
 * Classes Tailwind CSS correspondantes
 */
export const LAUTailwindClasses = {
  // Couleurs de texte
  text: {
    primary: 'text-red-600',
    secondary: 'text-blue-900',
    tertiary: 'text-cyan-600',
    black: 'text-gray-900',
    white: 'text-white',
  },

  // Couleurs de fond
  background: {
    primary: 'bg-red-600',
    secondary: 'bg-blue-900',
    tertiary: 'bg-cyan-600',
    black: 'bg-gray-900',
    white: 'bg-white',
  },

  // Couleurs de bordure
  border: {
    primary: 'border-red-600',
    secondary: 'border-blue-900',
    tertiary: 'border-cyan-600',
    black: 'border-gray-900',
    white: 'border-white',
  },

  // Couleurs de focus ring
  ring: {
    primary: 'ring-red-600',
    secondary: 'ring-blue-900',
    tertiary: 'ring-cyan-600',
  },

  // Hover states
  hover: {
    primaryBg: 'hover:bg-red-700',
    secondaryBg: 'hover:bg-blue-800',
    tertiaryBg: 'hover:bg-cyan-700',
    primaryText: 'hover:text-red-700',
    secondaryText: 'hover:text-blue-800',
    tertiaryText: 'hover:text-cyan-700',
  },
};

export default LAUColors;
