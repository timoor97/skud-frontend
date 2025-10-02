'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

export interface MultiSelectCustomProps<T = unknown> {
    selected: string[]
    onChange: (selected: string[]) => void
    initialOptions?: T[] | null
    placeholder?: string
    className?: string
    disabled?: boolean
    maxCount?: number
    emptyText?: string
    // Fetch function - receives (page, searchQuery) and returns { data: { models: T[], meta: {...} } }
    fetchOptions?: (page: number, searchQuery?: string, limit?: number) => Promise<ApiResponse<T>>
    // Convert item to display format
    getOptionLabel: (item: T) => string
    getOptionValue: (item: T) => string
    locale?: string
}

export function MultiSelectCustom<T = unknown>({
    selected,
    onChange,
    initialOptions,
    placeholder = "Select...",
    className,
    disabled = false,
    maxCount = 3,
    emptyText = "No options found",
    fetchOptions,
    getOptionLabel,
    getOptionValue,
}: MultiSelectCustomProps<T>) {
    const t = useTranslations('SelectComponents')
    const [open, setOpen] = useState(false)
    const [optionsList, setOptionsList] = useState<T[] | null>(initialOptions || null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [hasLoaded, setHasLoaded] = useState(false)

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

    // Load initial data when dropdown opens for the first time
    useEffect(() => {
        if (!fetchOptions) return
        if (!open) return
        if (hasLoaded) return
        
        // Fetch initial data
        searchOptions('')
        setHasLoaded(true)
    }, [open, fetchOptions, hasLoaded, searchOptions])
    
    // Handle search with debounce
    useEffect(() => {
        if (!fetchOptions) return
        if (!open) return
        if (!hasLoaded) return // Only search after initial load
        
        const timeoutId = setTimeout(() => {
            searchOptions(searchQuery) // Search with current query (even if empty to reset)
        }, 500)
        
        return () => clearTimeout(timeoutId)
    }, [searchQuery, fetchOptions, open, hasLoaded, searchOptions])

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

    const handleUnselect = (item: string) => {
        onChange(selected.filter((i) => i !== item))
    }

    const handleSelect = (item: string) => {
        if (selected.includes(item)) {
            onChange(selected.filter((i) => i !== item))
        } else {
            onChange([...selected, item])
        }
    }

    const selectedItems = selected
        .map(value => optionsList?.find(item => getOptionValue(item) === value))
        .filter(Boolean) as T[]

    const displayCount = selected.length
    const showMore = displayCount > maxCount

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between min-h-10 h-auto",
                        className
                    )}
                    disabled={disabled}
                >
                    <div className="flex gap-1 flex-wrap">
                        {selected.length > 0 ? (
                            <>
                                {selectedItems.slice(0, maxCount).map((item) => (
                                    <Badge
                                        variant="secondary"
                                        key={getOptionValue(item)}
                                        className="mr-1 mb-1 cursor-pointer hover:bg-secondary/80"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            handleUnselect(getOptionValue(item))
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleUnselect(getOptionValue(item))
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        {getOptionLabel(item)}
                                        <X className="ml-1 h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </Badge>
                                ))}
                                {showMore && (
                                    <Badge variant="secondary" className="mr-1 mb-1">
                                        +{displayCount - maxCount} more
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                {/* Search Input */}
                {fetchOptions && (
                    <div className="p-2 border-b sticky top-0 bg-popover z-10">
                        <Input
                            placeholder={t('placeholders.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8"
                        />
                    </div>
                )}

                {/* Options List */}
                <div className="max-h-[200px] overflow-y-auto" onScroll={handleScroll}>
                    {(optionsList || []).length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {isLoading ? t('messages.loading') : emptyText}
                        </div>
                    ) : (
                        (optionsList || []).map((item, index) => (
                            <div
                                key={index}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleSelect(getOptionValue(item))
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected.includes(getOptionValue(item)) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {getOptionLabel(item)}
                            </div>
                        ))
                    )}
                    
                    {/* Load More Indicator */}
                    {hasMore && fetchOptions && (
                        <div className="px-2 py-1.5 text-sm text-center text-muted-foreground border-t">
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
                </div>
            </PopoverContent>
        </Popover>
    )
}

