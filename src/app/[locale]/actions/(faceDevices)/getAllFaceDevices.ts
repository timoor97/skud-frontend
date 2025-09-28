'use server'

import { getFaceDevices } from '@/services/faceDevicesService';

export async function getAllFaceDevices(locale: string, page: number = 1, name?: string, type?: string, status?: string) {
  const { data } = await getFaceDevices(locale, page, name, type, status)
  return data
}
