'use server'
import { fetchWithAuth } from "@/config/interceptor"

export const getPermissions = async (locale: string, page: number, name?: string) => {
  let url = `/permissions-group-by?page=${page}`
  if (name) {
    url += `&name=${encodeURIComponent(name)}`
  }
  
  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}
