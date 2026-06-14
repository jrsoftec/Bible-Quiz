import { useState } from 'react'
import { createQuestion, bulkCreateQuestions, uploadImage } from '../api'

interface Props {
  token: string
}

export default function AdminPage({ token }: Props) {
  const [text, setText] = useState('')
  const [choices, setChoices] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const submitSingle = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      let uploadedUrl = imageUrl
      if (imageFile) {
        const uploadResult = await uploadImage(token, imageFile)
        uploadedUrl = uploadResult.image_url
      }
      await createQuestion(token, {
        text,
        choices,
        correct_choice_index: correctIndex,
        youtube_url: youtubeUrl || undefined,
        image_url: uploadedUrl || undefined,
      })
      setMessage('Question uploaded successfully')
    } catch (error) {
      setMessage('Failed to upload question')
    }
  }

  const submitBulk = async () => {
    const payload = [
      {
        text: 'Who built the ark?',
        choices: ['Moses', 'Noah', 'Abraham', 'Jacob'],
        correct_choice_index: 1,
      },
    ]
    try {
      await bulkCreateQuestions(token, payload)
      setMessage('Bulk upload sent')
    } catch (error) {
      setMessage('Bulk upload failed')
    }
  }

  return (
    <main className="container">
      <h1>Admin Upload</h1>
      <form onSubmit={submitSingle}>
        <label>
          Question text
          <textarea value={text} onChange={(e) => setText(e.target.value)} required />
        </label>
        {choices.map((choice, index) => (
          <label key={index}>
            Choice {index + 1}
            <input
              value={choice}
              onChange={(e) => {
                const next = [...choices]
                next[index] = e.target.value
                setChoices(next)
              }}
              required
            />
          </label>
        ))}
        <label>
          Correct answer index
          <input
            type="number"
            min={0}
            max={choices.length - 1}
            value={correctIndex}
            onChange={(e) => setCorrectIndex(Number(e.target.value))}
          />
        </label>
        <label>
          YouTube URL
          <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
        </label>
        <label>
          Image file upload
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
        </label>
        <label>
          Or direct image URL
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
        <button type="submit">Upload Question</button>
      </form>
      <button onClick={submitBulk}>Upload Sample Bulk Questions</button>
      {message && <p>{message}</p>}
    </main>
  )
}
