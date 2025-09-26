'use server'

import { setLoginPassword as setLoginPasswordService } from "@/services/usersService"
import { SetLoginPasswordRequest } from "@/types/usersTypes"

export const setLoginPassword = async (data: SetLoginPasswordRequest, id: number, locale?: string) => {
  const { data: responseData } = await setLoginPasswordService(data, id, locale)
  return responseData
}
