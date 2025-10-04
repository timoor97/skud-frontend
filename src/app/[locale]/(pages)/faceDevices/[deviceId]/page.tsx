import React, {FC} from 'react'
import { getFaceDeviceById } from '@/app/[locale]/actions/(faceDevices)/getFaceDeviceById'
import FaceDeviceShow from '@/components/clientLayout/faceDevices/FaceDeviceShow'
import { notFound } from 'next/navigation'
import { currentUser, currentUserPermissionsActions } from '../../../actions/(users)/getCurrentUser';

interface FaceDeviceShowPageProps {
    params: {
        deviceId: string
        locale: string
    }
}

const FaceDeviceShowPage: FC<FaceDeviceShowPageProps> = async ({ params }) => {
    const { deviceId, locale } = await params

    try {
        const response = await getFaceDeviceById(locale, parseInt(deviceId))
        const faceDevice = response.data
        const currentUserData = await currentUser(locale)
        const userActions = await currentUserPermissionsActions(locale)

        if (!faceDevice) {
            notFound()
        }

        return <FaceDeviceShow faceDevice={faceDevice} currentUser={currentUserData} userActions={userActions}/>
    } catch (error) {
        console.error('Error fetching device:', error)
        notFound()
    }
}

export default FaceDeviceShowPage