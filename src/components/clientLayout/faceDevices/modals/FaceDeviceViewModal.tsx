'use client'

import {useViewFaceDeviceModal} from '@/hooks/useViewModal'
import ViewModal from '@/components/ui/viewModal'
import {useLocale, useTranslations} from 'next-intl'
import React, {FC, useEffect, useState} from 'react'
import {getFaceDeviceById} from '@/app/[locale]/actions/(faceDevices)/getFaceDeviceById'
import {FaceDevice} from "@/types/faceDevicesTypes";

const FaceDeviceViewModal: FC = () => {
    const {open, id, closeModal} = useViewFaceDeviceModal()
    const locale = useLocale()
    const tModal = useTranslations('FaceDevices.Modal')
    const [faceDeviceData, setFaceDeviceData] = useState<FaceDevice | null>(null)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchFaceDeviceData = async () => {
            if (id && open) {
                setIsLoading(true)
                try {
                    const {data} = await getFaceDeviceById(locale, id)
                    setFaceDeviceData(data)
                } catch (error) {
                    console.error('Error loading face device data:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchFaceDeviceData()
    }, [id, open, locale])

    if (!open) return null

    return (
        <ViewModal
            open={open}
            handleClose={closeModal}
            title={tModal('titles.viewDevice', {id: id || 0})}
        >
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div
                            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : faceDeviceData ? (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.id')}
                            </label>
                            <p className="text-sm font-medium font-mono">{faceDeviceData.id}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.name')}
                            </label>
                            <p className="text-sm font-medium">{faceDeviceData.name}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.type')}
                            </label>
                            <p className="text-sm font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    faceDeviceData.type === 'enter' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {faceDeviceData.type === 'enter' ? tModal('typeOptions.enter') : tModal('typeOptions.exit')}
                                </span>
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.status')}
                            </label>
                            <p className="text-sm font-medium">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    faceDeviceData.status 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {faceDeviceData.status ? tModal('statusOptions.active') : tModal('statusOptions.inactive')}
                                </span>
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.ip')}
                            </label>
                            <p className="text-sm font-medium font-mono">{faceDeviceData.ip}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.port')}
                            </label>
                            <p className="text-sm font-medium font-mono">{faceDeviceData.port}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.username')}
                            </label>
                            <p className="text-sm font-medium">{faceDeviceData.username}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.password')}
                            </label>
                            <p className="text-sm font-medium">••••••••</p>
                        </div>

                        {faceDeviceData.createdAt && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tModal('labels.createdAt')}
                                </label>
                                <p className="text-sm font-medium">
                                    {new Date(faceDeviceData.createdAt).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {faceDeviceData.updatedAt && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tModal('labels.updatedAt')}
                                </label>
                                <p className="text-sm font-medium">
                                    {new Date(faceDeviceData.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Face device not found
                    </div>
                )}
            </div>
        </ViewModal>
    )
}

export default FaceDeviceViewModal
