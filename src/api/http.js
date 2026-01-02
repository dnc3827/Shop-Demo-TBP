import axios from "axios"

const http = axios.create({
  baseURL: "https://localhost:7136/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// tự gắn token nếu có
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http
