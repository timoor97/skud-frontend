'use client'
import {CircleLoader} from 'react-spinners'
import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

const CustomLoading: FC = () => {
    const t = useTranslations('Common')
    
    return (
        <div className="flex items-center justify-center py-16 w-full">
            <div className="flex flex-col items-center space-y-4">
                <CircleLoader
                    loading={true}
                    size={60}
                    color="currentColor"
                    aria-label="Loading Spinner"
                />
                <p className="text-sm font-medium text-muted-foreground">{t('loading')}</p>
            </div>
        </div>
    )
}
export default CustomLoading