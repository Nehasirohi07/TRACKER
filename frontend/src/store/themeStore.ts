import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'dark' | 'light' | 'cyberpunk' | 'purple' | 'minimal'
export type ThemeVariant = 'modern-dark' | 'cyber-neon' | 'purple-ai' | 'minimal-white' | 'emerald'

interface ThemeState {
  mode: ThemeMode
  variant: ThemeVariant
  setMode: (mode: ThemeMode) => void
  setVariant: (variant: ThemeVariant) => void
}

const getVariantFromMode = (mode: ThemeMode): ThemeVariant => {
  const mapping: Record<ThemeMode, ThemeVariant> = {
    dark: 'modern-dark',
    light: 'minimal-white',
    cyberpunk: 'cyber-neon',
    purple: 'purple-ai',
    minimal: 'emerald',
  }
  return mapping[mode]
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      variant: 'modern-dark',
      setMode: (mode) => set({ mode, variant: getVariantFromMode(mode) }),
      setVariant: (variant) => set({ variant }),
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Theme CSS variables for each theme
export const getThemeStyles = (variant: ThemeVariant): Record<string, string> => {
  const themes: Record<ThemeVariant, Record<string, string>> = {
    'modern-dark': {
      '--bg-primary': '#0a0c10',
      '--bg-secondary': '#12141c',
      '--bg-tertiary': '#1a1d28',
      '--bg-card': '#252a38',
      '--bg-hover': '#353b4a',
      '--text-primary': '#f3f4f6',
      '--text-secondary': '#9ca3af',
      '--text-muted': '#6b7280',
      '--accent-primary': '#5c993d',
      '--accent-secondary': '#4d8033',
      '--accent-hover': '#3d6526',
      '--accent-glow': 'rgba(92, 153, 61, 0.3)',
      '--border-color': '#353b4a',
      '--border-subtle': '#252a38',
      '--success': '#22c55e',
      '--warning': '#f59e0b',
      '--error': '#ef4444',
      '--info': '#3b82f6',
    },
    'cyber-neon': {
      '--bg-primary': '#0a0a12',
      '--bg-secondary': '#12121f',
      '--bg-tertiary': '#1a1a2e',
      '--bg-card': '#1e1e32',
      '--bg-hover': '#2a2a42',
      '--text-primary': '#e0e0ff',
      '--text-secondary': '#8888aa',
      '--text-muted': '#555577',
      '--accent-primary': '#00ffff',
      '--accent-secondary': '#ff00ff',
      '--accent-hover': '#00ccaa',
      '--accent-glow': 'rgba(0, 255, 255, 0.3)',
      '--border-color': '#3a3a5a',
      '--border-subtle': '#2a2a42',
      '--success': '#00ff88',
      '--warning': '#ffaa00',
      '--error': '#ff3366',
      '--info': '#00aaff',
    },
    'purple-ai': {
      '--bg-primary': '#0f0a1a',
      '--bg-secondary': '#151025',
      '--bg-tertiary': '#1d1430',
      '--bg-card': '#241a3d',
      '--bg-hover': '#2d2148',
      '--text-primary': '#f0e6ff',
      '--text-secondary': '#a88cba',
      '--text-muted': '#6b5580',
      '--accent-primary': '#9333ea',
      '--accent-secondary': '#7c3aed',
      '--accent-hover': '#a855f7',
      '--accent-glow': 'rgba(147, 51, 234, 0.3)',
      '--border-color': '#3d2a52',
      '--border-subtle': '#2d1a3d',
      '--success': '#34d399',
      '--warning': '#fbbf24',
      '--error': '#f87171',
      '--info': '#60a5fa',
    },
    'minimal-white': {
      '--bg-primary': '#fafafa',
      '--bg-secondary': '#f5f5f5',
      '--bg-tertiary': '#eeeeee',
      '--bg-card': '#ffffff',
      '--bg-hover': '#e8e8e8',
      '--text-primary': '#171717',
      '--text-secondary': '#525252',
      '--text-muted': '#a3a3a3',
      '--accent-primary': '#171717',
      '--accent-secondary': '#404040',
      '--accent-hover': '#000000',
      '--accent-glow': 'rgba(23, 23, 23, 0.1)',
      '--border-color': '#e5e5e5',
      '--border-subtle': '#f0f0f0',
      '--success': '#16a34a',
      '--warning': '#ca8a04',
      '--error': '#dc2626',
      '--info': '#2563eb',
    },
    'emerald': {
      '--bg-primary': '#031a14',
      '--bg-secondary': '#042820',
      '--bg-tertiary': '#063830',
      '--bg-card': '#074838',
      '--bg-hover': '#0a5c48',
      '--text-primary': '#ecfdf5',
      '--text-secondary': '#6ee7b7',
      '--text-muted': '#34d399',
      '--accent-primary': '#10b981',
      '--accent-secondary': '#059669',
      '--accent-hover': '#34d399',
      '--accent-glow': 'rgba(16, 185, 129, 0.3)',
      '--border-color': '#065f46',
      '--border-subtle': '#064e3b',
      '--success': '#34d399',
      '--warning': '#fbbf24',
      '--error': '#f87171',
      '--info': '#38bdf8',
    },
  }
  return themes[variant]
}
