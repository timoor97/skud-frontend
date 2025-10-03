'use server'

import { removeSingleUserFromDevices } from '@/services/faceDeviceUsersService';

export const removeSingleUserInDevicesAction = async (
  locale: string,
  userId: number,
  faceDeviceIds: number[]
) => {
  const { data } = await removeSingleUserFromDevices(locale, userId, faceDeviceIds)
  return data
}
