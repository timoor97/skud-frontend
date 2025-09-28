'use server'
import { fetchWithAuth } from "@/config/interceptor"
import { CreateFaceDeviceRequest } from "@/types/faceDevicesTypes"

export const getFaceDevices = async (locale: string, page: number, name?: string, type?: string, status?: string) => {
  let url = `/faceDevices?page=${page}`
  if (name) {
    url += `&name=${encodeURIComponent(name)}`
  }
  if (type) {
    url += `&type=${encodeURIComponent(type)}`
  }
  if (status) {
    url += `&status=${encodeURIComponent(status)}`
  }
  
  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const getFaceDevice = async (locale: string, id: number | null) => {
  const res = await fetchWithAuth(`/faceDevices/${id}`, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const createFaceDevice = async (data: CreateFaceDeviceRequest, locale?: string) => {
  const res = await fetchWithAuth('/faceDevices', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const responseData = await res.json()
  
  // If the response is not ok, throw an error with the response data
  if (!res.ok) {
    const error = new Error('Face device creation failed') as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = responseData
    throw error
  }
  
  return { data: responseData }
}

export const updateFaceDevice = async (data: CreateFaceDeviceRequest, id: number, locale?: string) => {
  const res = await fetchWithAuth(`/faceDevices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const responseData = await res.json()
  
  // If the response is not ok, throw an error with the response data
  if (!res.ok) {
    const error = new Error('Face device update failed') as Error & { status: number; data: unknown }
    error.status = res.status
    error.data = responseData
    throw error
  }
  
  return { data: responseData }
}

export const deleteFaceDevice = async (id: number, locale?: string) => {
  const res = await fetchWithAuth(`/faceDevices/${id}`, {
    method: 'DELETE',
    headers: locale ? { 'Accept-Language': locale } : {}
  })
  const data = await res.json()
  return { data }
}
