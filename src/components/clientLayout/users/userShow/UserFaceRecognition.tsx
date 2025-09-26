'use client'
import React, { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const UserFaceRecognition: FC = () => {
    const tDetail = useTranslations('Users.DetailPage')

    return (
        <Card>
            <CardHeader>
                <CardTitle>{tDetail('tabs.faceRecognition')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{tDetail('tabContent.faceRecognition')}</p>
            </CardContent>
        </Card>
    )
}

export default UserFaceRecognition
