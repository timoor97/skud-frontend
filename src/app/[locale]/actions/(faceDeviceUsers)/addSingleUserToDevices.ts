'use server'

import { addSingleUserToDevices } from '@/services/faceDeviceUsersService';

export const addSingleUserToDevicesAction = async (
  locale: string,
  userId: number,
  faceDeviceIds: number[]
) => {
  const { data } = await addSingleUserToDevices(locale, userId, faceDeviceIds)
  return data
}
