import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Timer, Play, Pause, RotateCcw, Coffee, CheckCircle } from 'lucide-react'

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60
const LONG_BREAK = 15 * 60

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work')
  const [sessions, setSessions] = useState(0)
  const [tasks, setTasks] = useState<{ id: number; name: string; completed: boolean }[]>([])
  const [newTask, setNewTask] = useState('')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      if (mode === 'work') {
        const newSessions = sessions + 1
        setSessions(newSessions)
        if (newSessions % 4 === 0) {
          setMode('longBreak')
          setTimeLeft(LONG_BREAK)
        } else {
          setMode('break')
          setTimeLeft(BREAK_TIME)
        }
      } else {
        setMode('work')
        setTimeLeft(WORK_TIME)
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, mode, sessions])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'work') {
      setTimeLeft(WORK_TIME)
    } else if (mode === 'break') {
      setTimeLeft(BREAK_TIME)
    } else {
      setTimeLeft(LONG_BREAK)
    }
  }

  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setMode(newMode)
    setIsRunning(false)
    if (newMode === 'work') setTimeLeft(WORK_TIME)
    else if (newMode === 'break') setTimeLeft(BREAK_TIME)
    else setTimeLeft(LONG_BREAK)
  }

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), name: newTask, completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const progress = mode === 'work'
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
    : mode === 'longBreak'
      ? ((LONG_BREAK - timeLeft) / LONG_BREAK) * 100
      : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Pomodoro Timer</h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1">Focus timer for productive study sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 text-center">
          <div className="flex gap-2 justify-center mb-6">
            {(['work', 'break', 'longBreak'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: mode === m ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  color: mode === m ? 'white' : 'var(--text-secondary)',
                }}
              >
                {m === 'work' ? 'Work' : m === 'break' ? 'Break' : 'Long Break'}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="var(--bg-hover)"
                strokeWidth="8"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke={mode === 'work' ? 'var(--accent-primary)' : 'var(--warning)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={toggleTimer} size="lg" className="w-32">
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={resetTimer} size="lg">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Coffee className="w-5 h-5" />
            <span>Sessions completed: {sessions}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Tasks</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a task..."
              className="input-field flex-1"
            />
            <Button onClick={addTask}>Add</Button>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-4">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 py-2">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ border: '2px solid var(--border-color)' }}
                      />
                    )}
                  </button>
                  <span
                    className="flex-1"
                    style={{
                      color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.name}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ color: 'var(--text-muted)' }}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Technique Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Work (25 min)</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Focus on a single task without interruptions.</p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5" style={{ color: 'var(--warning)' }} />
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Short Break (5 min)</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Rest and recharge. Stretch or grab water.</p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5" style={{ color: 'var(--info)' }} />
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Long Break (15 min)</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Take a longer break after 4 pomodoros.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
