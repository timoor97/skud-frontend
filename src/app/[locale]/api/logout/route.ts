import { fetchClassic } from "@/config/interceptor"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { EnumTokens } from "@/types/authTypes"

export const GET = async (req: Request) => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // Get locale from Accept-Language header
    const locale = req.headers.get('Accept-Language') || 'ru';

    // Call external backend directly
    const res = await fetchClassic('/logout', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            ...(locale ? { 'Accept-Language': locale } : {})
        }
    })
    const responseData = await res.json()

    // Clear cookies
    if (responseData) {
        cookieStore.delete(EnumTokens.TOKEN)
        cookieStore.delete(EnumTokens.TOKEN_EXPIRATION)
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}