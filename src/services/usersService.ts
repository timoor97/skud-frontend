'use server'
import { fetchWithAuth } from "@/config/interceptor"
import {CreateUserRequest, SetLoginPasswordRequest, ChangePasswordRequest} from "@/types/usersTypes"
import {revalidatePath} from "next/cache";

export const getUsers = async (locale: string, page: number, name?: string, role_id?: number | string, status?: boolean, limit?: number) => {
    let url = `/users?page=${page}&limit=${limit || 10}`
    
    if (name) {
        url += `&name=${encodeURIComponent(name)}`
    }
    if (role_id) {
        url += `&role_id=${role_id}`
    }
    if (status !== undefined) {
        url += `&status=${status}`
    }
    
    const res = await fetchWithAuth(url, {
        headers: {
            'Accept-Language': locale
        },
    })
    const data = await res.json()
    return { data }
}

export const getUser = async (locale: string, id: number | null) => {
    const res = await fetchWithAuth(`/users/${id}`, {
        headers: {
            'Accept-Language': locale
        }
    })
    const data = await res.json()
    return { data }
}

export const createUser = async (data: CreateUserRequest, locale?: string) => {
    // Always use FormData for user creation to handle file uploads
    const formData = new FormData();
    formData.append('first_name', String(data.first_name || ''));
    formData.append('last_name', String(data.last_name || ''));
    formData.append('phone', String(data.phone || ''));
    formData.append('card_number', String(data.card_number || ''));
    formData.append('role_id', String(data.role_id || 0));
    formData.append('status', data.status ? '1' : '0');
    
    // Handle image field
    if (data.image instanceof File) {
        formData.append('image', data.image);
    } else {
        formData.append('image', '');
    }
    
    const headers: Record<string, string> = {};
    
    if (locale) {
        headers['Accept-Language'] = locale;
    }
    
    const res = await fetchWithAuth('/users', {
        method: 'POST',
        body: formData,
        headers
    })

    const responseText = await res.text();
    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        throw new Error(`Server returned non-JSON: ${responseText.substring(0, 200)}`);
    }
    
    // If the response is not ok, throw an error with the response data
    if (!res.ok) {
        const error = new Error('User creation failed') as Error & { status: number; data: unknown }
        error.status = res.status
        error.data = responseData
        throw error
    }
    return { data: responseData }
}

export const updateUser = async (data: CreateUserRequest, id: number, locale?: string) => {
    // Always use FormData for user updates to handle file uploads
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('first_name', String(data.first_name || ''));
    formData.append('last_name', String(data.last_name || ''));
    formData.append('phone', String(data.phone || ''));
    formData.append('card_number', String(data.card_number || ''));
    formData.append('role_id', String(data.role_id || 0));
    formData.append('status', data.status ? '1' : '0');
    
    // Handle image field
    if (data.image instanceof File) {
        formData.append('image', data.image);
    } else {
        formData.append('image', '');
    }
    
    const headers: Record<string, string> = {};
    
    if (locale) {
        headers['Accept-Language'] = locale;
    }
    
    const res = await fetchWithAuth(`/users/${id}`, {
        method: 'POST', // Use POST for FormData with _method=PUT
        body: formData,
        headers
    })
    
    const responseData = await res.json()
    
    // If the response is not ok, throw an error with the response data
    if (!res.ok) {
        const error = new Error('User update failed') as Error & { status: number; data: unknown }
        error.status = res.status
        error.data = responseData
        throw error
    }
    
    return { data: responseData }
}

export const setLoginPassword = async (data: SetLoginPasswordRequest, id: number, locale?: string) => {
    const res = await fetchWithAuth(`/users/${id}/set-login-password`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: locale ? { 'Accept-Language': locale } : {}
    })
    const responseData = await res.json()

    revalidatePath(`/users/${id}/set-login-password`)
    return { data: responseData }
}
export const changePassword = async (data: ChangePasswordRequest, id: number, locale?: string) => {
    const res = await fetchWithAuth(`/users/${id}/change-password`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: locale ? { 'Accept-Language': locale } : {}
    })
    const responseData = await res.json()
    return { data: responseData }
}

export const deleteUser = async (id: number, locale?: string) => {
    const res = await fetchWithAuth(`/users/${id}`, {
        method: 'DELETE',
        headers: locale ? { 'Accept-Language': locale } : {}
    })
    const data = await res.json()
    return { data }
}

