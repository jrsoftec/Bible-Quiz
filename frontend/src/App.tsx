import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import QuizPage from './pages/QuizPage'
import ScorePage from './pages/ScorePage'

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('quiz_token')
    const storedAdmin = localStorage.getItem('quiz_is_admin')
    if (storedToken) {
      setToken(storedToken)
      setIsAdmin(storedAdmin === 'true')
    }
  }, [])

  const handleLogin = (token: string, admin: boolean) => {
    setToken(token)
    setIsAdmin(admin)
    localStorage.setItem('quiz_token', token)
    localStorage.setItem('quiz_is_admin', String(admin))
  }

  const handleAdminLogin = (token: string) => {
    setToken(token)
    setIsAdmin(true)
    localStorage.setItem('quiz_token', token)
    localStorage.setItem('quiz_is_admin', 'true')
  }

  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/admin-login" element={<AdminLoginPage onLogin={handleAdminLogin} />} />
      <Route path="/admin" element={isAdmin && token ? <AdminPage token={token} /> : <Navigate to="/admin-login" />} />
      <Route path="/quiz" element={token ? <QuizPage token={token} /> : <Navigate to="/" />} />
      <Route path="/score" element={token ? <ScorePage token={token} /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
