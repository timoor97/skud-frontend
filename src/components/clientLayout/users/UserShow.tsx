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
import SHowLoading from '@/components/ui/showLoading';
import {CurrentUser} from "@/types/currentUserTypes";

interface UserShowProps {
    user: User,
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

const UserShow: FC<UserShowProps> = ({ user, currentUser, userActions }) => {
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
        <div className="min-h-screen bg-background">
            <PageHeader 
                title={`${user.first_name} ${user.last_name} #${user.id}`}
                description={tDetail('title')}
            />
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 px-4 sm:px-6 py-4 border-b bg-card">
                <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">{tDetail('actions.backToList')}</span>
                    <span className="sm:hidden">Back</span>
                </Button>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side - User Profile */}
                    <div className="lg:col-span-1">
                        <UserProfile user={user} />
                    </div>

                    {/* Right Side - Tabs */}
                    <div className="lg:col-span-2">
                        <UserTabs user={user} currentUser={currentUser} userActions={userActions} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserShow
