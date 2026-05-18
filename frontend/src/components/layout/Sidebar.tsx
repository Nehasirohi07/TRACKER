import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  CheckCircle,
  Heart,
  BookOpen,
  Dumbbell,
  Timer,
  MessageSquare,
  User,
  Settings,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
  { to: '/missions', icon: Target, label: 'Missions' },
  { to: '/goals', icon: CheckCircle, label: 'Goals' },
  { to: '/habits', icon: Heart, label: 'Habits' },
  { to: '/learning', icon: BookOpen, label: 'Learning' },
  { to: '/fitness', icon: Dumbbell, label: 'Fitness' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/chat', icon: MessageSquare, label: 'AI Mentor' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function Sidebar() {
  return (
    <aside 
      className="w-64 border-r flex flex-col p-4"
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
                isActive
                  ? 'bg-[var(--accent-primary)]/10 border-l-2'
                  : 'hover:bg-[var(--bg-hover)]'
              )
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
            })}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
              isActive
                ? 'bg-[var(--accent-primary)]/10 border-l-2'
                : 'hover:bg-[var(--bg-hover)]'
            )
          }
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
          })}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}