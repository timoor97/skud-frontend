import { Permission } from "./permissionsTypes";

export interface IncludesRole {
    id: number
    name: string
    key: string
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  role_id: number;
  organization_id: number | null;
  login: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  includes: {
    role: IncludesRole;
  };
  permissions: Permission[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export type UserDetailsResponse = ApiResponse<User>;