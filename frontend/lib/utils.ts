import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// GENE SCOPE AI - DESIGN SYSTEM UTILITIES
// ===========================================

/**
 * Typography utilities for consistent text styling
 */
export const typography = {
  // Headings
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance',
  h3: 'text-2xl md:text-3xl font-bold text-foreground text-balance',
  h4: 'text-xl md:text-2xl font-bold text-foreground',
  h5: 'text-lg md:text-xl font-bold text-foreground',
  h6: 'text-base md:text-lg font-bold text-foreground',

  // Body text
  body: 'text-base text-foreground leading-relaxed',
  bodyLarge: 'text-lg text-foreground leading-relaxed',
  bodySmall: 'text-sm text-foreground leading-relaxed',

  // Muted text
  muted: 'text-muted-foreground',
  mutedSmall: 'text-sm text-muted-foreground',

  // Gradient text
  gradientPrimary: 'text-gradient-primary font-bold',
  gradientSecondary: 'text-gradient-secondary font-bold',
} as const

/**
 * Card utilities for consistent card styling
 */
export const cards = {
  // Base cards
  base: 'bg-card border border-border rounded-lg p-6',
  glass: 'card-glass rounded-lg p-6',
  glowPrimary: 'card-glow-primary rounded-lg p-6',
  glowSecondary: 'card-glow-secondary rounded-lg p-6',

  // Card variants
  feature: 'bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow',
  stat: 'bg-card border border-border rounded-lg p-6 text-center',
  testimonial: 'bg-card border border-border rounded-lg p-6 italic',
} as const

/**
 * Button utilities for consistent button styling
 */
export const buttons = {
  // Primary buttons
  primary: 'btn-primary',
  primaryLarge: 'btn-primary text-lg px-8 py-4',
  primarySmall: 'btn-primary text-sm px-4 py-2',

  // Secondary buttons
  secondary: 'btn-secondary',
  secondaryLarge: 'btn-secondary text-lg px-8 py-4',
  secondarySmall: 'btn-secondary text-sm px-4 py-2',

  // Accent buttons
  accent: 'btn-accent',
  accentLarge: 'btn-accent text-lg px-8 py-4',
  accentSmall: 'btn-accent text-sm px-4 py-2',

  // Ghost buttons
  ghost: 'bg-transparent border border-border text-foreground hover:bg-muted transition-colors px-4 py-2 rounded-lg',
  ghostPrimary: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 rounded-lg',

  // Link buttons
  link: 'text-primary hover:text-primary-hover underline-offset-4 hover:underline transition-colors',
} as const

/**
 * Layout utilities for consistent spacing and layout
 */
export const layout = {
  // Containers
  container: 'container-max',
  containerSmall: 'max-w-4xl mx-auto px-4',
  containerLarge: 'max-w-7xl mx-auto px-4',

  // Sections
  section: 'section-padding',
  sectionSmall: 'section-padding-sm',
  sectionLarge: 'section-padding-lg',

  // Grids
  grid: 'grid-responsive',
  gridCards: 'grid-cards',
  gridFeatures: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',

  // Flex utilities
  flexCenter: 'flex-center',
  flexBetween: 'flex-between',
  flexColumn: 'flex-column',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
} as const

/**
 * Animation utilities for consistent motion
 */
export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-500',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-500',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-500',

  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-300',
  scaleOut: 'animate-out zoom-out-95 duration-300',

  // Custom animations
  float: 'animate-float',
  pulseGlow: 'animate-pulse-glow',
  shimmer: 'animate-shimmer',

  // Hover effects
  hoverLift: 'hover:transform hover:-translate-y-1 transition-transform duration-300',
  hoverGlow: 'hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300',
} as const

/**
 * Glow effects for interactive elements
 */
export const glows = {
  primary: 'glow-primary',
  secondary: 'glow-secondary',
  accent: 'glow-accent',
  success: 'glow-success',
  warning: 'glow-warning',
  danger: 'glow-danger',
} as const

/**
 * Spacing utilities using design tokens
 */
export const spacing = {
  xs: 'var(--space-xs)',
  sm: 'var(--space-sm)',
  md: 'var(--space-md)',
  lg: 'var(--space-lg)',
  xl: 'var(--space-xl)',
  '2xl': 'var(--space-2xl)',
  '3xl': 'var(--space-3xl)',
  '4xl': 'var(--space-4xl)',
  '5xl': 'var(--space-5xl)',
  '6xl': 'var(--space-6xl)',
} as const

/**
 * Border radius utilities
 */
export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
} as const

/**
 * Shadow utilities
 */
export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const

/**
 * Utility function to combine design system classes
 */
export function ds(
  component: keyof typeof typography | keyof typeof cards | keyof typeof buttons | keyof typeof layout | keyof typeof animations,
  variant?: string,
  additional?: ClassValue
) {
  const componentMap = {
    ...typography,
    ...cards,
    ...buttons,
    ...layout,
    ...animations,
  }

  const baseClass = componentMap[component as keyof typeof componentMap] || ''
  return cn(baseClass, variant, additional)
}

/**
 * Utility for responsive text sizing
 */
export function responsiveText(base: string, md?: string, lg?: string) {
  return cn(base, md && `md:${md}`, lg && `lg:${lg}`)
}

/**
 * Utility for creating consistent focus styles
 */
export function focusRing(color: 'primary' | 'secondary' | 'accent' = 'primary') {
  return `focus:outline-none focus:ring-2 focus:ring-${color} focus:ring-offset-2 focus:ring-offset-background`
}

/**
 * Utility for creating consistent hover states
 */
export function hoverState(color: 'primary' | 'secondary' | 'accent' = 'primary') {
  return `hover:bg-${color} hover:text-${color}-foreground transition-colors duration-200`
}
