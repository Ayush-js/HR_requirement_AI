import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-redirect to login if 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const register = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role })

// Job Descriptions
export const getJobDescriptions = () => api.get('/jobs')
export const createJobDescription = (data) => api.post('/jobs', data)

// Resume Screening
export const uploadResumes = (files, jobDescriptionId) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  formData.append('jobDescriptionId', jobDescriptionId)
  return api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const getRankedCandidates = (jobDescriptionId) =>
  api.get(`/resumes/ranked/${jobDescriptionId}`)
export const getResumeProfile = (resumeId) =>
  api.get(`/resumes/${resumeId}/profile`)
export const deleteResume = (resumeId) =>
  api.delete(`/resumes/${resumeId}`)

// Policy Q&A
export const uploadPolicy = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/policies/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const askPolicyQuestion = (question) =>
  api.post('/policies/ask', { question })
export const getAllPolicies = () => api.get('/policies')
export const deletePolicy = (id) => api.delete(`/policies/${id}`)

// Appraisals
export const generateAppraisal = (employeeId, rawNotes) =>
  api.post('/appraisals/generate', { employeeId, rawNotes })
export const finalizeAppraisal = (id) =>
  api.post(`/appraisals/${id}/finalize`)
export const getAppraisalsByEmployee = (employeeId) =>
  api.get(`/appraisals/employee/${employeeId}`)

// Offer Letters
export const generateOfferLetter = (data) =>
  api.post('/offers/generate', data)
export const finalizeOfferLetter = (id) =>
  api.post(`/offers/${id}/finalize`)
export const getAllOffers = () => api.get('/offers')

export default api