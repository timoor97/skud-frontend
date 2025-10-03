'use server'

import { getDevicesOutSingleUser } from '@/services/faceDeviceUsersService';

export const getDevicesOutSingleUserAction = async (
  locale: string, 
  userId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getDevicesOutSingleUser(locale, userId, page, name, limit)
  return data
}
