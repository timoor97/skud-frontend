'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {Link} from "@/i18n/navigation";

export function DynamicBreadcrumb() {
    const pathname = usePathname()
    const t = useTranslations('Breadcrumb')
    
    // Define breadcrumb configurations for different routes
    const breadcrumbConfig: Record<string, { title: string; href?: string }[]> = {
        '/dashboard': [
            //
        ],
        '/roles': [
            { title: t('rolePermissions') },
            { title: t('roles') }
        ],
        '/users': [
            { title: t('rolePermissions') },
            { title: t('users') }
        ],
        '/playground': [
            { title: t('playground') }
        ],
        '/playground/history': [
            { title: t('playground'), href: '/playground' },
            { title: t('history') }
        ],
        '/playground/starred': [
            { title: t('playground'), href: '/playground' },
            { title: t('starred') }
        ],
        '/playground/settings': [
            { title: t('playground'), href: '/playground' },
            { title: t('settings') }
        ],
    }
    
    // Remove locale prefix from pathname
    const routePath = pathname.replace(/^\/[a-z]{2}/, '') || '/dashboard'
    
    // Get breadcrumb items for current route
    const breadcrumbItems = breadcrumbConfig[routePath] || [
        { title: t('dashboard'), href: '/dashboard' },
        { title: t('page') }
    ]

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <div key={item.title} className="flex items-center">
                        {index > 0 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>
                                        {item.title}
                                    </Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
