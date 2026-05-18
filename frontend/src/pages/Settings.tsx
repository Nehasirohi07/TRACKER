import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, Globe, Database, LogOut } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    timezone: 'Asia/Kolkata',
    emailUpdates: false,
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1">Configure your operative profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Display Name</label>
            <Input placeholder="Your display name" className="max-w-md" />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Bio</label>
            <textarea
              className="input-field w-full max-w-md h-24 resize-none"
              placeholder="Tell us about yourself"
            />
          </div>
          <Button className="mt-2">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--text-primary)' }}>Push Notifications</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive reminders for tasks and habits</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="w-5 h-5 accent-[var(--accent-primary)]"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--text-primary)' }}>Email Updates</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weekly progress reports</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailUpdates}
              onChange={(e) => setSettings({ ...settings, emailUpdates: e.target.checked })}
              className="w-5 h-5 accent-[var(--accent-primary)]"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Timezone</label>
            <select
              className="input-field max-w-md"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>App Theme</label>
            <select
              className="input-field max-w-md"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'dark' | 'light' | 'cyberpunk' | 'purple' | 'minimal')}
            >
              <option value="dark">Modern Dark</option>
              <option value="light">Minimal White</option>
              <option value="cyberpunk">Cyber Neon</option>
              <option value="purple">Purple AI</option>
              <option value="minimal">Emerald</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button variant="secondary">Export Data (JSON)</Button>
            <Button variant="secondary">Export Data (CSV)</Button>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Download all your progress data for backup or analysis.
          </p>
        </CardContent>
      </Card>

      <Card className="p-0" style={{ borderColor: 'var(--error)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'var(--error)' }}>
            <Shield className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--text-primary)' }}>Logout</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign out from this device</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
