'use client'

import React, { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RotateCcw } from 'lucide-react'

interface DevicesOutUserFilterProps {
    filters: {
        name: string
    }
    onFilterChange: (key: string, value: string) => void
    onApplyFilter: () => void
    onResetFilter: () => void
    isLoading: boolean
}

const DevicesOutUserFilter: FC<DevicesOutUserFilterProps> = ({
    filters,
    onFilterChange,
    onApplyFilter,
    onResetFilter,
    isLoading
}) => {
    const t = useTranslations('FaceDevices')
    const tBtns = useTranslations('Btns')

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onApplyFilter()
        }
    }

    return (
        <div className="bg-card rounded-lg border border-border/50 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                    <Input
                        placeholder={t('Filters.searchByName')}
                        value={filters.name}
                        onChange={(e) => onFilterChange('name', e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="h-10"
                    />
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <Button
                        variant="outline"
                        onClick={onResetFilter}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none h-10 px-4 sm:px-6"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {tBtns('reset')}
                    </Button>

                    <Button
                        onClick={onApplyFilter}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none h-10 px-4 sm:px-6"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        {tBtns('filter')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DevicesOutUserFilter

