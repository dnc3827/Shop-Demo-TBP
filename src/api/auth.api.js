import api from "@/services/axios"

export function loginApi(data) {
  return api.post("/api/auth/login", data)
}

export function registerApi(data) {
  return api.post("/api/auth/register", data)
}
