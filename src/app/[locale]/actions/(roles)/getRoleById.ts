'use server'

import { getRole } from "@/services/roleService"


export const getRoleById = async (locale: string, id: number | null) => {
  const { data } = await getRole(locale, id)
  return data
}