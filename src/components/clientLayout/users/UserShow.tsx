'use client'
import React, { FC, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { User } from '@/types/usersTypes'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import UserProfile from './userShow/UserProfile'
import UserTabs from './userShow/UserTabs'
import {RoleListItem} from "@/types/rolesTypes";
import SHowLoading from '@/components/ui/showLoading';

interface UserShowProps {
    user: User,
    roles?: RoleListItem[] | null
}

const UserShow: FC<UserShowProps> = ({ user , roles}) => {
    const router = useRouter()
    const tDetail = useTranslations('Users.DetailPage')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Show loading for a brief moment to ensure smooth transition
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    const handleBack = () => {
        router.push('/users')
    }

    if (isLoading) {
        return <SHowLoading />
    }

    return (
        <>
            <PageHeader 
                title={`${user.first_name} ${user.last_name} #${user.id}`}
                description={tDetail('title')}
            />
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 px-6 py-4 border-b">
                <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {tDetail('actions.backToList')}
                </Button>
            </div>

            <div className="flex p-6 gap-6">
                {/* Left Side - User Profile */}
                <UserProfile user={user} />

                {/* Right Side - Tabs */}
                <UserTabs roles={roles} user={user} />
            </div>
        </>
    )
}

export default UserShow
