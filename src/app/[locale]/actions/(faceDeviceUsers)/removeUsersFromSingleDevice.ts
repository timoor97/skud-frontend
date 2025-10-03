'use server'

import { removeUsersFromSingleDevice } from '@/services/faceDeviceUsersService';

export const removeUsersFromSingleDeviceAction = async (
  locale: string,
  faceDeviceId: number,
  userIds: number[]
) => {
  try {
    const { data } = await removeUsersFromSingleDevice(locale, faceDeviceId, userIds);
    return data;
  } catch (error: unknown) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to remove users from device');
    }
    throw new Error('Failed to remove users from device');
  }
}
