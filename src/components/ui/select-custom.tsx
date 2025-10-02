'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface SelectOption {
    label: string
    value: string
}

interface ApiResponse<T> {
    data: {
        models: T[]
        meta: {
            current_page: number
            total_pages: number
            total: number
            per_page: number
        }
    }
}

export interface SelectCustomProps<T = unknown> {
    value?: string
    onValueChange?: (value: string) => void
    initialOptions?: T[] | null
    placeholder?: string
    className?: string
    includeAllOption?: boolean
    allOptionLabel?: string
    disabled?: boolean
    // Fetch function - receives (page, searchQuery) and returns { data: { models: T[], meta: {...} } }
    fetchOptions?: (page: number, searchQuery?: string, limit?: number) => Promise<ApiResponse<T>>
    // Convert item to option
    getOptionLabel: (item: T) => string
    getOptionValue: (item: T) => string
    locale?: string
}

export function SelectCustom<T = unknown>({
    value,
    onValueChange,
    initialOptions,
    placeholder = "Select...",
    className,
    includeAllOption = false,
    allOptionLabel = "All",
    disabled = false,
    fetchOptions,
    getOptionLabel,
    getOptionValue,
}: SelectCustomProps<T>) {
    const t = useTranslations('SelectComponents')
    const [optionsList, setOptionsList] = useState<T[] | null>(initialOptions || null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    
    // Load more options
    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore || !fetchOptions) return
        
        setIsLoading(true)
        try {
            const nextPage = page + 1
            const searchName = searchQuery.trim() !== '' ? searchQuery : undefined
            const res = await fetchOptions(nextPage, searchName, 10)
            
            if (res?.data?.models && res.data.models.length > 0) {
                setOptionsList(prev => [...(prev || []), ...res.data.models])
                setPage(nextPage)
                
                if (res.data.meta) {
                    setHasMore(res.data.meta.current_page < res.data.meta.total_pages)
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error loading more options:', error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchOptions, page, isLoading, hasMore, searchQuery])
    
    // Search options
    const searchOptions = useCallback(async (query: string) => {
        if (!fetchOptions) return
        
        setIsLoading(true)
        try {
            const searchName = query.trim() !== '' ? query : undefined
            const res = await fetchOptions(1, searchName, 10)
            
            if (res?.data?.models) {
                setOptionsList(res.data.models)
                setPage(1)
                
                if (res.data.meta) {
                    setHasMore(res.data.meta.current_page < res.data.meta.total_pages)
                } else {
                    setHasMore(false)
                }
            } else {
                setOptionsList([])
                setHasMore(false)
            }
        } catch (error) {
            console.error('Error searching options:', error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchOptions])
    
    // Handle search with debounce
    useEffect(() => {
        if (!fetchOptions) return
        
        const timeoutId = setTimeout(() => {
            searchOptions(searchQuery)
        }, 500)
        
        return () => clearTimeout(timeoutId)
    }, [searchQuery, searchOptions, fetchOptions])
    
    // Handle scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const { scrollTop, scrollHeight, clientHeight } = target
        
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            if (hasMore && !isLoading) {
                loadMore()
            }
        }
    }

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {/* Search Input */}
                {fetchOptions && (
                    <div className="p-2 border-b sticky top-0 bg-popover z-10">
                        <Input
                            placeholder={t('placeholders.search')}
                            value={searchQuery}
                            onChange={(e) => {
                                e.stopPropagation()
                                setSearchQuery(e.target.value)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="h-8"
                        />
                    </div>
                )}
                
                {/* Options List */}
                <div 
                    className="max-h-[200px] overflow-y-auto"
                    onScroll={handleScroll}
                >
                    {includeAllOption && (
                        <SelectItem value="all">{allOptionLabel}</SelectItem>
                    )}
                    
                    {(optionsList || []).length > 0 ? (
                        (optionsList || []).map((item, index) => (
                            <SelectItem key={index} value={getOptionValue(item)}>
                                {getOptionLabel(item)}
                            </SelectItem>
                        ))
                    ) : (
                        !isLoading && (
                            <div className="px-3 py-2 text-sm text-center text-muted-foreground">
                                {t('messages.noOptionsFound')}
                            </div>
                        )
                    )}
                    
                    {/* Load More Indicator */}
                    {hasMore && fetchOptions && (
                        <div className="px-3 py-2 text-sm text-center text-muted-foreground border-t">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    {t('messages.loading')}
                                </div>
                            ) : (
                                t('messages.scrollForMore')
                            )}
                        </div>
                    )}
                    
                    {isLoading && (optionsList || []).length === 0 && (
                        <div className="px-3 py-8 text-sm text-center text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                {t('messages.loading')}
                            </div>
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    )
}

