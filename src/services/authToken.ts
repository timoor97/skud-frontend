
import { EnumTokens } from "@/types/authTypes"
import { cookies } from "next/headers"



export const getAccessToken = async () => {
  const cookieStore = await cookies()
  const accesToken = cookieStore.get(EnumTokens.TOKEN)?.value
  return accesToken || null
}