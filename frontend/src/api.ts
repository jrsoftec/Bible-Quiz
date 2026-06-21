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
  try {
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Login failed'
    throw new Error(message)
  }
}

export async function register(email: string, password: string) {
  try {
    const response = await api.post('/register', { email, password })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Registration failed'
    throw new Error(message)
  }
}

export async function fetchQuestions(token: string) {
  try {
    const response = await api.get('/questions', { headers: authHeader(token) })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to fetch questions'
    throw new Error(message)
  }
}

export async function submitAnswer(token: string, questionId: number, selectedChoiceId: number) {
  try {
    const response = await api.post(
      `/questions/${questionId}/answer`,
      { selected_choice_id: selectedChoiceId },
      { headers: authHeader(token) }
    )
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to submit answer'
    throw new Error(message)
  }
}

export async function fetchScore(token: string) {
  try {
    const response = await api.get('/score', { headers: authHeader(token) })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to fetch score'
    throw new Error(message)
  }
}

export async function uploadImage(token: string, file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/admin/upload-image', formData, {
      headers: {
        ...authHeader(token),
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to upload image'
    throw new Error(message)
  }
}

export async function createQuestion(token: string, payload: any) {
  try {
    const response = await api.post('/admin/questions', payload, { headers: authHeader(token) })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to create question'
    throw new Error(message)
  }
}

export async function bulkCreateQuestions(token: string, payload: any) {
  try {
    const response = await api.post('/admin/questions/bulk', payload, { headers: authHeader(token) })
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.detail || error.message || 'Failed to create questions'
    throw new Error(message)
  }
}
