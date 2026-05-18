export interface User {
  id: number
  email: string
  role: string
  is_active: boolean
  profile?: Profile
}

export interface Profile {
  id: number
  user_id: number
  username: string
  bio?: string
  avatar_url?: string
  current_rank: string
  current_level: number
  total_xp: number
  timezone: string
}

export interface Mission {
  id: number
  user_id: number
  title: string
  description?: string
  domain?: string
  priority: string
  status: string
  due_date?: string
  completed_at?: string
  xp_reward: number
  is_daily: boolean
  created_at: string
}

export interface Goal {
  id: number
  user_id: number
  title: string
  description?: string
  domain?: string
  target_date?: string
  progress: number
  status: string
  created_at: string
}

export interface Habit {
  id: number
  user_id: number
  name: string
  description?: string
  domain?: string
  frequency: string
  streak: number
  best_streak: number
  is_active: boolean
  completed_today?: boolean
}

export interface XPInfo {
  total_xp: number
  level: number
  rank: string
  current_rank_xp: number
  next_rank_xp?: number
  xp_to_next_rank: number
}

export interface XPLog {
  id: number
  description: string
  source: string
  amount: number
  created_at: string
}

export interface LearningResource {
  id: number
  resource_name: string
  resource_type: 'course' | 'project' | 'book' | 'lab'
  progress: number
  completed?: boolean
  domain?: string
}

export interface NotificationItem {
  id: number
  title: string
  message: string
  time: string
  read?: boolean
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon?: string
  xp_reward: number
  category: string
  earned: boolean
  earned_at?: string
}

export interface ChatMessage {
  role: string
  content: string
}

export interface FitnessLog {
  id: number
  workout_type: string
  duration_minutes: number
  calories_burned: number
  notes?: string
  logged_at: string
}

export interface DashboardData {
  missions: {
    total: number
    completed: number
    completion_rate: number
    today_total: number
    today_completed: number
  }
  profile: {
    level: number
    rank: string
    total_xp: number
  }
}