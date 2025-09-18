import React, { FC } from 'react'
import { getRole } from '../../actions/(roles)/getAllRoles'
import RolesClient from "@/components/clientLayout/rolesClient";
import RoleFormModal from "@/components/modals/roleModal/roleFormModal";
import RoleViewModal from "@/components/modals/roleModal/roleViewModal";
import { currentUser, currentUserPermissionsActions } from '../../actions/(users)/getCurrentUser';
import {getAllPermissions} from "@/app/[locale]/actions/(permissions)/getAllPermissions";

interface RolesPageProps {
    params: Promise<{
        locale: string
    }>
}

const RolesPage: FC<RolesPageProps> = async ({ params }) => {
    const { locale } = await params

    const roles = await getRole(locale)
    const user = await currentUser(locale)
    const userActions = await currentUserPermissionsActions(locale)
    const permissions = await getAllPermissions(locale)

    return (
        <>
            <RolesClient
                roles={roles.data.models}
                userActions={userActions}
                user={user.data}
                meta={roles.data.meta}
            />

            <RoleFormModal
                permissions={permissions.data.models}
            />
            <RoleViewModal />
        </>
    )
}

export default RolesPage