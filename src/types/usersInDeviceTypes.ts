import { CurrentUser } from './currentUserTypes'

// Define MetaData interface
export interface MetaData {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// Define user type for users in device (compatible with UserListItem)
export interface UserInDevice {
    id: number
    first_name: string
    last_name: string
    image?: string | null
    phone?: string | null
    status: boolean
    includes?: {
        roles?: {
            id: number
            name: string
        }[]
    }
}

// Define user device status object
export interface UserDeviceStatus {
    user: UserInDevice
    user_status: string
    image_status: string
    card_status: string
}

// Define API response type for getting users in single device
export interface UsersInDeviceResponse {
    data: {
        models: UserDeviceStatus[]
        meta?: MetaData
    }
}

// Define request body type for removing users from single device
export interface RemoveUsersFromSingleDeviceRequest {
    face_device_id: number
    user_id: number[]
}

// Define API response type for removing users from single device
export interface RemoveUsersFromSingleDeviceResponse {
    data: {
        message?: string
        success?: boolean
    }
}

// Export Props interface for UsersInDevice component
export interface UsersInDeviceProps {
    faceDeviceId: number
    deviceName?: string
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    usersInDevice?: UsersInDeviceResponse
}
