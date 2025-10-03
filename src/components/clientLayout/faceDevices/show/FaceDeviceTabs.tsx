'use client'

import React, { FC, useState } from 'react'
import { FaceDevice } from '@/types/faceDevicesTypes'
import { CurrentUser } from '@/types/currentUserTypes'
import { Users, Settings, Activity } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import UsersOutDevice from './UsersOutDevice'
import UsersInDevice from './UsersInDevice'
import { UsersOutDeviceResponse } from "@/types/usersOutDeviceTypes"
import { UsersInDeviceResponse } from "@/types/usersInDeviceTypes"
import { useTranslations } from 'next-intl'
import usePermissions from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/constants/permissions'

interface FaceDeviceTabsProps {
    faceDevice: FaceDevice
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    usersOutDevice?: UsersOutDeviceResponse
    usersInDevice?: UsersInDeviceResponse
}

const FaceDeviceTabs: FC<FaceDeviceTabsProps> = ({
                                                     faceDevice,
                                                     userActions,
                                                     currentUser,
                                                     usersOutDevice,
                                                     usersInDevice
                                                 }) => {
    const [activeTab, setActiveTab] = useState("overview")
    const t = useTranslations('FaceDevices')
    const { hasPermission } = usePermissions(userActions, currentUser.includes?.role?.name || '')

    const availableTabs = [
        {
            value: "overview",
            label: t('Tabs.overview'),
            icon: <Settings className="h-4 w-4" />,
            description: t('Tabs.overviewDescription'),
            permission: PERMISSIONS.VIEW_FACE_DEVICE
        },
        {
            value: "users-in",
            label: t('Tabs.usersIn'),
            icon: <Users className="h-4 w-4" />,
            description: t('Tabs.usersInDescription'),
            permission: PERMISSIONS.VIEW_FACE_DEVICE_USERS
        },
        {
            value: "users-out",
            label: t('Tabs.usersOut'),
            icon: <Activity className="h-4 w-4" />,
            description: t('Tabs.usersOutDescription'),
            permission: PERMISSIONS.VIEW_FACE_DEVICE_USERS
        }
    ]

    // Filter tabs based on permissions
    const tabs = availableTabs.filter(tab => hasPermission(tab.permission))

    return (
        <Card className="overflow-hidden shadow-lg border-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b bg-muted/30">
                    <TabsList className="grid w-full grid-cols-3 h-auto bg-transparent p-0">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex items-center gap-2 flex-1 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all duration-200"
                                title={tab.description}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline font-medium">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="overview" className="mt-0 p-6">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                            {t('Tabs.overview')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 border border-border/50 hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold text-sm text-primary mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                    Basic Info
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">ID:</span>
                                        <span className="text-sm font-bold text-primary">#{faceDevice.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Name:</span>
                                        <span className="text-sm font-semibold">{faceDevice.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Type:</span>
                                        <span className="text-sm font-semibold capitalize">{faceDevice.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Status:</span>
                                        <span className={`text-sm font-bold ${faceDevice.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {faceDevice.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 border border-border/50 hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold text-sm text-primary mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                    Network
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">IP Address:</span>
                                        <span className="text-sm font-mono font-semibold">{faceDevice.ip}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Port:</span>
                                        <span className="text-sm font-mono font-semibold">{faceDevice.port}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Username:</span>
                                        <span className="text-sm font-semibold">{faceDevice.username}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-5 border border-border/50 hover:shadow-lg transition-shadow">
                                <h4 className="font-semibold text-sm text-primary mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                                    Activity
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t('Labels.lastChecked')}:</span>
                                        <span className="text-sm font-medium">
                                            {faceDevice.last_checked_at
                                                ? new Date(faceDevice.last_checked_at).toLocaleString('en-US', { 
                                                    year: 'numeric', 
                                                    month: '2-digit', 
                                                    day: '2-digit', 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: false 
                                                })
                                                : 'Never'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Connection:</span>
                                        <span className={`text-sm font-bold ${faceDevice.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {faceDevice.status === 'active' ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {hasPermission(PERMISSIONS.VIEW_FACE_DEVICE_USERS) && (
                    <TabsContent value="users-in" className="mt-0 p-6">
                        <UsersInDevice 
                            faceDeviceId={faceDevice.id}
                            deviceName={faceDevice.name}
                            userActions={userActions}
                            currentUser={currentUser}
                            usersInDevice={usersInDevice}
                        />
                    </TabsContent>
                )}

                {hasPermission(PERMISSIONS.VIEW_FACE_DEVICE_USERS) && (
                    <TabsContent value="users-out" className="mt-0 p-6">
                        <UsersOutDevice 
                            faceDeviceId={faceDevice.id}
                            deviceName={faceDevice.name}
                            userActions={userActions}
                            currentUser={currentUser}
                            usersOutDevice={usersOutDevice}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </Card>
    )
}

export default FaceDeviceTabs
