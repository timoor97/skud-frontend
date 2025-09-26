'use client'
import {CircleLoader} from 'react-spinners'
import React, { FC } from 'react'
import { useTranslations } from 'next-intl'

const Loading: FC = () => {
    const t = useTranslations('Common')

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="flex flex-col items-center space-y-6">
                <CircleLoader
                    loading={true}
                    size={150}
                    color="currentColor"
                    aria-label="Loading Spinner"
                />
                <p className="text-lg font-medium text-muted-foreground">{t('loading')}</p>
            </div>
        </div>
    )
}
export default Loading