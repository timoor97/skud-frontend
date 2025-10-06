'use server'

import { getUserRecords } from '@/services/faceDeviceUsersService';

export const getUserRecordsAction = async (
  locale: string, 
  userId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getUserRecords(locale, userId, page, name, limit)
  return data
}
