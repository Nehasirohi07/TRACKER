import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Input } from '@/components/ui/Input'
import { goalsApi } from '@/services/api'
import { useToastStore } from '@/store/toastStore'
import { Plus, Trash2, Target, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const domains = ['All', 'coding', 'aiml', 'cybersec', 'cds', 'ssc', 'english', 'fitness']

export default function Goals() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [newGoal, setNewGoal] = useState({ title: '', domain: 'coding', target_date: '' })
  const addToast = useToastStore((state) => state.addToast)

  const { data: goals, isLoading, error, refetch } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      try {
        const result = await goalsApi.getAll()
        return result || []
      } catch (err: any) {
        console.error('Failed to fetch goals:', err)
        throw err
      }
    },
    retry: 2,
    staleTime: 10000,
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await goalsApi.create(data)
      } catch (err: any) {
        console.error('Create goal error:', err)
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      setShowForm(false)
      setNewGoal({ title: '', domain: 'coding', target_date: '' })
      addToast('success', 'Goal created successfully!')
    },
    onError: () => {
      addToast('error', 'Failed to create goal. Please try again.')
    },
  })

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, progress }: { id: number; progress: number }) => 
      goalsApi.updateProgress(id, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
    onError: () => {
      addToast('error', 'Failed to update progress')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      addToast('success', 'Goal deleted')
    },
    onError: () => {
      addToast('error', 'Failed to delete goal')
    },
  })

  // Safely handle goals data
  const goalsList = Array.isArray(goals) ? goals : []
  const filteredGoals = filter === 'All' 
    ? goalsList 
    : goalsList.filter((g: any) => g.domain === filter)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) {
      addToast('warning', 'Please enter a goal title')
      return
    }
    createMutation.mutate(newGoal)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'var(--success)'
    if (progress >= 50) return 'var(--warning)'
    return 'var(--accent-primary)'
  }

  const activeGoals = goalsList.filter((g: any) => g.status === 'active')
  const completedGoals = goalsList.filter((g: any) => g.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Goals</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-1">Long-term objectives and milestones</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Total Goals</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{goalsList.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--warning)' }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Active</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeGoals.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Completed</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedGoals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Goal Title *</label>
                <Input
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Become AWS Certified"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Domain</label>
                <select
                  className="input-field"
                  value={newGoal.domain}
                  onChange={(e) => setNewGoal({ ...newGoal, domain: e.target.value })}
                >
                  {domains.slice(1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Target Date</label>
                <Input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Goal'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="card flex items-center gap-4" style={{ borderColor: 'var(--error)' }}>
          <AlertCircle className="w-6 h-6" style={{ color: 'var(--error)' }} />
          <div className="flex-1">
            <p style={{ color: 'var(--text-primary)' }}>Failed to load goals</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Please check your connection and try again</p>
          </div>
          <button className="btn-secondary" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {domains.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === d ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-lg" />
          ))}
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="card text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No goals yet. Set your first goal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map((goal: any, index: number) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span 
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ 
                        backgroundColor: 'var(--bg-hover)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {goal.domain || 'general'}
                    </span>
                    <span 
                      className={`px-2 py-0.5 rounded text-xs ${
                        goal.status === 'completed' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {goal.status || 'active'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this goal?')) {
                      deleteMutation.mutate(goal.id)
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar with percentage */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                  <span style={{ color: getProgressColor(goal.progress) }}>{goal.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress || 0}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ background: getProgressColor(goal.progress) }}
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress || 0}
                  onChange={(e) => {
                    const progress = parseInt(e.target.value)
                    updateProgressMutation.mutate({ id: goal.id, progress })
                  }}
                  className="flex-1"
                  disabled={goal.status === 'completed'}
                />
              </div>

              {goal.target_date && (
                <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}