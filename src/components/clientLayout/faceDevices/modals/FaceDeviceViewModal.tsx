'use client'

import {useViewFaceDeviceModal} from '@/hooks/useViewModal'
import ViewModal from '@/components/ui/viewModal'
import React, {FC} from 'react'

const FaceDeviceViewModal: FC = () => {
    const {open, closeModal} = useViewFaceDeviceModal()

    if (!open) return null

    return (
        <ViewModal
            open={open}
            handleClose={closeModal}
            title="Face Device Details"
        >
            <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                    Face device view functionality not implemented yet.
                </div>
            </div>
        </ViewModal>
    )
}

export default FaceDeviceViewModal
