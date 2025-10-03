'use client'
import React, {FC} from 'react'
import {User} from '@/types/usersTypes'
import usePermissions from '@/hooks/usePermissions'
import {PERMISSIONS} from '@/constants/permissions'
import {CurrentUser} from "@/types/currentUserTypes";
import SetLoginPassword from './SetLoginPassword'
import ChangePassword from './ChangePassword'

interface UserSecuritySectionProps {
    user: User
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const UserSecuritySection: FC<UserSecuritySectionProps> = ({
                                                               user,
                                                               currentUser,
                                                               userActions
                                                           }) => {
    const {hasPermission} = usePermissions(userActions, currentUser?.includes?.role?.name || '')

    const canSetLoginPassword = hasPermission(PERMISSIONS.SET_LOGIN_PASSWORD)
    const canChangePassword = hasPermission(PERMISSIONS.CHANGE_PASSWORD)

    // If no security features are available, show a message
    if (!canSetLoginPassword && !canChangePassword) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-muted-foreground">You don&apos;t have permission to access security features.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Set Login Password Section */}
            {canSetLoginPassword && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <SetLoginPassword user={user}/>
                </div>
            )}

            {/* Change Password Section */}
            {canChangePassword && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                    <ChangePassword user={user}/>
                </div>
            )}
        </div>
    )
}

export default UserSecuritySection

