'use server'

import { getDevicesInSingleUser } from '@/services/faceDeviceUsersService';

export const getDevicesInSingleUserAction = async (
  locale: string, 
  userId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getDevicesInSingleUser(locale, userId, page, name, limit)
  return data
}
