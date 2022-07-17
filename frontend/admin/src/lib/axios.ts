import realAxios, { AxiosError } from "axios"
import { getToken } from "./storage";

export const axios = realAxios.create({
  headers: {
    "Content-Type": "application/json",
  }
})

export const defaultHeaders = {
  "Content-Type": "application/json",
}

export function authenticatedHeader() {
  const token = getToken()

  if (!token) {
    return {}
  }

  return { "Authorization": `Bearer ${token}` }
}

export function getErrorMessage(err: AxiosError): string {
  if (err.response) {
    if (err.response.data.message) {
      return err.response.data.message
    }
  }
  return err.message
}
