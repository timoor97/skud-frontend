import { fetchClassic } from "@/config/interceptor"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { EnumTokens } from "@/types/authTypes"

export const POST = async (req: Request) => {
    try {
        const { login, password } = await req.json()

        // Get locale from Accept-Language header sent by the frontend
        const locale = req.headers.get('Accept-Language') || 'ru';

        // Call external backend directly
        const res = await fetchClassic('/login', {
            method: 'POST',
            body: JSON.stringify({ login, password }),
            headers: locale ? { 'Accept-Language': locale } : {}
        })
        const responseData = await res.json()

        // Check if login was successful
        if (!res.ok) {
            // Return the error response with the same status code
            return NextResponse.json(responseData, { status: res.status })
        }

        // Handle token storage only on successful login
        if (responseData.data?.token) {
            const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            const cookieStore = await cookies()
            cookieStore.set(EnumTokens.TOKEN, responseData.data.token)
            cookieStore.set(EnumTokens.TOKEN_EXPIRATION, expirationTime.toString(), { path: '/' })
        }

        return NextResponse.json(responseData)
    } catch (error) {
        console.error('Login API error:', error)
        
        // Generic error
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}