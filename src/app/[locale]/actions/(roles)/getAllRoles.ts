'use server'

import { getRoles } from "@/services/roleService"


export const getRole = async (locale: string, page: number = 1, name?: string, limit?: number) => {
  const { data } = await getRoles(locale, page, name, limit)
  return data
}