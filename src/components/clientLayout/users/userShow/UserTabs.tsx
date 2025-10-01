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
                <p className="text-muted-foreground">You don&apos;t have permission to access any user management
                    features.</p>
            </div>
        )
    }

    // Determine the active tab - use defaultValue if available, otherwise use first available tab
    const availableTabValues = tabs.map(tab => tab.value)
    const activeTab = availableTabValues.includes(defaultValue) ? defaultValue : availableTabValues[0]

    return (
        <div className="w-full">
            <Tabs defaultValue={activeTab} className="w-full">
                <div className="bg-card rounded-lg border border-border/50 shadow-sm">
                    <TabsList className={`grid w-full h-auto p-1 bg-muted/30 ${tabs.length === 1 ? 'grid-cols-1' : tabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {tabs.map((tab) => (
                            <TabsTrigger 
                                key={tab.value} 
                                value={tab.value}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50"
                            >
                                <span className="flex items-center gap-1 sm:gap-2">
                                    {tab.icon}
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="p-4 sm:p-6">
                        {canSetLoginPassword && (
                            <TabsContent value="setLoginPassword" className="mt-0">
                                <SetLoginPassword roles={roles} user={user}/>
                            </TabsContent>
                        )}

                        {canChangePassword && (
                            <TabsContent value="changePassword" className="mt-0">
                                <ChangePassword user={user}/>
                            </TabsContent>
                        )}

                        {canViewFaceRecognition && (
                            <TabsContent value="faceRecognition" className="mt-0">
                                <UserFaceRecognition/>
                            </TabsContent>
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default UserTabs
