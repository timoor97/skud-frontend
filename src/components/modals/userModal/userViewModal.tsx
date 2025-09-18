'use client'
import React, { FC, useEffect, useState } from 'react'
import { useViewUserModal } from '@/hooks/useViewModal'
import ViewModal from '@/components/modals/viewModal'
import { useTranslations, useLocale } from 'next-intl'
import { getUserById } from '@/app/[locale]/actions/(users)/getUserById'
import { User } from '@/types/usersTypes'
import Image from 'next/image'

const UserViewModal: FC = () => {
    const { open, userId, closeModal } = useViewUserModal()
    const [user, setUser] = useState<User | null>(null)
    const t = useTranslations('Users.Modal')
    const locale = useLocale()

    useEffect(() => {
        const fetchUser = async () => {
            if (userId && open) {
                try {
                    const response = await getUserById(locale, userId)
                    setUser(response.data)
                } catch (error) {
                    console.error('Error fetching user:', error)
                }
            }
        }

        fetchUser()
    }, [userId, open, locale])

    const handleClose = () => {
        setUser(null)
        closeModal()
    }

    return (
        <ViewModal
            open={open}
            handleClose={handleClose}
            title={user ? `${user.first_name} ${user.last_name || ''}`.trim() : t('titles.viewUser')}
        >
            <div className="space-y-4">
                {user ? (
                    <>
                        <div className="flex justify-center mb-4">
                            {user.image ? (
                                <Image 
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image}`} 
                                    alt={`${user.first_name} ${user.last_name}`}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                                    <span className="text-2xl text-gray-500">
                                        {user.first_name?.[0]?.toUpperCase() || '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="grid gap-3">
                            <div>
                                <label className="text-sm font-medium">{t('labels.userId')}</label>
                                <p className="text-sm">{user.id}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.firstName')}</label>
                                <p className="text-sm">{user.first_name}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.lastName')}</label>
                                <p className="text-sm">{user.last_name || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.login')}</label>
                                <p className="text-sm">{user.login}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.phone')}</label>
                                <p className="text-sm">{user.phone || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.role')}</label>
                                <p className="text-sm">{user.includes?.role?.name || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium">{t('labels.status')}</label>
                                <p className="text-sm">{user.status ? t('status.active') : t('status.inactive')}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                            >
                                {t('buttons.close')}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <p>{t('messages.noUserSelected')}</p>
                    </div>
                )}
            </div>
        </ViewModal>
    )
}

export default UserViewModal
