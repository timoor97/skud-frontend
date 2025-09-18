'use client'

import {useViewRoleModal} from '@/hooks/useViewModal'
import ViewModal from '@/components/modals/viewModal'
import {useLocale, useTranslations} from 'next-intl'
import React, {FC, useEffect, useState} from 'react'
import {getRoleById} from '@/app/[locale]/actions/(roles)/getRoleById'
import {Role} from "@/types/rolesTypes";

const RoleViewModal: FC = () => {
    const {open, id, closeModal} = useViewRoleModal()
    const locale = useLocale()
    const tModal = useTranslations('Roles.Modal')
    const [roleData, setRoleData] = useState<Role | null>(null)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchRoleData = async () => {
            if (id && open) {
                setIsLoading(true)
                try {
                    const {data} = await getRoleById(locale, id)
                    setRoleData(data)
                } catch (error) {
                    console.error('Error loading role data:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchRoleData()
    }, [id, open, locale])

    if (!open) return null

    return (
        <ViewModal
            open={open}
            handleClose={closeModal}
            title={tModal('messages.viewRole', {id: id || 0})}
        >
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div
                            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : roleData ? (
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.nameUz')}
                            </label>
                            <p className="text-sm font-medium">{roleData.name?.uz || 'N/A'}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.nameRu')}
                            </label>
                            <p className="text-sm font-medium">{roleData.name?.ru || 'N/A'}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.nameEn')}
                            </label>
                            <p className="text-sm font-medium">{roleData.name?.en || 'N/A'}</p>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.key')}
                            </label>
                            <p className="text-sm font-medium font-mono">{roleData.key || 'N/A'}</p>
                        </div>

                        {roleData.description && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    {tModal('labels.description')}
                                </label>
                                <p className="text-sm font-medium">
                                    {roleData.description?.[locale as 'uz' | 'ru' | 'en'] || 
                                     roleData.description?.ru || 
                                     roleData.description?.uz || 
                                     roleData.description?.en || 'N/A'}
                                </p>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                {tModal('labels.permissions')}
                            </label>
                            <div className="text-sm">
                                {roleData.permissions && roleData.permissions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {roleData.permissions.map((permission, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {permission.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No permissions assigned</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Role not found
                    </div>
                )}
            </div>
        </ViewModal>
    )
}

export default RoleViewModal