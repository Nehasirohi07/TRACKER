import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/Input'
import { fitnessApi } from '@/services/api'
import { useToastStore } from '@/store/toastStore'
import { Dumbbell, Flame, Timer, Plus, TrendingUp, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'

const workoutTypes = ['Running', 'Weight Training', 'Cardio', 'Yoga', 'HIIT', 'Swimming', 'Cycling', 'Other']

export default function Fitness() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [newLog, setNewLog] = useState({ workout_type: 'Running', duration_minutes: 30, calories_burned: 0, notes: '' })
  const addToast = useToastStore((state) => state.addToast)

  const { data: logs, isLoading } = useQuery({
    queryKey: ['fitness-logs'],
    queryFn: () => fitnessApi.getLogs(),
  })

  const { data: stats } = useQuery({
    queryKey: ['fitness-stats'],
    queryFn: () => fitnessApi.getStats(),
  })

  const addLogMutation = useMutation({
    mutationFn: (data: any) => fitnessApi.addLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-logs'] })
      queryClient.invalidateQueries({ queryKey: ['fitness-stats'] })
      setShowForm(false)
      setNewLog({ workout_type: 'Running', duration_minutes: 30, calories_burned: 0, notes: '' })
      addToast('success', 'Workout logged successfully!')
    },
    onError: (err: any) => {
      addToast('error', err.message || 'Failed to log workout')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => fitnessApi.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-logs'] })
      queryClient.invalidateQueries({ queryKey: ['fitness-stats'] })
      addToast('success', 'Workout deleted')
    },
    onError: (err: any) => {
      addToast('error', err.message || 'Failed to delete workout')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLog.duration_minutes || newLog.duration_minutes <= 0) {
      addToast('warning', 'Please enter a valid duration')
      return
    }
    addLogMutation.mutate(newLog)
  }

  const filteredLogs = filterType === 'all'
    ? logs
    : logs?.filter((log: any) => log.workout_type === filterType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Fitness Center</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-1">Track workouts and build discipline</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Workout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Dumbbell className="w-8 h-8 mb-2" style={{ color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Total Workouts</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.total_workouts || 0}</p>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Timer className="w-8 h-8 mb-2" style={{ color: 'var(--info)' }} />
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Total Minutes</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.total_duration_minutes || 0}</p>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Flame className="w-8 h-8 mb-2" style={{ color: 'var(--warning)' }} />
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Calories Burned</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.total_calories || 0}</p>
        </motion.div>
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TrendingUp className="w-8 h-8 mb-2" style={{ color: 'var(--success)' }} />
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Avg Duration</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stats?.average_duration || 0} min</p>
        </motion.div>
      </div>

      {/* Add Workout Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Log New Workout</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-[var(--bg-hover)] rounded">
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Workout Type</label>
                <select
                  className="input-field"
                  value={newLog.workout_type}
                  onChange={(e) => setNewLog({ ...newLog, workout_type: e.target.value })}
                >
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Duration (min)</label>
                <Input
                  type="number"
                  value={newLog.duration_minutes}
                  onChange={(e) => setNewLog({ ...newLog, duration_minutes: parseInt(e.target.value) || 0 })}
                  min={1}
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Calories</label>
                <Input
                  type="number"
                  value={newLog.calories_burned}
                  onChange={(e) => setNewLog({ ...newLog, calories_burned: parseInt(e.target.value) || 0 })}
                  min={0}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Notes</label>
                <Input
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  placeholder="Optional notes"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={addLogMutation.isPending}>
                {addLogMutation.isPending ? 'Logging...' : 'Log Workout'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Workout Breakdown with delete */}
      {stats?.workout_breakdown && (
        <div className="card">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Workout Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.workout_breakdown).map(([type, count]) => (
              <motion.div
                key={type}
                className="bg-[var(--bg-hover)] rounded-lg p-4 text-center relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setFilterType(filterType === type ? 'all' : type)}
                style={{
                  border: filterType === type ? '2px solid var(--accent-primary)' : '2px solid transparent'
                }}
              >
                <Dumbbell className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{type}</p>
                <p style={{ color: 'var(--text-muted)' }}>{count as number} sessions</p>
              </motion.div>
            ))}
          </div>
          {filterType !== 'all' && (
            <div className="mt-4 flex items-center justify-between">
              <p style={{ color: 'var(--text-secondary)' }}>Filtering by: <span style={{ color: 'var(--accent-primary)' }}>{filterType}</span></p>
              <button
                onClick={() => setFilterType('all')}
                className="text-sm hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Workouts with delete button - now visible on hover */}
      <div className="card">
        <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Workouts</h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : filteredLogs?.length === 0 ? (
          <div className="text-center py-8">
            <Dumbbell className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>No workouts logged yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs?.slice(0, 15).map((log: any, index: number) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: 'var(--bg-hover)' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  >
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{log.workout_type}</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {new Date(log.logged_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p style={{ color: 'var(--accent-primary)' }} className="font-medium">{log.duration_minutes} min</p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{log.calories_burned} cal</p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(log.id)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[var(--bg-card)]"
                    style={{ color: 'var(--error)' }}
                    title="Delete workout"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
