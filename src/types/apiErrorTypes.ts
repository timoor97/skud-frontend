// API Error Types
export interface ApiErrorResponse {
    error_class: string;
    message: string;
    status: number;
}

export interface AxiosErrorResponse {
    response?: {
        data?: ApiErrorResponse;
        status?: number;
    };
}

// Type guard function to check if error is an axios error
export const isAxiosError = (error: unknown): error is AxiosErrorResponse => {
    return error !== null && typeof error === 'object' && 'response' in error;
};
// Type guard function to check if error has response data
export const hasErrorResponse = (error: AxiosErrorResponse): error is AxiosErrorResponse & { response: { data: ApiErrorResponse; status: number } } => {
    return error.response !== undefined && 
           error.response.data !== undefined && 
           error.response.status !== undefined;
};

