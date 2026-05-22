// ─── Uncle Ernie Design System ───────────────────────────────────────────────
// Single source of truth for all colors, typography, spacing, and radii.
// Derived from the HTML mockups in /design/mockup.html

// MTA Subway Line Colors
export const LINE_COLORS: Record<string, string> = {
  '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
  '4': '#00933C', '5': '#00933C', '6': '#00933C',
  '7': '#B933AD',
  'A': '#0039A6', 'C': '#0039A6', 'E': '#0039A6',
  'B': '#FF6319', 'D': '#FF6319', 'F': '#FF6319', 'M': '#FF6319',
  'G': '#6CBE45',
  'J': '#996633', 'Z': '#996633',
  'L': '#A7A9AC',
  'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A', 'W': '#FCCC0A',
  'S': '#808183',
  'SIR': '#0039A6',
};

// Lines where text should be dark (light-colored backgrounds)
export const LINE_DARK_TEXT = new Set(['N', 'Q', 'R', 'W']);

// Brand Colors
export const BRAND = {
  blue:        '#0039A6',
  blueDark:    '#001F5E',
  blueLight:   '#6B9AFF',
  green:       '#264E36', // Pantone 350 — Roll Again button
  cream:       '#F5F0E8',
} as const;

// Dark Theme
export const DARK = {
  bgPage:      '#111111',
  bgPhone:     '#141414',
  bgCard:      '#1C1C1E',
  bgInput:     'rgba(245,240,232,0.07)',
  bgIconWell:  '#252527',
  bgSplitFlap: '#0D0D0D',
  bgFlap:      '#1E1E1E',
  bgMap:       '#1C2535',
  bgMapBlock:  '#1F2D3F',
  bgTabBar:    'rgba(20,20,20,0.95)',

  textPrimary:   '#F5F0E8',
  textSecondary: 'rgba(245,240,232,0.45)',
  textTertiary:  'rgba(245,240,232,0.3)',
  textLabel:     'rgba(245,240,232,0.4)',

  borderCard:   'rgba(245,240,232,0.05)',
  borderInput:  'rgba(245,240,232,0.12)',
  borderTabBar: 'rgba(245,240,232,0.07)',

  btnPrimaryBg:   '#F5F0E8',
  btnPrimaryText: '#141414',

  ratingColor: '#FCCC0A',
  openColor:   '#6CBE45',
} as const;

// Light Theme
export const LIGHT = {
  bgPage:      '#E8E4DC',
  bgPhone:     '#F7F3EC',
  bgCard:      '#FFFFFF',
  bgInput:     'transparent',
  bgIconWell:  '#F7F3EC',
  bgSplitFlap: '#1A1A1A',
  bgFlap:      '#2A2A2A',
  bgMap:       '#D8E8D0',
  bgMapBlock:  '#C8DCBF',
  bgTabBar:    'rgba(247,243,236,0.95)',

  textPrimary:   '#1A1A1A',
  textSecondary: 'rgba(26,26,26,0.45)',
  textTertiary:  'rgba(26,26,26,0.35)',
  textLabel:     'rgba(26,26,26,0.35)',

  borderCard:   '#EAE6DE',
  borderInput:  '#D8D2C8',
  borderTabBar: '#E0DBD2',

  btnPrimaryBg:   '#1A1A1A',
  btnPrimaryText: '#F7F3EC',

  ratingColor: '#D4900A',
  openColor:   '#2E7D32',
} as const;

export type Theme = typeof DARK;

// Typography
export const FONT = {
  black:      '900' as const,
  bold:       '700' as const,
  semibold:   '600' as const,
  regular:    '400' as const,
};

export const FONT_SIZE = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   15,
  lg:   16,
  xl:   18,
  '2xl': 22,
  '3xl': 28,
  '4xl': 30,
};

// Spacing
export const SPACE = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40,
};

// Border Radius
export const RADIUS = {
  sm:    6,
  md:    12,
  lg:    14,
  xl:    16,
  '2xl': 20,
  full:  999,
};
