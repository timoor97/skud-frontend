'use client'

import React from 'react'
import {useTranslations} from 'next-intl'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import CustomLoading from "@/components/ui/customLoading"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"

export interface TableColumn {
    key: string
    label: string
    className?: string
}

export interface TableAction {
    label: string
    icon: React.ReactNode
    onClick: (id: number) => void
    className?: string
    disabled?: (id: number) => boolean

    size?: 'default' | 'sm' | 'lg' | 'icon'
    tooltip?: string
}

export interface MultiSelectViewTableProps {
    title?: string
    columns: TableColumn[]
    rows?: Record<string, unknown>[] // Optional for向后 compatibility
    actions?: TableAction[]
    headerAction?: {
        label: string
        icon?: React.ReactNode
        onClick: () => void
    }
    emptyMessage?: string
    isLoading?: boolean
    children?: React.ReactNode // Support for children pattern
    // Pagination props
    total?: number
    page?: number
    rowsPerPage?: number
    onPageChange?: (page: number) => void
    onRowsPerPageChange?: (rowsPerPage: number) => void
    // Limit selector props
    showLimitSelector?: boolean
    limitOptions?: number[]
    onLimitChange?: (limit: number | 'all') => void
    // Additional props like friend's example
    canCreate?: boolean
    createLabel?: string
    openModal?: (id?: number | null) => void;
    // Table styling props
    caption?: string
    showFooter?: boolean
    footerContent?: React.ReactNode
    // Multi-select props
    hasMultiSelect?: boolean
    selectedItems?: number[]
    onSelectItem?: (id: number, checked: boolean) => void
    onSelectAll?: (checked: boolean) => void
    canMultiSelect?: boolean
    multiSelectPermissions?: {
        canMultiSelect: boolean
    }
    // Data for select all logic
    selectAllData?: {
        itemCount: number
        selectedCount: number
    }
}

const MultiSelectViewTable: React.FC<MultiSelectViewTableProps> = ({
                                                 title,
                                                 columns,
                                                 rows = [],
                                                 actions = [],
                                                 headerAction,
                                                 emptyMessage = "No data available",
                                                 isLoading = false,
                                                 children,
                                                 total,
                                                 page,
                                                 rowsPerPage,
                                                 onPageChange,
                                                 onRowsPerPageChange,
                                                 showLimitSelector = false,
                                                 limitOptions = [10, 30, 50, 100],
                                                 onLimitChange,
                                                 canCreate,
                                                 createLabel,
                                                 openModal = () => {
                                                 },
                                                 caption,
                                                 showFooter = false,
                                                 footerContent,
// Multi-select props
hasMultiSelect = false,
onSelectAll = () => {},
canMultiSelect = false,
multiSelectPermissions = undefined,
selectAllData = { itemCount: 0, selectedCount: 0 },
}) => {
    const t = useTranslations('Pagination')


    const handleLimitChange = (newLimit: string | number | 'all') => {
        if (onLimitChange) {
            if (newLimit === 'all') {
                onLimitChange('all')
            } else {
                onLimitChange(Number(newLimit))
            }
        }
        if (onRowsPerPageChange) {
            if (newLimit === 'all') {
                onRowsPerPageChange(Number(total))
            } else {
                onRowsPerPageChange(Number(newLimit))
            }
        }
    }



    const canShowMultiSelect = hasMultiSelect && (canMultiSelect || multiSelectPermissions?.canMultiSelect) && selectAllData.itemCount > 0

    return (
        <Card>
            {(title || headerAction || canCreate || showLimitSelector) && (
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {title ? (
                            <>
                                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {showLimitSelector && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">{t('rowsPerPage')}:</span>
                                            <Select
                                                value={rowsPerPage === total ? 'all' : (rowsPerPage?.toString() || '10')}
                                                onValueChange={handleLimitChange}
                                            >
                                                <SelectTrigger className="w-[100px] h-9">
                                                    <SelectValue placeholder={rowsPerPage || 10} />
                                                </SelectTrigger>
                                                <SelectContent side="bottom">
                                                    {limitOptions.map((limit) => (
                                                        <SelectItem key={limit} value={limit.toString()}>
                                                            {limit}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="all">{t('all')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    {headerAction && (
                                        <Button
                                            onClick={headerAction.onClick}
                                            size={headerAction.icon ? "icon" : "default"}
                                            className="flex items-center gap-2"
                                        >
                                            {headerAction.icon && headerAction.icon}
                                            {headerAction.label}
                                        </Button>
                                    )}
                                    {canCreate && (
                                        <Button
                                            onClick={() => openModal(null)}
                                            className="flex items-center gap-2"
                                        >
                                            <span>{createLabel || 'Create'}</span>
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {showLimitSelector && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">{t('rowsPerPage')}:</span>
                                        <Select
                                            value={rowsPerPage === total ? 'all' : (rowsPerPage?.toString() || '10')}
                                            onValueChange={handleLimitChange}
                                        >
                                            <SelectTrigger className="w-[100px] h-9">
                                                <SelectValue placeholder={rowsPerPage || 10} />
                                            </SelectTrigger>
                                            <SelectContent side="bottom">
                                                {limitOptions.map((limit) => (
                                                    <SelectItem key={limit} value={limit.toString()}>
                                                        {limit}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="all">{t('all')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 flex-wrap ml-auto">
                                    {headerAction && (
                                        <Button
                                            onClick={headerAction.onClick}
                                            size={headerAction.icon ? "icon" : "default"}
                                            className="flex items-center gap-2"
                                        >
                                            {headerAction.icon && headerAction.icon}
                                            {headerAction.label}
                                        </Button>
                                    )}
                                    {canCreate && (
                                        <Button
                                            onClick={() => openModal(null)}
                                            className="flex items-center gap-2"
                                        >
                                            <span>{createLabel || 'Create'}</span>
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </CardHeader>
            )}
            <CardContent>
                {isLoading ? (
                    <CustomLoading />
                ) : (
                    <Table>
                        {caption && <TableCaption>{caption}</TableCaption>}
                        <TableHeader>
                            <TableRow>
                                {/* Multi-select header checkbox */}
                                {hasMultiSelect && (
                                    <TableHead className="text-center w-12">
                                        {canShowMultiSelect ? (
                                            <Checkbox
                                                checked={
                                                    selectAllData.selectedCount === selectAllData.itemCount && selectAllData.itemCount > 0
                                                        ? true
                                                        : selectAllData.selectedCount > 0 && selectAllData.selectedCount < selectAllData.itemCount
                                                            ? 'indeterminate' as const
                                                            : false
                                                }
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        onSelectAll(true)
                                                    } else {
                                                        onSelectAll(false)
                                                    }
                                                }}
                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                title="Select all items on this page"
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </TableHead>
                                )}
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        className={column.className}
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                                {actions.length > 0 && (
                                    <TableHead className="text-right">Actions</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {children}
                            {rows.length === 0 && !children && !isLoading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (hasMultiSelect ? 1 : 0)}
                                        className="text-center py-8"
                                    >
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-base font-medium">{emptyMessage}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        {showFooter && footerContent && (
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (hasMultiSelect ? 1 : 0)}
                                    >
                                        {footerContent}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                )}
            </CardContent>

            {/* Pagination */}
            {total && onPageChange && (
                <div className="px-6 py-4 border-t">
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {t('showing')} {((page || 0) * (rowsPerPage || 10)) + 1} {t('to')} {Math.min(((page || 0) + 1) * (rowsPerPage || 10), total)} {t('of')} {total} {t('results')}
                        </div>
                        <PaginationComponent
                            currentPage={page || 0}
                            totalPages={Math.ceil(total / (rowsPerPage || 10))}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </Card>
    )
}

// Pagination Component (same as ViewTable)
interface PaginationComponentProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
                                                                     currentPage,
                                                                     totalPages,
                                                                     onPageChange
                                                                 }) => {
    const generatePageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 0; i < totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show first page, current page context, and last page with ellipsis
            if (currentPage <= 2) {
                // Near the beginning
                for (let i = 0; i < Math.min(4, totalPages); i++) {
                    pages.push(i)
                }
                if (totalPages > 4) {
                    pages.push('ellipsis')
                    pages.push(totalPages - 1)
                }
            } else if (currentPage >= totalPages - 3) {
                // Near the end
                pages.push(0)
                pages.push('ellipsis')
                for (let i = Math.max(0, totalPages - 4); i < totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // In the middle
                pages.push(0)
                pages.push('ellipsis')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                if (totalPages > 2) {
                    pages.push('ellipsis')
                    pages.push(totalPages - 1)
                }
            }
        }
        return pages
    }

    return (
        <div className="flex items-center justify-center">
            <Pagination>
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                            className={cn(
                                "px-3 py-2 h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md",
                                currentPage === 0
                                    ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer'
                            )}
                        >
                            <ChevronLeftIcon className="h-4 w-4"/>
                        </PaginationLink>
                    </PaginationItem>

                    {generatePageNumbers().map((pageNum, index) => (
                        <PaginationItem key={index}>
                            {pageNum === 'ellipsis' ? (
                                <PaginationEllipsis className="px-3 py-2 text-muted-foreground"/>
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(pageNum as number)}
                                    isActive={pageNum === currentPage}
                                    className={cn(
                                        "h-10 w-10 rounded-lg border transition-all duration-200 cursor-pointer font-medium text-sm",
                                        pageNum === currentPage
                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                                    )}
                                >
                                    {(pageNum as number) + 1}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationLink
                            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                            className={cn(
                                "px-3 py-2 h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md",
                                currentPage === totalPages - 1
                                    ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer'
                            )}
                        >
                            <ChevronRightIcon className=" h-4 w-4"/>
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default MultiSelectViewTable
