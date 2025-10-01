import React, { FC } from 'react'
import { getRole } from '../../actions/(roles)/getAllRoles'
import RolesList from "@/components/clientLayout/roles/RolesList";
import RoleFormModal from "@/components/clientLayout/roles/modals/RoleFormModal";
import RoleViewModal from "@/components/clientLayout/roles/modals/RoleViewModal";
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
    const currentUserData = await currentUser(locale)
    const userActions = await currentUserPermissionsActions(locale)
    const permissions = await getAllPermissions(locale)

    return (
        <>
            <RolesList
                roles={roles.data.models}
                userActions={userActions}
                currentUser={currentUserData.data}
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