'use client'

import React, { FC, useState, useEffect, useCallback } from 'react'
import { CurrentUser } from '@/types/currentUserTypes'
import ViewTable, { TableColumn } from '@/components/ui/viewTable'
import { getFaceDeviceRecordsAction } from '@/app/[locale]/actions/(faceDeviceUsers)/getFaceDeviceRecords'
import { useTranslations, useLocale } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Phone } from 'lucide-react'
import FaceDeviceRecordsFilters from './filters/FaceDeviceRecordsFilters'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image'

interface FaceDeviceRecordsProps {
    faceDeviceId: number
    deviceName: string
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
}

interface FaceDeviceRecord {
    id: number
    user_id: number
    face_device_id: number
    image: string
    serial_number_record: string
    created_at: string
    updated_at: string
    user: {
        id: number
        image: string
        first_name: string
        last_name: string
        phone: string
        card_number: number
    }
    face_device: {
        id: number
        name: string
        ip: string
        serial_number: string
    }
}


const FaceDeviceRecords: FC<FaceDeviceRecordsProps> = ({
    faceDeviceId,
    deviceName,
    userActions,
    currentUser
}) => {
    const t = useTranslations('FaceDevices')
    const locale = useLocale()
    const [records, setRecords] = useState<FaceDeviceRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({
        search: '',
    })

    const loadRecords = useCallback(async (currentPage: number = page, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            // Convert string values to proper types for API
            const apiName = currentFilters.search && currentFilters.search.trim() !== '' ? currentFilters.search : undefined

            const response = await getFaceDeviceRecordsAction(
                locale,
                faceDeviceId,
                currentPage + 1, // API expects 1-based page
                apiName,
                currentRowsPerPage
            )
            if (response && response.data) {
                setRecords(response.data.models)
                setTotal(response.data.meta.total || 0)
            }
        } catch (error) {
            console.error('Error fetching face device records:', error)
            setRecords([])
            setTotal(0)
        } finally {
            setIsLoading(false)
        }
    }, [locale, faceDeviceId, rowsPerPage])

    useEffect(() => {
        loadRecords()
    }, [faceDeviceId, page, rowsPerPage])

    const handleChangePage = (newPage: number) => {
        // Check if the requested page is valid based on current total
        const maxPage = Math.max(0, Math.ceil(total / rowsPerPage) - 1)
        const validPage = Math.min(newPage, maxPage)

        setPage(validPage);
        loadRecords(validPage, filters, rowsPerPage)
    }

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        loadRecords(0, filters, newRowsPerPage)
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleApplyFilter = () => {
        setPage(0) // Reset to first page when applying filters
        loadRecords(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            search: '',
        }
        setFilters(resetFilters)
        setPage(0)
        loadRecords(0, resetFilters, rowsPerPage)
    }

    const handleLimitChange = (limit: number | 'all') => {
        const newLimit = limit === 'all' ? total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadRecords(0, filters, newLimit);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    // Define table columns with responsive styling
    const columns: TableColumn[] = [
        {key: 'id', label: 'ID', className: 'text-center hidden sm:table-cell'},
        {key: 'image', label: t('Records.image'), className: 'text-center'},
        {key: 'user_name', label: t('Records.userName'), className: 'text-center'},
        {key: 'phone', label: t('Records.phone'), className: 'text-center hidden lg:table-cell'},
        {key: 'serial_number_record', label: t('Records.serialNumber'), className: 'text-center hidden md:table-cell'},
        {key: 'created_at', label: t('Records.dateTime'), className: 'text-center'},
    ]

    return (
        <div className="space-y-6">
            <FaceDeviceRecordsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilter={handleApplyFilter}
                onResetFilter={handleResetFilter}
                isLoading={isLoading}
            />

            <ViewTable
                isLoading={isLoading}
                columns={columns}
                total={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showLimitSelector={true}
                onLimitChange={handleLimitChange}
                emptyMessage={t('Records.noRecords')}
            >
                {records && records.length > 0 ? (
                    records.map((record) => (
                        <TableRow 
                            key={record.id} 
                            className="group hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-200 border-b border-border/50"
                        >
                            <TableCell className="text-center font-mono text-xs sm:text-sm hidden sm:table-cell">
                                <span className="font-semibold text-primary">{record.id}</span>
                            </TableCell>
                            <TableCell className="text-center">
                                {record.image ? (
                                    <div className="relative inline-block">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${record.image}`}
                                            alt={`${record.user.first_name} ${record.user.last_name}`}
                                            width={40}
                                            height={40}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mx-auto ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                        <span className="text-sm font-bold text-primary">
                                            {record.user.first_name?.[0]?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col sm:block">
                                    <span className="font-bold text-sm sm:text-base truncate">
                                        {record.user.first_name} {record.user.last_name}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground text-xs sm:text-sm font-medium hidden lg:table-cell">
                                {record.user.phone}
                            </TableCell>
                            <TableCell className="text-center hidden md:table-cell">
                                <Badge variant="outline" className="font-mono text-xs">
                                    {record.serial_number_record}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs sm:text-sm">{formatDate(record.created_at)}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 sm:py-16">
                            <div className="flex flex-col items-center gap-4 sm:gap-5">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-inner">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg sm:text-xl font-bold text-foreground/80">{t('Records.noRecords')}</p>
                                    <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm">
                                        No records found matching your criteria. Try adjusting your filters.
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </ViewTable>
        </div>
    )
}

export default FaceDeviceRecords
