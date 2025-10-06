'use client'

import React, { FC, useState } from 'react'
import { FaceDevice } from '@/types/faceDevicesTypes'
import { CurrentUser } from '@/types/currentUserTypes'
import { Users, Activity, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import UsersOutDevice from './UsersOutDevice'
import UsersInDevice from './UsersInDevice'
import FaceDeviceRecords from './FaceDeviceRecords'
import { useTranslations } from 'next-intl'
import usePermissions from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/constants/permissions'

interface FaceDeviceTabsProps {
    faceDevice: FaceDevice
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const FaceDeviceTabs: FC<FaceDeviceTabsProps> = ({
                                                     faceDevice,
                                                     userActions,
                                                     currentUser
                                                 }) => {
    const [activeTab, setActiveTab] = useState("records")
    const t = useTranslations('FaceDevices')
    const { hasPermission } = usePermissions(userActions, currentUser.includes?.role?.name || '')

    const availableTabs = [
        {
            value: "records",
            label: t('Tabs.records'),
            icon: <FileText className="h-4 w-4" />,
            description: t('Tabs.recordsDescription'),
            permission: PERMISSIONS.VIEW_FACE_DEVICE_RECORDS
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

                {hasPermission(PERMISSIONS.VIEW_FACE_DEVICE_RECORDS) && (
                    <TabsContent value="records" className="mt-0 p-6">
                        <FaceDeviceRecords 
                            faceDeviceId={faceDevice.id}
                            deviceName={faceDevice.name}
                            userActions={userActions}
                            currentUser={currentUser}
                        />
                    </TabsContent>
                )}

                {hasPermission(PERMISSIONS.VIEW_FACE_DEVICE_USERS) && (
                    <TabsContent value="users-in" className="mt-0 p-6">
                        <UsersInDevice 
                            faceDeviceId={faceDevice.id}
                            deviceName={faceDevice.name}
                            userActions={userActions}
                            currentUser={currentUser}
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
                        />
                    </TabsContent>
                )}
            </Tabs>
        </Card>
    )
}

export default FaceDeviceTabs
