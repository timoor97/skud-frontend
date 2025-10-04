import { FaceDevice } from './faceDevicesTypes'
import { CurrentUser } from './currentUserTypes'

// Define MetaData interface
export interface MetaData {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// Define API response type for devices out user
export interface DevicesOutUserResponse {
    data: {
        models?: FaceDevice[]
        meta?: MetaData
    }
}

// Export Props interface for components
export interface DevicesOutUserProps {
    userId: number
    userName?: string
    deviceActions: {
        action: string
    }[]
    currentUser: CurrentUser
}
