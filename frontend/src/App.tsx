import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useThemeStore, getThemeStyles } from './store/themeStore'
import Layout from './components/layout/Layout'
import ToastContainer from './components/ui/Toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Missions from './pages/Missions'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import Learning from './pages/Learning'
import Fitness from './pages/Fitness'
import Pomodoro from './pages/Pomodoro'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function ThemeInitializer() {
  const variant = useThemeStore((state) => state.variant)
  
  useEffect(() => {
    const styles = getThemeStyles(variant)
    const root = document.documentElement
    Object.entries(styles).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [variant])

  return null
}

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/missions" element={<Missions />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/fitness" element={<Fitness />} />
                  <Route path="/pomodoro" element={<Pomodoro />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  )
}