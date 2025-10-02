'use client'

import React, { FC } from 'react'
import { useLocale } from 'next-intl'
import { MultiSelectCustom } from "@/components/ui/multi-select-custom"
import { RoleListItem } from "@/types/rolesTypes"

interface RoleMultiSelectProps {
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    maxCount?: number
    emptyText?: string
}

export const RoleMultiSelect: FC<RoleMultiSelectProps> = ({
    selected,
    onChange,
    placeholder = "Select roles...",
    className,
    disabled = false,
    maxCount = 3,
    emptyText = "No roles found",
}) => {
    const locale = useLocale()
    
    // Fetch function for roles
    const fetchRoles = async (page: number, searchQuery?: string, limit?: number) => {
        const { getRole } = await import('@/app/[locale]/actions/(roles)/getAllRoles')
        return await getRole(locale, page, searchQuery, limit)
    }
    
    return (
        <MultiSelectCustom<RoleListItem>
            selected={selected}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            maxCount={maxCount}
            emptyText={emptyText}
            fetchOptions={fetchRoles}
            getOptionLabel={(role) => role.name}
            getOptionValue={(role) => role.id.toString()}
            locale={locale}
        />
    )
}
