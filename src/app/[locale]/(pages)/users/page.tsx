import React, { FC } from 'react'
import { getAllUsers } from '../../actions/(users)/getAllUsers'
import UsersClient from "@/components/clientLayout/usersClient";
import UserFormModal from "@/components/modals/userModal/userFormModal";
import { getRole } from '../../actions/(roles)/getAllRoles'
import UserViewModal from "@/components/modals/userModal/userViewModal";
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
            <UsersClient
                users={users.data.models}
                userActions={userActions}
                user={user.data}
                meta={users.data.meta}
                roles={roles.data.models}
            />

            <UserFormModal
                roles={roles.data.models}
            />
            <UserViewModal />
        </>
    )
}

export default UsersPage

