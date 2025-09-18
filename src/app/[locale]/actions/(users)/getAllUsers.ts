'use server'

import {getUsers} from "@/services/usersService"

export const getAllUsers = async (locale: string, page: number = 1, name?: string, role_id?: number | string, status?: boolean) => {
    const {data} = await getUsers(locale, page, name, role_id, status)
    return data
}