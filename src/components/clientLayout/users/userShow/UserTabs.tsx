'use client'
import React, {FC} from 'react'
import {useTranslations} from 'next-intl'
import {Shield, Camera} from 'lucide-react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import UserSecurity from './UserSecurity'
import UserFaceRecognition from './UserFaceRecognition'
import {RoleListItem} from '@/types/rolesTypes'
import {User} from '@/types/usersTypes'

interface UserTabsProps {
    defaultValue?: string
    roles?: RoleListItem[] | null
    user: User
}

const UserTabs: FC<UserTabsProps> = ({
                                         defaultValue = "security",
                                         roles,
                                         user
                                     }) => {
    const tDetail = useTranslations('Users.DetailPage')

    return (
        <div className="flex-1">
            <Tabs defaultValue={defaultValue} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="security">
                        <Shield className="w-4 h-4 mr-2"/>
                        {tDetail('tabs.security')}
                    </TabsTrigger>
                    <TabsTrigger value="profile">
                        <Camera className="w-4 h-4 mr-2"/>
                        {tDetail('tabs.faceRecognition')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="security" className="mt-6">
                    <UserSecurity roles={roles} user={user}/>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                    <UserFaceRecognition/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserTabs
