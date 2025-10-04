'use server'

import { setPushUrl } from '@/services/faceDevicesService';
import { SetPushUrlRequest } from '@/types/faceDevicesTypes';

export const setFaceDevicePushUrl = async (data: SetPushUrlRequest, deviceId: number, locale: string) => {
  const { data: responseData } = await setPushUrl(data, deviceId, locale)
  return responseData
}
