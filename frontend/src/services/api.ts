import { useAuthStore } from '@/store/authStore'

// Use relative path so vite proxy handles the routing
const API_BASE = '/api'

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type')

  let data: any = null

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()
    data = text ? { message: text } : null
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return data as T
}

/* =========================
   CORE API WRAPPER
========================= */

export const api = {
  get: <T = any>(endpoint: string) => fetchApi<T>(endpoint),

  post: <T = any>(endpoint: string, data: any) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T = any>(endpoint: string, data: any) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T = any>(endpoint: string) =>
    fetchApi<T>(endpoint, {
      method: 'DELETE',
    }),
}

/* =========================
   AUTH API
========================= */

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (email: string, password: string, username?: string) =>
    api.post('/auth/register', { email, password, username }),

  me: () => api.get('/auth/me'),
}

/* =========================
   CHAT API
========================= */

export const chatApi = {
  send: (message: string) =>
    api.post('/chat', { message }),

  sendStream: (message: string, sessionId?: string) =>
    api.post('/chat/stream', { message, session_id: sessionId }),

  history: () => api.get('/chat/history'),

  clear: () => api.delete('/chat/history'),
}

/* =========================
   MISSIONS API
========================= */

export const missionsApi = {
  getAll: () => api.get('/missions'),
  getDaily: () => api.get('/missions/daily'),
  create: (data: any) => api.post('/missions', data),
  update: (id: number, data: any) => api.put(`/missions/${id}`, data),
  complete: (id: number) => api.post(`/missions/${id}/complete`, {}),
  delete: (id: number) => api.delete(`/missions/${id}`),
  search: (query: string) =>
    api.get(`/missions/search?q=${encodeURIComponent(query)}`),
}

/* =========================
   GOALS API
========================= */

export const goalsApi = {
  getAll: () => api.get('/goals'),
  getActive: () => api.get('/goals/active'),
  create: (data: any) => api.post('/goals', data),
  update: (id: number, data: any) => api.put(`/goals/${id}`, data),
  updateProgress: (id: number, progress: number) =>
    api.put(`/goals/${id}/progress`, { progress }),
  delete: (id: number) => api.delete(`/goals/${id}`),
  search: (query: string) =>
    api.get(`/goals/search?q=${encodeURIComponent(query)}`),
}

/* =========================
   HABITS API
========================= */

export const habitsApi = {
  getAll: () => api.get('/habits'),
  getToday: () => api.get('/habits/today'),
  create: (data: any) => api.post('/habits', data),
  update: (id: number, data: any) => api.put(`/habits/${id}`, data),
  complete: (id: number) => api.post(`/habits/${id}/complete`, {}),
  delete: (id: number) => api.delete(`/habits/${id}`),
}

/* =========================
   GAMIFICATION API
========================= */

export const gamificationApi = {
  getXP: () => api.get('/gamification/xp'),
  getAchievements: () => api.get('/gamification/achievements'),
  getXPLogs: () => api.get('/gamification/xp-history'),
}

/* =========================
   ANALYTICS API
========================= */

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  weekly: () => api.get('/analytics/weekly'),
  domains: () => api.get('/analytics/domains'),
}

/* =========================
   FITNESS API
========================= */

export const fitnessApi = {
  getLogs: () => api.get('/fitness/logs'),
  addLog: (data: any) => api.post('/fitness/logs', data),
  getStats: () => api.get('/fitness/stats'),
  deleteLog: (id: number) => api.delete(`/fitness/logs/${id}`),
}

/* =========================
   USER API
========================= */

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats'),
}

/* =========================
   NOTIFICATIONS API
========================= */

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`, {}),

  markAllAsRead: () =>
    api.put('/notifications/read-all', {}),
}

/* =========================
   LEARNING API
========================= */

export const learningApi = {
  getByDomain: (domain: string) => api.get(`/learning/${domain}`),
  create: (data: any) => api.post('/learning', data),
  update: (id: number, data: any) => api.put(`/learning/${id}`, data),
  delete: (id: number) => api.delete(`/learning/${id}`),
}

/* =========================
   POMODORO API
========================= */

export const pomodoroApi = {
  start: (data: any) => api.post('/pomodoro/start', data),
  complete: (id: number, data: any) => api.post(`/pomodoro/${id}/complete`, data),
  stats: () => api.get('/pomodoro/stats'),
  history: () => api.get('/pomodoro/history'),
}
