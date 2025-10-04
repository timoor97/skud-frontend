'use client'

import React, { FC, useState, useEffect } from 'react'
import { FaceDevice } from '@/types/faceDevicesTypes'
import { CurrentUser } from '@/types/currentUserTypes'
import { Monitor, Wifi, WifiOff, ArrowLeft, Users, Clock, Network, Server, User, Settings } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FaceDeviceTabs from "./show/FaceDeviceTabs"
import { useRouter } from 'next/navigation'
import SHowLoading from '@/components/ui/showLoading'
import SetPushUrlModal from './modals/SetPushUrlModal'
import { usePushUrlModalStore } from '@/hooks/useModalStore'
import { PERMISSIONS } from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
interface FaceDeviceShowProps {
    faceDevice: FaceDevice
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const FaceDeviceShow: FC<FaceDeviceShowProps> = ({ faceDevice, userActions, currentUser }) => {
    const t = useTranslations('FaceDevices')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const { openModal } = usePushUrlModalStore()
    const { hasPermission } = usePermissions(userActions, currentUser.includes?.role?.name || '')
    
    const canSetPushUrl = hasPermission(PERMISSIONS.SET_PUSH_URL_FACE_DEVICE)

    useEffect(() => {
        // Show loading for a brief moment to ensure smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const handleBack = () => {
        router.push('/faceDevices')
    }

    if (isLoading) {
        return <SHowLoading />
    }

    return (
        <>
            <PageHeader
                title={t('ShowPage.title', { deviceName: faceDevice.name })}
                description={t('ShowPage.description')}
            />
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 px-4 sm:px-6 py-4 border-b bg-card">
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('ShowPage.backToDevices')}</span>
                    <span className="sm:hidden">Back</span>
                </Button>
            </div>
            
            <div className="flex flex-1 flex-col gap-6 p-3 sm:p-4 pt-4 sm:pt-6">

                {/* Device Information Card - Beautiful Enhanced Design */}
                <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary bg-gradient-to-br from-card to-card/50">
                    <CardHeader className="pb-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex-shrink-0 shadow-sm">
                                    <Monitor className="h-10 w-10 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {faceDevice.name}
                                    </CardTitle>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge 
                                            variant={faceDevice.status === 'active' ? "default" : "secondary"}
                                            className={`${faceDevice.status === 'active' ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20"} px-3 py-1`}
                                        >
                                            {faceDevice.status === 'active' ? (
                                                <>
                                                    <Wifi className="h-3.5 w-3.5 mr-1.5" />
                                                    {t('TableHeader.active')}
                                                </>
                                            ) : (
                                                <>
                                                    <WifiOff className="h-3.5 w-3.5 mr-1.5" />
                                                    {t('TableHeader.inactive')}
                                                </>
                                            )}
                                        </Badge>
                                        <Badge 
                                            variant="outline"
                                            className={`${faceDevice.type === 'enter' ? "border-emerald-400 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" : "border-red-400 text-red-700 dark:border-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30"} px-3 py-1 font-medium`}
                                        >
                                            {faceDevice.type === 'enter' ? t('TableHeader.enter') : t('TableHeader.exit')}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Push URL Settings Button */}
                            {canSetPushUrl && (
                                <div className="flex-shrink-0">
                                    <Button
                                        onClick={() => openModal(faceDevice.id)}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 dark:from-primary/20 dark:to-primary/30 dark:hover:from-primary/30 dark:hover:to-primary/40 border-primary/20 dark:border-primary/40 text-primary hover:text-primary/80 dark:hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span className="hidden sm:inline">{t('ShowPage.pushUrlButton')}</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Device ID</span>
                                </div>
                                <p className="text-xl font-mono font-bold text-primary">#{faceDevice.id}</p>
                            </div>
                            
                            <div className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <Network className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{t('TableHeader.ip')}</span>
                                </div>
                                <p className="text-base font-mono font-medium">{faceDevice.ip}</p>
                            </div>
                            
                            <div className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <Server className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{t('TableHeader.port')}</span>
                                </div>
                                <p className="text-base font-mono font-medium">{faceDevice.port}</p>
                            </div>
                            
                            <div className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{t('Modal.labels.username')}</span>
                                </div>
                                <p className="text-base font-mono font-medium truncate">{faceDevice.username}</p>
                            </div>
                            
                            <div className="space-y-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{t('Labels.lastChecked')}</span>
                                </div>
                                <p className="text-sm font-mono">{faceDevice.last_checked_at ? new Date(faceDevice.last_checked_at).toLocaleString('en-US', { 
                                    year: 'numeric', 
                                    month: '2-digit', 
                                    day: '2-digit', 
                                    hour: '2-digit', 
                                    minute: '2-digit',
                                    hour12: false 
                                }) : t('Labels.neverChecked')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Device Tabs */}
                <FaceDeviceTabs 
                    faceDevice={faceDevice}
                    userActions={userActions}
                    currentUser={currentUser}
                />
            </div>

            {/* Push URL Modal */}
            <SetPushUrlModal
                faceDevice={faceDevice}
            />
        </>
    )
}

export default FaceDeviceShow
