'use server'
import { fetchWithAuth } from "@/config/interceptor"


export const getCurrentUser = async (locale: string) => {
  const res = await fetchWithAuth('/user', {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}