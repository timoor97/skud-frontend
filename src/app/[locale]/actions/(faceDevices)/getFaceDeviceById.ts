'use server'

import { getFaceDevice } from '@/services/faceDevicesService';

export const getFaceDeviceById = async (locale: string, id: number) => {
  const { data } = await getFaceDevice(locale, id)
  return data
}
