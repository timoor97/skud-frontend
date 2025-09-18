export interface IncludesRole {
    id: number
    name: string
    key: string
}
export interface CreateUserRequest {
  first_name: string;
  last_name?: string;
  phone?: string;
  role_id: number;
  login: string;
  password: string;
  status?: boolean;
  image?: File | string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  role_id: number;
  login: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  includes: {
    role: IncludesRole
  };
  role: string;  // Added role property
  status: boolean;  // Added status property
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

export interface UserListResponseData {
  models: UserListItem[];
  meta: MetaData;
}

export type UserListApiResponse = ApiResponse<UserListResponseData>;

// GET ONE
export interface Role {
  id: number;
  name: string;
}

export interface Includes {
  role: Role;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  role_id: number;
  login: string;
  created_at: string;
  updated_at: string;
  includes: Includes;
  status: boolean;
  image?: File | string | null;
}

export type UserApiResponse = ApiResponse<User>;