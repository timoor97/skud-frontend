'use server'
import { fetchWithAuth } from "@/config/interceptor"
import { CreateRoleRequest } from "@/types/rolesTypes"

export const getRoles = async (locale: string, page: number, name?: string, limit?: number) => {
  let url = `/roles?page=${page}&limit=${limit || 10}`
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

export const getRole = async (locale: string, id: number | null) => {
  const res = await fetchWithAuth(`/roles/${id}`, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const createRole = async (data: CreateRoleRequest, locale?: string) => {
  const res = await fetchWithAuth('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const responseData = await res.json()
  
  // If the response is not ok, throw an error with the response data
  if (!res.ok) {
    const error = new Error('Role creation failed') as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = responseData
    throw error
  }
  
  return { data: responseData }
}

export const updateRole = async (data: CreateRoleRequest, id: number, locale?: string) => {
  const res = await fetchWithAuth(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const responseData = await res.json()
  
  // If the response is not ok, throw an error with the response data
  if (!res.ok) {
    const error = new Error('Role update failed') as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = responseData
    throw error
  }
  
  return { data: responseData }
}

export const deleteRole = async (id: number, locale?: string) => {
  const res = await fetchWithAuth(`/roles/${id}`, {
    method: 'DELETE',
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const data = await res.json()
  return { data }
}