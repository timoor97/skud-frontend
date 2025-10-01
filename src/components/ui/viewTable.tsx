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

export interface TableColumn {
    key: string
    label: string
    className?: string
}

export interface TableAction {
    label: string
    icon: React.ReactNode
    onClick: (row: Record<string, unknown>) => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    tooltip?: string
}

export interface ViewTableProps {
    title?: string
    columns: TableColumn[]
    rows?: Record<string, unknown>[] // Optional for backward compatibility
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
}

const ViewTable: React.FC<ViewTableProps> = ({
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
                                                 footerContent
                                             }) => {
    const t = useTranslations('Pagination')

    const handleLimitChange = (value: string) => {
        if (value === 'all') {
            onLimitChange?.('all')
        } else {
            const limit = parseInt(value, 10)
            onLimitChange?.(limit)
        }
    }

    const renderCellValue = (row: Record<string, unknown>, column: TableColumn): React.ReactNode => {
        const value = row[column.key]

        // Handle nested object properties (e.g., "user.role.name")
        if (column.key.includes('.')) {
            const keys = column.key.split('.')
            let nestedValue: unknown = row
            for (const key of keys) {
                if (nestedValue && typeof nestedValue === 'object' && nestedValue !== null) {
                    nestedValue = (nestedValue as Record<string, unknown>)[key]
                } else {
                    return '-'
                }
            }
            return nestedValue ? String(nestedValue) : '-'
        }

        return value ? String(value) : '-'
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <CardTitle>{title}</CardTitle>
                        </div>
                        {showLimitSelector && onLimitChange && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{t('rowsPerPage')}:</span>
                                <Select
                                    value={rowsPerPage === total ? 'all' : (rowsPerPage?.toString() || '10')}
                                    onValueChange={handleLimitChange}
                                >
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {limitOptions.map((option) => (
                                            <SelectItem key={option} value={option.toString()}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="all">{t('all')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {(headerAction || (canCreate && createLabel)) && (
                        <Button onClick={() => openModal()}>
                            {headerAction?.icon && <span className="mr-2">{headerAction.icon}</span>}
                            {headerAction?.label || createLabel}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <CustomLoading />
                ) : (
                    <Table>
                        {caption && <TableCaption>{caption}</TableCaption>}
                        <TableHeader>
                            <TableRow>
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
                            {children ? (
                                // Use children if provided (new pattern)
                                <>{children}</>
                            ) : rows.length === 0 ? (
                                // Fallback to rows prop (old pattern)
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row, index) => (
                                    <TableRow key={typeof row.id === 'string' || typeof row.id === 'number' ? row.id : index}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.key}
                                                className={column.className}
                                            >
                                                {renderCellValue(row, column)}
                                            </TableCell>
                                        ))}
                                        {actions.length > 0 && (
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {actions.map((action, actionIndex) => (
                                                        <Button
                                                            key={actionIndex}
                                                            variant={action.variant || "ghost"}
                                                            size={action.size || "sm"}
                                                            onClick={() => action.onClick(row)}
                                                            title={action.tooltip}
                                                        >
                                                            {action.icon}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        {showFooter && footerContent && (
                            <TableFooter>
                                {footerContent}
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

// Pagination Component
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
                // Show first few pages
                for (let i = 0; i < 3; i++) {
                    pages.push(i)
                }
                if (totalPages > 4) pages.push('ellipsis')
                pages.push(totalPages - 1)
            } else if (currentPage >= totalPages - 3) {
                // Show last few pages
                pages.push(0)
                if (totalPages > 4) pages.push('ellipsis')
                for (let i = totalPages - 3; i < totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show current page context
                pages.push(0)
                pages.push('ellipsis')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages - 1)
            }
        }

        return pages
    }

    return (
        <div className="flex items-center justify-center">
            <Pagination>
                <PaginationContent className="flex items-center gap-2">
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

                    <div className="flex items-center gap-1.5 mx-3">
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
                    </div>

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
                            <ChevronRightIcon className="h-4 w-4"/>
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ViewTable