import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/Input'
import { missionsApi } from '@/services/api'
import { useToastStore } from '@/store/toastStore'
import { Plus, CheckCircle, Circle, Trash2, AlertCircle, Target } from 'lucide-react'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

const domains = ['All', 'coding', 'aiml', 'cybersec', 'cds', 'ssc', 'english', 'fitness']
const priorities = ['critical', 'high', 'medium', 'low']

export default function Missions() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [newMission, setNewMission] = useState({ 
    title: '', 
    domain: 'coding', 
    priority: 'medium',
    description: '',
    xp_reward: 10
  })
  const addToast = useToastStore((state) => state.addToast)

  const { data: missions, isLoading, error, refetch } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      try {
        const result = await missionsApi.getAll()
        return result || []
      } catch (err) {
        console.error('Failed to fetch missions:', err)
        throw err
      }
    },
    retry: 2,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => missionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      setShowForm(false)
      setNewMission({ 
        title: '', 
        domain: 'coding', 
        priority: 'medium',
        description: '',
        xp_reward: 10
      })
      addToast('success', 'Mission created successfully!')
    },
    onError: () => {
      addToast('error', 'Failed to create mission')
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => missionsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      addToast('success', 'Mission completed! XP earned.')
    },
    onError: () => {
      addToast('error', 'Failed to complete mission')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => missionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      addToast('success', 'Mission deleted')
    },
    onError: () => {
      addToast('error', 'Failed to delete mission')
    },
  })

  const missionsList = Array.isArray(missions) ? missions : []
  const filteredMissions = filter === 'All' 
    ? missionsList 
    : missionsList.filter((m: any) => m.domain === filter)

  const pendingCount = missionsList.filter((m: any) => m.status === 'pending').length
  const completedCount = missionsList.filter((m: any) => m.status === 'completed').length
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMission.title.trim()) {
      addToast('warning', 'Please enter a mission title')
      return
    }
    createMutation.mutate(newMission)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'var(--error)'
      case 'high': return 'var(--warning)'
      case 'medium': return 'var(--info)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Missions</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-1">Your daily objectives and tasks</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Mission
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--warning)' }}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Pending</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--success)' }}>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Completed</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <Circle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">Total</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{missionsList.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Mission Title *</label>
                <Input
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                  placeholder="Complete LeetCode problem"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Domain</label>
                <select
                  className="input-field"
                  value={newMission.domain}
                  onChange={(e) => setNewMission({ ...newMission, domain: e.target.value })}
                >
                  {domains.slice(1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Priority</label>
                <select
                  className="input-field"
                  value={newMission.priority}
                  onChange={(e) => setNewMission({ ...newMission, priority: e.target.value })}
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Mission'}
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
            <p style={{ color: 'var(--text-primary)' }}>Failed to load missions</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Please check your connection</p>
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

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-20 rounded-lg" />
          ))}
        </div>
      ) : filteredMissions.length === 0 ? (
        <div className="card text-center py-12">
          <Target className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No missions yet. Create your first mission!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map((mission: any, index: number) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => mission.status !== 'completed' && completeMutation.mutate(mission.id)}
                    className="mt-1"
                    disabled={mission.status === 'completed'}
                  >
                    {mission.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    ) : (
                      <Circle className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>
                  <div>
                    <h3 className={cn(
                      "font-medium",
                      mission.status === 'completed' ? 'line-through' : ''
                    )} style={{ color: mission.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {mission.title}
                    </h3>
                    {mission.description && (
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {mission.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this mission?')) {
                      deleteMutation.mutate(mission.id)
                    }
                  }}
                  className="p-1 rounded hover:bg-[var(--bg-hover)]"
                >
                  <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ 
                    backgroundColor: getPriorityColor(mission.priority) + '20',
                    color: getPriorityColor(mission.priority)
                  }}
                >
                  {mission.priority}
                </span>
                <span 
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                >
                  {mission.domain}
                </span>
                <span 
                  className={`px-2 py-0.5 rounded text-xs ${
                    mission.status === 'completed' ? 'badge-success' : 'badge-warning'
                  }`}
                >
                  {mission.status}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-sm" style={{ color: 'var(--accent-primary)' }}>
                  +{mission.xp_reward || 10} XP
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {mission.is_daily ? 'Daily' : 'One-time'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}