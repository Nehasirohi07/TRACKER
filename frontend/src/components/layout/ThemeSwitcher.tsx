import { useThemeStore, ThemeMode, getThemeStyles } from '@/store/themeStore'
import { useEffect } from 'react'
import { Sun, Moon, Zap, Sparkles, Palette } from 'lucide-react'

const themes: { mode: ThemeMode; label: string; icon: React.ReactNode; description: string }[] = [
  { mode: 'dark', label: 'Modern Dark', icon: <Moon className="w-4 h-4" />, description: 'Professional dark theme' },
  { mode: 'light', label: 'Minimal White', icon: <Sun className="w-4 h-4" />, description: 'Clean & minimal' },
  { mode: 'cyberpunk', label: 'Cyber Neon', icon: <Zap className="w-4 h-4" />, description: 'Neon cyber aesthetic' },
  { mode: 'purple', label: 'Purple AI', icon: <Sparkles className="w-4 h-4" />, description: 'AI-powered purple' },
  { mode: 'minimal', label: 'Emerald', icon: <Palette className="w-4 h-4" />, description: 'Productivity green' },
]

export default function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore()

  useEffect(() => {
    const styles = getThemeStyles(useThemeStore.getState().variant)
    const root = document.documentElement
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [mode])

  return (
    <div className="flex items-center gap-2">
      {themes.map((theme) => (
        <button
          key={theme.mode}
          onClick={() => setMode(theme.mode)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            mode === theme.mode
              ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)]'
              : 'opacity-60 hover:opacity-100'
          }`}
          style={{
            backgroundColor: mode === theme.mode ? 'var(--accent-primary)' : 'var(--bg-hover)',
            color: mode === theme.mode ? 'white' : 'var(--text-secondary)',
          }}
          title={theme.description}
        >
          {theme.icon}
        </button>
      ))}
    </div>
  )
}