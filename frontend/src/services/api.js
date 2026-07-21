// frontend/src/services/api.js
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// ==========================================
// INTERCEPTEUR REQUÊTE - Ajout du token JWT
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ==========================================
// INTERCEPTEUR RÉPONSE - Gestion du refresh token
// ==========================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 et pas encore de tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem("refresh_token")

        if (!refresh) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(`${API_URL}/auth/refresh/`, { refresh })

        // Sauvegarder le nouveau token
        localStorage.setItem("access_token", response.data.access)

        // Rejouer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token invalide ou expiré
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api