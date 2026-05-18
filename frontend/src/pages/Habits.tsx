import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { habitsApi } from '@/services/api'
import { Plus, Flame, Trash2, Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Habits() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', domain: 'fitness', frequency: 'daily' })

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => habitsApi.getAll(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => habitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setShowForm(false)
      setNewHabit({ name: '', domain: 'fitness', frequency: 'daily' })
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => habitsApi.complete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => habitsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newHabit)
  }

  const today = new Date().toDateString()
  const todayCompleted = habits?.filter((h: any) => {
    if (!h.last_completed) return false
    return new Date(h.last_completed).toDateString() === today
  }).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Habits</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-1">Build consistency with daily habits</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Total Habits</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{habits?.length || 0}</p>
        </Card>
        <Card className="p-6 text-center">
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Completed Today</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent-primary)' }}>{todayCompleted}</p>
        </Card>
        <Card className="p-6 text-center">
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">Best Streak</p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--warning)' }}>
            {Math.max(...(habits?.map((h: any) => h.best_streak) || [0]))}
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Morning Workout"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Domain</label>
                <select
                  className="input-field w-full"
                  value={newHabit.domain}
                  onChange={(e) => setNewHabit({ ...newHabit, domain: e.target.value })}
                >
                  <option value="fitness">Fitness</option>
                  <option value="coding">Coding</option>
                  <option value="english">English</option>
                  <option value="aiml">AI/ML</option>
                  <option value="cybersec">Cyber Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Frequency</label>
                <select
                  className="input-field w-full"
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Habit'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading habits...</p>
      ) : habits?.length === 0 ? (
        <Card className="p-12 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No habits yet. Create your first habit!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits?.map((habit: any) => (
            <Card key={habit.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{habit.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                    >
                      {habit.domain}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs"
                      style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                    >
                      {habit.frequency}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(habit.id)}
                  className="p-1 rounded hover:bg-[var(--bg-hover)]"
                >
                  <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => completeMutation.mutate(habit.id)}
                  className={cn(
                    'flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                    'hover:opacity-90'
                  )}
                  style={{
                    backgroundColor: habit.completed_today ? 'var(--accent-primary)' : 'var(--bg-hover)',
                    color: habit.completed_today ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  <Check className="w-4 h-4" />
                  Complete
                </button>
              </div>

              <div
                className="flex items-center gap-4 mt-4 pt-4"
                style={{ borderTop: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" style={{ color: 'var(--warning)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{habit.streak}</span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">streak</span>
                </div>
                <div className="text-right">
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">Best: </span>
                  <span style={{ color: 'var(--warning)' }}>{habit.best_streak}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
