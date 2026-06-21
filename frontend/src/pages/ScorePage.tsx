import { useEffect, useState } from 'react'
import { fetchScore } from '../api'

interface Props {
  token: string
}

export default function ScorePage({ token }: Props) {
  const [score, setScore] = useState<{ total_answered: number; total_correct: number; accuracy: number } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScore(token)
      .then(setScore)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load score'
        setError(message)
      })
  }, [token])

  if (error) {
    return (
      <main className="container">
        <h1>Score</h1>
        <p className="error">{error}</p>
      </main>
    )
  }

  if (!score) {
    return (
      <main className="container">
        <h1>Score</h1>
        <p>Loading score...</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1>Your Score</h1>
      <p>Answered: {score.total_answered}</p>
      <p>Correct: {score.total_correct}</p>
      <p>Accuracy: {score.accuracy.toFixed(2)}%</p>
    </main>
  )
}
