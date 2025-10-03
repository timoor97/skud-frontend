import { CurrentUser } from './currentUserTypes'

// Define MetaData interface
export interface MetaData {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// Define device type for devices in user (compatible with FaceDevice)
export interface DeviceInUser {
    id: number
    name: string
    type: 'enter' | 'exit'
    status: 'active' | 'not_active'
    ip: string
    port: string
    username: string
    password: string
    last_checked_at?: string | null
    createdAt?: string
    updatedAt?: string
}

// Define device user status object
export interface DeviceUserStatus {
    faceDevice: DeviceInUser
    user_status: 'pending' | 'success' | 'failed'
    image_status: 'pending' | 'success' | 'failed'
    card_status: 'pending' | 'success' | 'failed'
}

// Define API response type for getting devices in single user
export interface DevicesInUserResponse {
    data: {
        models: DeviceUserStatus[]
        meta?: MetaData
    }
}

// Define request body type for adding single user to devices
export interface AddSingleUserToDevicesRequest {
    face_device_id: number[]
    user_id: number
}

// Define API response type for adding single user to devices
export interface AddSingleUserToDevicesResponse {
    data: {
        message?: string
        success?: boolean
    }
}

// Define request body type for removing single user from devices
export interface RemoveSingleUserFromDevicesRequest {
    face_device_id: number[]
    user_id: number
}

// Define API response type for removing single user from devices
export interface RemoveSingleUserFromDevicesResponse {
    data: {
        message?: string
        success?: boolean
    }
}

// Export Props interface for DevicesInUser component
export interface DevicesInUserProps {
    userId: number
    userName?: string
    deviceActions: {
        action: string
    }[]
    currentUser: CurrentUser
    devicesInUser?: DevicesInUserResponse
}
