import { Bell, Search, User, LogOut, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import ThemeSwitcher from './ThemeSwitcher'
import { Input } from '@/components/ui/Input'
import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Fetch notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<any[]>('/notifications'),
    refetchInterval: 30000,
    retry: false,
  })

  const unreadCount = notifications?.filter((n: any) => !n.read)?.length || 0

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`, {})
    } catch (err) {
      // Silently fail - UI is not critical
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Search functionality
  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults(null)
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`)
        setSearchResults(results)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults(null)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleResultClick = (type: string, id: number) => {
    setSearchQuery('')
    setShowResults(false)
    if (type === 'mission') navigate(`/missions?id=${id}`)
    else if (type === 'goal') navigate(`/goals?id=${id}`)
    else if (type === 'habit') navigate(`/habits?id=${id}`)
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b relative"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center gap-4">
        <h1
          className="font-display text-xl font-bold tracking-wider cursor-pointer"
          style={{ color: 'var(--accent-primary)' }}
          onClick={() => navigate('/dashboard')}
        >
          OP ASCEND
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-md mx-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && setShowResults(true)}
            placeholder="Search missions, goals, habits..."
            className="pl-10 pr-10"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSearchResults(null)
                setShowResults(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && searchResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full rounded-lg border shadow-lg z-50 max-h-80 overflow-y-auto"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {isSearching ? (
                <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  Searching...
                </div>
              ) : searchResults.total === 0 ? (
                <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.missions?.length > 0 && (
                    <div className="px-3 py-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>MISSIONS</p>
                      {searchResults.missions.map((m: any) => (
                        <button
                          key={m.id}
                          onClick={() => handleResultClick('mission', m.id)}
                          className="w-full text-left px-2 py-2 rounded hover:bg-[var(--bg-hover)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {m.title}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.goals?.length > 0 && (
                    <div className="px-3 py-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>GOALS</p>
                      {searchResults.goals.map((g: any) => (
                        <button
                          key={g.id}
                          onClick={() => handleResultClick('goal', g.id)}
                          className="w-full text-left px-2 py-2 rounded hover:bg-[var(--bg-hover)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {g.title}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.habits?.length > 0 && (
                    <div className="px-3 py-1">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>HABITS</p>
                      {searchResults.habits.map((h: any) => (
                        <button
                          key={h.id}
                          onClick={() => handleResultClick('habit', h.id)}
                          className="w-full text-left px-2 py-2 rounded hover:bg-[var(--bg-hover)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {h.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {/* Notification Bell with dropdown */}
        <div className="relative">
          <button
            className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)] relative"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--warning)' }}
              />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-lg z-50"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="p-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {!notifications || notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notif: any) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors border-b"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          opacity: notif.read ? 0.6 : 1,
                        }}
                      >
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {notif.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {notif.message}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {user?.profile?.username || user?.email?.split('@')[0]}
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {user?.profile?.current_rank || 'Private'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
