'use server'

import { addUsersToSingleDevice } from '@/services/faceDeviceUsersService';

export const addUsersToSingleDeviceAction = async (
  locale: string,
  faceDeviceId: number,
  userIds: number[]
) => {
  try {
    const { data } = await addUsersToSingleDevice(locale, faceDeviceId, userIds);
    return data;
  } catch (error: unknown) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to assign users to device');
    }
    throw new Error('Failed to assign users to device');
  }
}
