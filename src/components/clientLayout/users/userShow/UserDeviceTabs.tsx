'use client'
import React, {FC} from 'react'
import {useTranslations} from 'next-intl'
import {Monitor, MonitorOff} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import FaceDevicesInUser from './FaceDevicesInUser'
import FaceDevicesOutUser from './FaceDevicesOutUser'
import {User} from '@/types/usersTypes'
import usePermissions from '@/hooks/usePermissions'
import {PERMISSIONS} from '@/constants/permissions'
import {CurrentUser} from "@/types/currentUserTypes";
import { DevicesInUserResponse } from '@/types/devicesInUserTypes'
import { DevicesOutUserResponse } from '@/types/devicesOutUserTypes'

interface UserDeviceTabsProps {
    user: User
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    devicesInUser?: DevicesInUserResponse
    devicesOutUser?: DevicesOutUserResponse
}

const UserDeviceTabs: FC<UserDeviceTabsProps> = ({
                                                     user,
                                                     currentUser,
                                                     userActions,
                                                     devicesInUser,
                                                     devicesOutUser
                                                 }) => {
    const t = useTranslations('Users.DetailPage.faceDevices')

    const {hasPermission} = usePermissions(userActions, currentUser?.includes?.role?.name || '')

    const canViewDevices = hasPermission(PERMISSIONS.VIEW_FACE_DEVICES)

    if (!canViewDevices) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-muted-foreground">You don&apos;t have permission to view face devices.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Tabs defaultValue="devicesIn" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                    <TabsTrigger
                        value="devicesIn"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                        <Monitor className="w-4 h-4"/>
                        <span className="hidden sm:inline">{t('tabs.devicesIn')}</span>
                        <span className="sm:hidden">In</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="devicesOut"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                        <MonitorOff className="w-4 h-4"/>
                        <span className="hidden sm:inline">{t('tabs.devicesOut')}</span>
                        <span className="sm:hidden">Out</span>
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="devicesIn" className="mt-0">
                        <FaceDevicesInUser
                            userId={user.id}
                            deviceActions={userActions}
                            currentUser={currentUser}
                            devicesInUser={devicesInUser}
                        />
                    </TabsContent>

                    <TabsContent value="devicesOut" className="mt-0">
                        <FaceDevicesOutUser
                            userId={user.id}
                            userName={`${user.first_name} ${user.last_name}`}
                            deviceActions={userActions}
                            currentUser={currentUser}
                            devicesOutUser={devicesOutUser}
                        />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default UserDeviceTabs

