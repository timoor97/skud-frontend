import React, {FC} from 'react'
import { getUserById } from '@/app/[locale]/actions/(users)/getUserById'
import UserShow from '@/components/clientLayout/users/UserShow'
import { notFound } from 'next/navigation'
import { currentUser, currentUserPermissionsActions } from '../../../actions/(users)/getCurrentUser';
import { getDevicesInSingleUserAction } from '@/app/[locale]/actions/(faceDeviceUsers)/getDevicesInSingleUser';
import { getDevicesOutSingleUserAction } from '@/app/[locale]/actions/(faceDeviceUsers)/getDevicesOutSingleUser';

interface UserShowPageProps {
    params: {
        userId: string
        locale: string
    }
}

const UserShowPage: FC<UserShowPageProps> = async ({ params }) => {
    const { userId,locale } = await params

    try {
        const response = await getUserById(locale, parseInt(userId))
        const user = response.data
        const currentUserData = await currentUser(locale)
        const userActions = await currentUserPermissionsActions(locale)
        const devicesInUser = await getDevicesInSingleUserAction(locale, parseInt(userId))
        const devicesOutUser = await getDevicesOutSingleUserAction(locale, parseInt(userId))

        if (!user) {
            notFound()
        }

        return <UserShow user={user} currentUser={currentUserData} userActions={userActions} devicesInUser={devicesInUser} devicesOutUser={devicesOutUser}/>
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}

export default UserShowPage