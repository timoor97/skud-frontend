import React, { FC } from 'react'
import { getAllUsers } from '../../actions/(users)/getAllUsers'
import UsersList from "@/components/clientLayout/users/UsersList";
import UserFormModal from "@/components/clientLayout/users/modals/UserFormModal";
import { currentUser, currentUserPermissionsActions } from '../../actions/(users)/getCurrentUser';

interface UsersPageProps {
    params: Promise<{
        locale: string
    }>
}
const UsersPage: FC<UsersPageProps> = async ({ params }) => {
    const { locale } = await params

    const users = await getAllUsers(locale)
    const currentUserData = await currentUser(locale)
    const userActions = await currentUserPermissionsActions(locale)

    return (
        <>
            <UsersList
                users={users.data.models}
                userActions={userActions}
                currentUser={currentUserData.data}
                meta={users.data.meta}
            />

            <UserFormModal />
        </>
    )
}

export default UsersPage

