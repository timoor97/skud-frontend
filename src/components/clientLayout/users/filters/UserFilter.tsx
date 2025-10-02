'use client'

import React, { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { RotateCcw, Search } from "lucide-react"
import { RoleSelect } from "@/components/shared/roles/role-select"

interface UserFilterProps {
    filters: {
        name: string
        role_id: string
        status: string
    }
    isLoading?: boolean
    onFilterChange: (key: string, value: string) => void
    onApplyFilter: () => void
    onResetFilter: () => void
}


const UserFilter: FC<UserFilterProps> = ({
    filters,
    isLoading,
    onFilterChange,
    onApplyFilter,
    onResetFilter,
}) => {
    const t = useTranslations('Users.Filters')
    const tBtns = useTranslations('Btns')

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Name Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="name-filter">{t('name')}</Label>
                        <Input
                            id="name-filter"
                            placeholder={t('placeholders.name')}
                            value={filters.name || ''}
                            onChange={(e) => onFilterChange('name', e.target.value)}
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="role-filter">{t('role')}</Label>
                        <RoleSelect
                            value={filters.role_id || 'all'}
                            onValueChange={(value) => onFilterChange('role_id', value)}
                            placeholder={t('placeholders.role')}
                            className="w-full min-w-[300px]"
                            includeAllOption={true}
                            allOptionLabel={`${t('options.all')} ${t('role')}`}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="status-filter">{t('status')}</Label>
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => onFilterChange('status', value)}
                        >
                            <SelectTrigger className="w-full min-w-[300px]">
                                <SelectValue placeholder={t('statusOptions.selectPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('options.all')} {t('status')}
                                </SelectItem>
                                <SelectItem value="true">
                                    {t('statusOptions.active')}
                                </SelectItem>
                                <SelectItem value="false">
                                    {t('statusOptions.inactive')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <Label className="invisible">Actions</Label>
                        <div className="flex gap-2 mt-2">
                            <Button
                                onClick={onResetFilter}
                                disabled={isLoading}
                                variant="outline"
                                className="flex-1"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                {tBtns('reset')}
                            </Button>
                            <Button
                                onClick={onApplyFilter}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {tBtns('filtering')}
                                    </div>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4 mr-2" />
                                        {tBtns('filter')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserFilter