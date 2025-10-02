'use client'

import React, { FC } from 'react'
import { useLocale } from 'next-intl'
import { SelectCustom } from "@/components/ui/select-custom"
import { RoleListItem } from "@/types/rolesTypes"

interface RoleSelectProps {
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
    includeAllOption?: boolean
    allOptionLabel?: string
    disabled?: boolean
}

export const RoleSelect: FC<RoleSelectProps> = ({
    value,
    onValueChange,
    placeholder = "Select role...",
    className,
    includeAllOption = false,
    allOptionLabel = "All Roles",
    disabled = false,
}) => {
    const locale = useLocale()
    
    // Fetch function for roles
    const fetchRoles = async (page: number, searchQuery?: string, limit?: number) => {
        const { getRole } = await import('@/app/[locale]/actions/(roles)/getAllRoles')
        return await getRole(locale, page, searchQuery, limit)
    }
    
    return (
        <SelectCustom<RoleListItem>
            value={value}
            onValueChange={onValueChange}
            placeholder={placeholder}
            className={className}
            includeAllOption={includeAllOption}
            allOptionLabel={allOptionLabel}
            disabled={disabled}
            fetchOptions={fetchRoles}
            getOptionLabel={(role) => role.name}
            getOptionValue={(role) => role.id.toString()}
            locale={locale}
        />
    )
}

