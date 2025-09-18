'use client'
import { useLocale } from 'next-intl'
import {  redirect } from 'next/navigation'
import React, { FC } from 'react'



const AdminPage: FC = () => {
    const locale = useLocale()



    redirect(`/${locale}/dashboard`)

    return (
        <div></div>
    )
}

export default AdminPage