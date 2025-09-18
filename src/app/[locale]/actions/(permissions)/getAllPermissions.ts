'use server'

import { getPermissions } from "@/services/permissionsService"

export const getAllPermissions = async (locale: string) => {
  const { data } = await getPermissions(locale, 1)
  return data
}