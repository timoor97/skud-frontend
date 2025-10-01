'use client'
import React, {FC} from 'react'
import {useTranslations} from 'next-intl'
import {Camera, Key, Lock} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import SetLoginPassword from './SetLoginPassword'
import ChangePassword from './ChangePassword'
import UserFaceRecognition from './UserFaceRecognition'
import {RoleListItem} from '@/types/rolesTypes'
import {User} from '@/types/usersTypes'
import usePermissions from '@/hooks/usePermissions'
import {PERMISSIONS} from '@/constants/permissions'
import {CurrentUser} from "@/types/currentUserTypes";

interface UserTabsProps {
    defaultValue?: string
    roles?: RoleListItem[] | null
    user: User
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const UserTabs: FC<UserTabsProps> = ({
                                         defaultValue = "setLoginPassword",
                                         roles,
                                         user,
                                         currentUser,
                                         userActions
                                     }) => {
    const tDetail = useTranslations('Users.DetailPage')
    const tSecurity = useTranslations('Users.DetailPage.security')

    const {hasPermission} = usePermissions(userActions, currentUser?.includes?.role?.name || '')

    // Check permissions for each tab
    const canSetLoginPassword = hasPermission(PERMISSIONS.SET_LOGIN_PASSWORD)
    const canChangePassword = hasPermission(PERMISSIONS.CHANGE_PASSWORD)
    const canViewFaceRecognition = hasPermission(PERMISSIONS.VIEW_FACE_DEVICES) // Assuming face recognition uses face device permissions

    // Build tabs array based on permissions
    const tabs = []
    if (canSetLoginPassword) {
        tabs.push({
            value: 'setLoginPassword',
            icon: <Key className="w-4 h-4 mr-2"/>,
            label: tSecurity('tabs.setLoginPassword')
        })
    }
    if (canChangePassword) {
        tabs.push({
            value: 'changePassword',
            icon: <Lock className="w-4 h-4 mr-2"/>,
            label: tSecurity('tabs.changePassword')
        })
    }
    if (canViewFaceRecognition) {
        tabs.push({
            value: 'faceRecognition',
            icon: <Camera className="w-4 h-4 mr-2"/>,
            label: tDetail('tabs.faceRecognition')
        })
    }

    // If no tabs are available, show a message
    if (tabs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">You don't have permission to access any user management
                    features.</p>
            </div>
        )
    }

    // Determine the active tab - use defaultValue if available, otherwise use first available tab
    const availableTabValues = tabs.map(tab => tab.value)
    const activeTab = availableTabValues.includes(defaultValue) ? defaultValue : availableTabValues[0]

    return (
        <div className="flex-1">
            <Tabs defaultValue={activeTab} className="w-full">
                <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.icon}
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {canSetLoginPassword && (
                    <TabsContent value="setLoginPassword" className="mt-6">
                        <SetLoginPassword roles={roles} user={user}/>
                    </TabsContent>
                )}

                {canChangePassword && (
                    <TabsContent value="changePassword" className="mt-6">
                        <ChangePassword user={user}/>
                    </TabsContent>
                )}

                {canViewFaceRecognition && (
                    <TabsContent value="faceRecognition" className="mt-6">
                        <UserFaceRecognition/>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

export default UserTabs
