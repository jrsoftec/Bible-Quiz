import { useState } from 'react'
import { login, register } from '../api'

interface Props {
  onLogin: (token: string, isAdmin: boolean) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (isRegister) {
        await register(email, password)
      }
      const data = await login(email, password)
      onLogin(data.access_token, data.is_admin)
    } catch (err) {
      setError(isRegister ? 'Registration failed.' : 'Login failed. Check credentials.')
    }
  }

  return (
    <main className="container">
      <h1>Bible Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">{isRegister ? 'Register & Login' : 'Login'}</button>
        <button type="button" onClick={() => setIsRegister((prev) => !prev)}>
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </main>
  )
}
