import { useEffect, useState } from 'react'
import { fetchQuestions, submitAnswer } from '../api'

interface Props {
  token: string
}

export default function QuizPage({ token }: Props) {
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuestions(token)
      .then(setQuestions)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load questions'
        setError(message)
      })
  }, [token])

  const question = questions[currentIndex]

  const handleAnswer = async (choiceId: number) => {
    if (!question) return
    try {
      const result = await submitAnswer(token, question.id, choiceId)
      setFeedback(result.correct ? 'Correct!' : 'Incorrect.')
      setTimeout(() => {
        setFeedback('')
        setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
      }, 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit answer'
      setError(message)
    }
  }

  if (error) {
    return (
      <main className="container">
        <h1>Quiz</h1>
        <p className="error">{error}</p>
      </main>
    )
  }

  if (!question) {
    return (
      <main className="container">
        <h1>Quiz</h1>
        <p>No questions found.</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1>Quiz</h1>
      <article>
        <p>{question.text}</p>
        {question.image_url && <img src={question.image_url} alt="question" />}
        {question.youtube_url && (
          <iframe
            title="video"
            width="560"
            height="315"
            src={question.youtube_url.replace('watch?v=', 'embed/')}
            allowFullScreen
          />
        )}
        <div className="choices">
          {question.choices.map((choice: any) => (
            <button key={choice.id} onClick={() => handleAnswer(choice.id)}>{choice.text}</button>
          ))}
        </div>
        {feedback && <p>{feedback}</p>}
      </article>
    </main>
  )
}
