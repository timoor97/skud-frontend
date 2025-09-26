import React, {FC} from 'react'
import { getUserById } from '@/app/[locale]/actions/(users)/getUserById'
import UserShow from '@/components/clientLayout/users/UserShow'
import { notFound } from 'next/navigation'
import { getRole } from '../../../actions/(roles)/getAllRoles'

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
        const roles = await getRole(locale)

        if (!user) {
            notFound()
        }

        return <UserShow user={user} roles={roles.data.models}/>
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}

export default UserShowPage