'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { routing } from '@/i18n/routing'

interface TranslatableTabsProps {
    children: (locale: string) => React.ReactNode
    defaultLocale?: string
    className?: string
}

/**
 * TranslatableTabs component that uses locale configuration from routing.tsx
 * 
 * @example
 * // Uses routing.defaultLocale (currently 'en')
 * <TranslatableTabs>
 *   {(locale) => <Input name={`field.${locale}`} />}
 * </TranslatableTabs>
 * 
 * @example
 * // Overrides with specific locale
 * <TranslatableTabs defaultLocale="ru">
 *   {(locale) => <Input name={`field.${locale}`} />}
 * </TranslatableTabs>
 */
const TranslatableTabs: React.FC<TranslatableTabsProps> = ({
    children,
    defaultLocale,
    className = ''
}) => {
    // Use provided defaultLocale or fall back to routing default
    const activeDefaultLocale = defaultLocale || routing.defaultLocale
    const locales = routing.locales.map(locale => ({
        key: locale,
        label: locale === 'uz' ? 'O\'zbek' : 
               locale === 'ru' ? 'Русский' : 
               locale === 'en' ? 'English' : locale
    }))

    return (
        <Tabs defaultValue={activeDefaultLocale} className={`w-full ${className}`}>
            <TabsList className="grid w-full grid-cols-3">
                {locales.map((locale) => (
                    <TabsTrigger key={locale.key} value={locale.key}>
                        {locale.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            
            {locales.map((locale) => (
                <TabsContent key={locale.key} value={locale.key} className="mt-4">
                    {children(locale.key)}
                </TabsContent>
            ))}
        </Tabs>
    )
}

export default TranslatableTabs
