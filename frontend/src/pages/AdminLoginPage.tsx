import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

interface Props {
  onLogin: (token: string) => void
}

export default function AdminLoginPage({ onLogin }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      const data = await login(email, password)
      if (!data.is_admin) {
        setError('Admin access required')
        return
      }
      onLogin(data.access_token)
      navigate('/admin')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Check credentials.'
      setError(message)
    }
  }

  return (
    <main className="container">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login as Admin</button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  )
}
