'use client'
import React, {FC} from 'react'
import {useTranslations} from 'next-intl'
import {Monitor, Shield} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {User} from '@/types/usersTypes'
import usePermissions from '@/hooks/usePermissions'
import {PERMISSIONS} from '@/constants/permissions'
import {CurrentUser} from "@/types/currentUserTypes";
import UserSecuritySection from './UserSecuritySection'
import UserDeviceTabs from './UserDeviceTabs'

interface UserTabsProps {
    defaultValue?: string
    user: User
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const UserTabs: FC<UserTabsProps> = ({
                                         defaultValue = "security",
                                         user,
                                         currentUser,
                                         userActions
                                     }) => {
    const tDetail = useTranslations('Users.DetailPage')

    const {hasPermission} = usePermissions(userActions, currentUser?.includes?.role?.name || '')

    // Check permissions for main sections
    const canAccessSecurity = hasPermission(PERMISSIONS.SET_LOGIN_PASSWORD) || hasPermission(PERMISSIONS.CHANGE_PASSWORD)
    const canAccessFaceDevices = hasPermission(PERMISSIONS.VIEW_FACE_DEVICES)

    // Build tabs array based on permissions
    const tabs = []
    if (canAccessSecurity) {
        tabs.push({
            value: 'security',
            icon: <Shield className="w-4 h-4"/>,
            label: tDetail('tabs.security')
        })
    }
    if (canAccessFaceDevices) {
        tabs.push({
            value: 'faceDevices',
            icon: <Monitor className="w-4 h-4"/>,
            label: tDetail('tabs.faceDevices')
        })
    }

    // If no tabs are available, show a message
    if (tabs.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
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
                    <TabsList className={`grid w-full h-auto p-1 bg-muted/30 ${tabs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {tabs.map((tab) => (
                            <TabsTrigger 
                                key={tab.value} 
                                value={tab.value}
                                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/50"
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="p-4 sm:p-6">
                        {canAccessSecurity && (
                            <TabsContent value="security" className="mt-0">
                                <UserSecuritySection user={user} currentUser={currentUser} userActions={userActions} />
                            </TabsContent>
                        )}

                            {canAccessFaceDevices && (
                                <TabsContent value="faceDevices" className="mt-0">
                                    <UserDeviceTabs user={user} currentUser={currentUser} userActions={userActions} />
                                </TabsContent>
                            )}
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default UserTabs
