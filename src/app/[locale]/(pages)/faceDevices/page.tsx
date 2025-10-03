import React, { FC } from 'react'
import { getAllFaceDevices } from '../../actions/(faceDevices)/getAllFaceDevices'
import FaceDevicesList from "@/components/clientLayout/faceDevices/FaceDevicesList";
import FaceDeviceFormModal from "@/components/clientLayout/faceDevices/modals/FaceDeviceFormModal";
import { currentUser, currentUserPermissionsActions } from '../../actions/(users)/getCurrentUser';

interface FaceDevicesPageProps {
    params: Promise<{
        locale: string
    }>
}

const FaceDevicesPage: FC<FaceDevicesPageProps> = async ({ params }) => {
    const { locale } = await params

    const faceDevices = await getAllFaceDevices(locale)
    const currentUserData = await currentUser(locale)
    const userActions = await currentUserPermissionsActions(locale)

    return (
        <>
            <FaceDevicesList
                faceDevices={faceDevices.data.models}
                userActions={userActions}
                currentUser={currentUserData.data}
                meta={faceDevices.data.meta}
            />

            <FaceDeviceFormModal />
        </>
    )
}

export default FaceDevicesPage
