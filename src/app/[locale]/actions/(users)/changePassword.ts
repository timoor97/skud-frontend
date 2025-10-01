'use server'

import { changePassword as changePasswordService } from "@/services/usersService"
import { ChangePasswordRequest } from "@/types/usersTypes"

export const changePassword = async (data: ChangePasswordRequest, id: number, locale?: string) => {
  const { data: responseData } = await changePasswordService(data, id, locale)
  return responseData
}
