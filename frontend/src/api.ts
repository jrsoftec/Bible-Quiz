import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)
  const response = await api.post('/token', formData)
  return response.data
}

export async function register(email: string, password: string) {
  const response = await api.post('/register', { email, password })
  return response.data
}

export async function fetchQuestions(token: string) {
  const response = await api.get('/questions', { headers: authHeader(token) })
  return response.data
}

export async function submitAnswer(token: string, questionId: number, selectedChoiceId: number) {
  const response = await api.post(
    `/questions/${questionId}/answer`,
    { selected_choice_id: selectedChoiceId },
    { headers: authHeader(token) }
  )
  return response.data
}

export async function fetchScore(token: string) {
  const response = await api.get('/score', { headers: authHeader(token) })
  return response.data
}

export async function uploadImage(token: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/admin/upload-image', formData, {
    headers: {
      ...authHeader(token),
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function createQuestion(token: string, payload: any) {
  const response = await api.post('/admin/questions', payload, { headers: authHeader(token) })
  return response.data
}

export async function bulkCreateQuestions(token: string, payload: any) {
  const response = await api.post('/admin/questions/bulk', payload, { headers: authHeader(token) })
  return response.data
}
