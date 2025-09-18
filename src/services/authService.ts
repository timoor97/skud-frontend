'use server'
import { fetchClassic } from "@/config/interceptor"
import { EnumTokens, IAuthForm } from "@/types/authTypes"
import { cookies } from "next/headers"


export const logIn = async (data: IAuthForm, locale?: string) => {
    const { login, password } = data
    const res = await fetchClassic('/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
        headers: locale ? { 'Accept-Language': locale } : {}
    })
    const responseData = await res.json()

    if (responseData.data.token) {
        // const hashedToken = hashToken(responseData.data.token); // Хэшируем токен перед сохранением
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const cookieStore = await cookies()
        cookieStore.set(EnumTokens.TOKEN, responseData.data.token)
        cookieStore.set(EnumTokens.TOKEN_EXPIRATION, expirationTime.toString(), { path: '/' })
    }
    return { data: responseData }
}


export const logout = async (token: string | undefined) => {
    const res = await fetchClassic('/logout', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const responseData = await res.json()
    if (responseData) {
        const cookieStore = await cookies()
        cookieStore.delete(EnumTokens.TOKEN)
        cookieStore.delete(EnumTokens.TOKEN_EXPIRATION)
    }
    return { data: responseData }
}