import { getAccessToken } from '@/services/authToken';

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiFetch(url: string, options: RequestInit = {}, withAuth: boolean = false) {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };
    
    // Only set Content-Type to application/json if body is not FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (withAuth) {
        const token = await getAccessToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    const fetchOptions: RequestInit = {
        ...options,
        headers,
        credentials: 'include',
    };

    const response = await fetch(`${BASE_API_URL}${url}`, fetchOptions);
    return response;
}

export const fetchClassic = (url: string, options?: RequestInit) => apiFetch(url, options, false);
export const fetchWithAuth = (url: string, options?: RequestInit) => apiFetch(url, options, true);
