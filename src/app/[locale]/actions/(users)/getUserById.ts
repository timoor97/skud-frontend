'use server'

import { getUser } from "@/services/usersService"

export const getUserById = async (locale: string, id: number) => {
  const { data } = await getUser(locale, id)
  return data
}