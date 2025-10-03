'use server'

import { getUsersOutSingleDevice } from '@/services/faceDeviceUsersService';

export const getUsersOutSingleDeviceAction = async (
  locale: string, 
  faceDeviceId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getUsersOutSingleDevice(locale, faceDeviceId, page, name, limit)
  return data
}
