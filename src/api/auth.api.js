import api from "@/services/axios"

export function loginApi(data) {
  return api.post("/auth/login", data)
}

export function registerApi(data) {
  return api.post("/auth/register", data)
}
