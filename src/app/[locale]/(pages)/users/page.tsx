import React, { FC } from 'react'
import { getAllUsers } from '../../actions/(users)/getAllUsers'
import UsersList from "@/components/clientLayout/users/UsersList";
import UserFormModal from "@/components/clientLayout/users/modals/UserFormModal";
import { getRole } from '../../actions/(roles)/getAllRoles'
import { currentUser, currentUserPermissionsActions } from '../../actions/(users)/getCurrentUser';

interface UsersPageProps {
    params: Promise<{
        locale: string
    }>
}
const UsersPage: FC<UsersPageProps> = async ({ params }) => {
    const { locale } = await params

    const users = await getAllUsers(locale)
    const roles = await getRole(locale)
    const user = await currentUser(locale)
    const userActions = await currentUserPermissionsActions(locale)

    return (
        <>
            <UsersList
                users={users.data.models}
                userActions={userActions}
                user={user.data}
                meta={users.data.meta}
                roles={roles.data.models}
            />

            <UserFormModal />
        </>
    )
}

export default UsersPage

