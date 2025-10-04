import { UserListItem } from './usersTypes'
import { CurrentUser } from './currentUserTypes'

// Define MetaData interface
export interface MetaData {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// Define API response type for users out device
export interface UsersOutDeviceResponse {
    data: {
        models?: UserListItem[]
        meta?: MetaData
    }
}

// Define user type for users out device (compatible with UserListItem)
export interface UserOutDevice {
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


// Export Props interface for components
export interface UsersOutDeviceProps {
    faceDeviceId: number
    deviceName?: string
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}
