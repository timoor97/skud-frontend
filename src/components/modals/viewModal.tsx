'use client'
import React, { FC } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ViewModalProps {
    open: boolean
    handleClose: () => void
    children: React.ReactNode
    title?: string | undefined
}
const ViewModal: FC<ViewModalProps> = ({ open, handleClose, title, children }) => {
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[800px] w-full">
                <DialogHeader>
                    <DialogTitle>{title || 'View Details'}</DialogTitle>
                    <DialogDescription>
                        {/*View the details below.*/}
                    </DialogDescription>
                </DialogHeader>
                
                {children}
            </DialogContent>
        </Dialog>
    )
}
export default ViewModal
