'use server'

import { getUsersInSingleDevice } from '@/services/faceDeviceUsersService';

export const getUsersInSingleDeviceAction = async (
  locale: string, 
  faceDeviceId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getUsersInSingleDevice(locale, faceDeviceId, page, name, limit)
  return data
}
