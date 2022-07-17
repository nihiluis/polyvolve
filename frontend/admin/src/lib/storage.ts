// This is insecure and should be changed.

export function saveToken(token: string) {
  localStorage.setItem("token", token)
}

export function getToken(): string {
  return localStorage.getItem("token")
}

export function clearToken() {
  localStorage.removeItem("token")
}
