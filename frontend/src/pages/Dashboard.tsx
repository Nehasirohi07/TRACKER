import { useNavigate } from 'react-router-dom'
import { analyticsApi, gamificationApi, habitsApi } from '@/services/api'
import { Trophy, Target, Flame, Zap, CheckCircle, Clock, TrendingUp, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: dashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard(),
  })

  const { data: xpData } = useQuery({
    queryKey: ['xp'],
    queryFn: () => gamificationApi.getXP(),
  })

  const { data: todayHabits } = useQuery({
    queryKey: ['habits-today'],
    queryFn: () => habitsApi.getToday(),
  })

  const stats = [
    { 
      label: 'Total XP', 
      value: xpData?.total_xp || 0, 
      icon: Zap, 
      color: 'var(--warning)',
      subtext: `${xpData?.level || 1} Level`
    },
    { 
      label: 'Rank', 
      value: xpData?.rank || 'Private', 
      icon: Trophy, 
      color: 'var(--accent-primary)',
      subtext: `${xpData?.xp_to_next_rank || 0} to next`
    },
    { 
      label: 'Completed', 
      value: dashboard?.missions?.completed || 0, 
      icon: CheckCircle, 
      color: 'var(--success)',
      subtext: 'Missions'
    },
    { 
      label: 'Today', 
      value: dashboard?.missions?.today_completed || 0, 
      icon: Clock, 
      color: 'var(--info)',
      subtext: `/ ${dashboard?.missions?.today_total || 0} done`
    },
  ]

  const progressPercent = xpData?.next_rank_xp
    ? ((xpData.total_xp - xpData.current_rank_xp) / (xpData.next_rank_xp - xpData.current_rank_xp)) * 100
    : 0

  const completedHabits = todayHabits?.filter((h: any) => h.completed_today)?.length || 0
  const totalHabits = todayHabits?.length || 0

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Command Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ color: 'var(--text-muted)' }}
            className="mt-1"
          >
            Welcome back, Operative. Your mission awaits.
          </motion.p>
        </div>
        <button 
          onClick={() => navigate('/missions')} 
          className="btn-primary flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          New Mission
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: 'var(--text-muted)' }} className="text-sm">{stat.label}</span>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.subtext}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rank Progress */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Rank Progress</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Current: {xpData?.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>Lv.{xpData?.level || 1}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{xpData?.total_xp || 0} XP</p>
              </div>
            </div>
            
            <div className="mb-2 flex justify-between text-sm">
              <span style={{ color: 'var(--text-muted)' }}>{xpData?.current_rank_xp || 0} XP</span>
              <span style={{ color: 'var(--accent-primary)' }}>{xpData?.next_rank_xp ? `${xpData.next_rank_xp} XP` : 'Max Rank'}</span>
            </div>
            <div className="progress-bar h-3">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progressPercent)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
              {xpData?.xp_to_next_rank || 0} XP to next rank
            </p>
          </div>
        </motion.div>

        {/* Today's Habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Habits</h3>
              <span className="badge badge-info">{completedHabits}/{totalHabits}</span>
            </div>
            <div className="space-y-3">
              {todayHabits?.slice(0, 5).map((habit: any) => (
                <div 
                  key={habit.id} 
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-hover)' }}
                >
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      habit.completed_today ? 'bg-[var(--success)]' : ''
                    }`}
                    style={{ 
                      backgroundColor: habit.completed_today ? 'var(--success)' : 'var(--bg-card)',
                      border: '2px solid var(--border-color)'
                    }}
                  >
                    {habit.completed_today && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span 
                    className="flex-1"
                    style={{ color: habit.completed_today ? 'var(--text-muted)' : 'var(--text-primary)' }}
                  >
                    {habit.name}
                  </span>
                  {habit.completed_today && (
                    <Flame className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                  )}
                </div>
              ))}
              {(!todayHabits || todayHabits.length === 0) && (
                <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  No habits for today
                </p>
              )}
            </div>
            <button 
              className="btn-secondary w-full mt-4"
              onClick={() => navigate('/habits')}
            >
              View All Habits
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'View Missions', icon: Target, path: '/missions', color: 'var(--accent-primary)' },
          { label: 'Set Goals', icon: TrendingUp, path: '/goals', color: 'var(--warning)' },
          { label: 'AI Chat', icon: Star, path: '/chat', color: 'var(--info)' },
          { label: 'Profile', icon: Trophy, path: '/profile', color: 'var(--success)' },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            onClick={() => navigate(action.path)}
            className="card flex items-center gap-4 hover:scale-105 transition-transform"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: action.color }}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Mission Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Mission Status</h3>
          <button 
            onClick={() => navigate('/missions')}
            className="text-sm hover:underline"
            style={{ color: 'var(--accent-primary)' }}
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Today's Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {dashboard?.missions?.today_completed || 0}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>/ {dashboard?.missions?.today_total || 0}</span>
            </div>
            <div className="progress-bar mt-2">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${dashboard?.missions?.today_total ? ((dashboard.missions.today_completed / dashboard.missions.today_total) * 100) : 0}%` 
                }} 
              />
            </div>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Overall Completion</p>
            <span className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
              {dashboard?.missions?.completion_rate || 0}%
            </span>
          </div>
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Total Missions</p>
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dashboard?.missions?.total || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}