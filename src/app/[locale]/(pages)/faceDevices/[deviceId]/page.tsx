import React, {FC} from 'react'
import { getFaceDeviceById } from '@/app/[locale]/actions/(faceDevices)/getFaceDeviceById'
import FaceDeviceShow from '@/components/clientLayout/faceDevices/FaceDeviceShow'
import { notFound } from 'next/navigation'
import { currentUser, currentUserPermissionsActions } from '../../../actions/(users)/getCurrentUser';
import {getUsersOutSingleDeviceAction} from '@/app/[locale]/actions/(faceDeviceUsers)/getUsersOutSingleDevice'
import {getUsersInSingleDeviceAction} from '@/app/[locale]/actions/(faceDeviceUsers)/getUsersInSingleDevice'

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
        const usersOutDevice = await getUsersOutSingleDeviceAction(locale, parseInt(deviceId))
        const usersInDevice = await getUsersInSingleDeviceAction(locale, parseInt(deviceId))

        if (!faceDevice) {
            notFound()
        }

        return <FaceDeviceShow faceDevice={faceDevice} currentUser={currentUserData} userActions={userActions} usersOutDevice={usersOutDevice} usersInDevice={usersInDevice}/>
    } catch (error) {
        console.error('Error fetching device:', error)
        notFound()
    }
}

export default FaceDeviceShowPage