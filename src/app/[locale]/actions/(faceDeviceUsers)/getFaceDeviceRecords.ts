'use server'

import { getFaceDeviceRecords } from '@/services/faceDeviceUsersService';

export const getFaceDeviceRecordsAction = async (
  locale: string, 
  faceDeviceId: number, 
  page: number = 1, 
  name?: string, 
  limit: number = 10
) => {
  const { data } = await getFaceDeviceRecords(locale, faceDeviceId, page, name, limit)
  return data
}
