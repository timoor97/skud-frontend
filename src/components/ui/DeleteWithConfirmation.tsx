'use client'
import { useTranslations } from 'next-intl';
import React, { FC } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface DeleteWithConfirmationProps {
    id: number;
    onDelete: (id: number) => void;
    onClose: () => void;
}

const DeleteWithConfirmation: FC<DeleteWithConfirmationProps> = ({
    id,
    onDelete,
    onClose
}) => {
    const t = useTranslations('ConfirmDeleteModal');

    const handleDelete = () => {
        onDelete(id);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {t('title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('delete')}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium transition-colors"
                    >
                        {t('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteWithConfirmation
