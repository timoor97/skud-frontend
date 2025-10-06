'use server'
import { fetchWithAuth } from "@/config/interceptor"

export const getUsersInSingleDevice = async (
  locale: string, 
  faceDeviceId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getUsersInSingleDevice/${faceDeviceId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const getUsersOutSingleDevice = async (
  locale: string, 
  faceDeviceId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getUsersOutSingleDevice/${faceDeviceId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const addUsersToSingleDevice = async (
  locale: string,
  faceDeviceId: number,
  userIds: number[]
) => {
  const res = await fetchWithAuth('/faceDeviceUsers/addUsersToSingleDevice', {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      face_device_id: faceDeviceId,
      user_id: userIds
    })
  })
  
  const data = await res.json()
  
  // Check if the response contains an error
  if (!res.ok || data.error_class) {
    throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`)
  }
  
  return { data }
}

export const removeUsersFromSingleDevice = async (
  locale: string,
  faceDeviceId: number,
  userIds: number[]
) => {
  const res = await fetchWithAuth('/faceDeviceUsers/removeUsersInSingleDevice', {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      face_device_id: faceDeviceId,
      user_id: userIds
    })
  })
  
  const data = await res.json()
  
  // Check if the response contains an error
  if (!res.ok || data.error_class) {
    throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`)
  }
  
  return { data }
}

export const getDevicesInSingleUser = async (
  locale: string, 
  userId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getDevicesInSingleUser/${userId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const getDevicesOutSingleUser = async (
  locale: string, 
  userId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getDevicesOutSingleUser/${userId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const addSingleUserToDevices = async (
  locale: string,
  userId: number,
  faceDeviceIds: number[]
) => {
  const res = await fetchWithAuth('/faceDeviceUsers/addSingleUserToDevices', {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      face_device_id: faceDeviceIds,
      user_id: userId
    })
  })
  
  const data = await res.json()
  
  // Check if the response contains an error
  if (!res.ok || data.error_class) {
    throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`)
  }
  
  return { data }
}

export const removeSingleUserFromDevices = async (
  locale: string,
  userId: number,
  faceDeviceIds: number[]
) => {
  const res = await fetchWithAuth('/faceDeviceUsers/removeSingleUserInDevices', {
    method: 'POST',
    headers: {
      'Accept-Language': locale,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      face_device_id: faceDeviceIds,
      user_id: userId
    })
  })
  
  const data = await res.json()
  
  // Check if the response contains an error
  if (!res.ok || data.error_class) {
    throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`)
  }
  
  return { data }
}

export const getFaceDeviceRecords = async (
  locale: string,
  faceDeviceId: number,
  page: number = 1,
  name?: string,
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getDeviceRecords/${faceDeviceId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}

export const getUserRecords = async (
  locale: string,
  userId: number,
  page: number = 1,
  name?: string,
  limit: number = 10
) => {
  let url = `/faceDeviceUsers/getUserRecords/${userId}?page=${page}&limit=${limit}`
  
  if (name && name.trim() !== '') {
    url += `&name=${encodeURIComponent(name.trim())}`
  }

  const res = await fetchWithAuth(url, {
    headers: {
      'Accept-Language': locale
    }
  })
  const data = await res.json()
  return { data }
}
