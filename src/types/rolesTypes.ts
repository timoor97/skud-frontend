export interface CreateRoleRequest {
    name: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    description?: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    permissions: number[];
    key: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface RoleListItem {
    id: number;
    name: string;
    key: string;
    permissions: number[];
    created_at: string;
    updated_at: string;
}

export interface MetaData {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
        next: string | null;
        previous: string | null;
    };
}

export interface RoleListResponseData {
    models: RoleListItem[];
    meta: MetaData;
}

export type RoleListApiResponse = ApiResponse<RoleListResponseData>;

// GET ONE
export interface Role {
    id: number;
    name: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    description?: {
        uz?: string;
        ru?: string;
        en?: string;
    };
    key: string;
    permissions: { id: number; name: string }[];
    created_at: string;
    updated_at: string;
}

export type RoleApiResponse = ApiResponse<Role>;