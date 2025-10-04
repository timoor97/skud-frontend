'use client'

import React, {FC, useCallback,useEffect} from 'react'
import {useLocale, useTranslations} from 'next-intl'
import { Button } from "@/components/ui/button"
import { Monitor, Wifi, WifiOff, Trash2, X, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {getDevicesInSingleUserAction} from '@/app/[locale]/actions/(faceDeviceUsers)/getDevicesInSingleUser'
import {removeSingleUserInDevicesAction} from '@/app/[locale]/actions/(faceDeviceUsers)/removeSingleUserInDevices'
import {toast} from 'sonner'
import { PERMISSIONS } from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import DevicesInUserFilter from "./filters/DevicesInUserFilter"
import {
    DevicesInUserProps,
    MetaData,
    DeviceUserStatus
} from "@/types/devicesInUserTypes";
import CustomLoading from "@/components/ui/customLoading"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const FaceDevicesInUser: FC<DevicesInUserProps> = ({
    userId,
    deviceActions,
    currentUser
}) => {
    const t = useTranslations('FaceDevices')
    const [devicesStatusList, setDevicesStatusList] = React.useState<DeviceUserStatus[] | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [selectedDevices, setSelectedDevices] = React.useState<number[]>([])
    const [isRemoving, setIsRemoving] = React.useState(false)
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [currentMeta, setCurrentMeta] = React.useState<MetaData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    })
    const [filters, setFilters] = React.useState({
        name: ''
    })
    
    const { hasPermission } = usePermissions(deviceActions, currentUser.includes?.role?.name || '')
    const locale = useLocale()

    const canRemoveDevices = hasPermission(PERMISSIONS.REMOVE_FACE_DEVICE_USERS);

    const loadDevices = useCallback(async (page: number, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined

            const res = await getDevicesInSingleUserAction(locale, userId, page + 1, apiName, currentRowsPerPage)
            setDevicesStatusList(res.data.models || [])
            setCurrentMeta(res.data.meta)
            setPage(page)
        } catch (error) {
            console.error('Error loading devices in user:', error)
            toast.error('Failed to load devices for user')
        } finally {
            setIsLoading(false)
        }
    }, [locale, userId, rowsPerPage, filters])

    const handleRemoveDevice = async (deviceId: number) => {
        setIsRemoving(true)
        setIsLoading(true)
        try {
            const result = await removeSingleUserInDevicesAction(locale, userId, [deviceId])
            
            // Check if the response indicates an error
            if (result && result.error_class) {
                toast.error(result.message || t('ToastMsg.error'))
                return
            }
            
            toast.success('User removed from device successfully')
            // Reload the devices list to refresh the data
            await loadDevices(page, filters, rowsPerPage)
        } catch (error: unknown) {
            console.error('Error removing device:', error)
            
            // Handle structured error responses
            if (error instanceof Error) {
                toast.error(error.message)
            } else if (error && typeof error === 'object' && 'message' in error) {
                toast.error(String(error.message))
            } else {
                toast.error(t('ToastMsg.error'))
            }
        } finally {
            setIsRemoving(false)
            setIsLoading(false)
        }
    }

    const handleSelectDevice = (deviceId: number, checked: boolean) => {
        setSelectedDevices(prev => 
            checked 
                ? [...prev, deviceId]
                : prev.filter(id => id !== deviceId)
        )
    }


    const handleRemoveSelectedDevices = async () => {
        if (selectedDevices.length === 0) {
            toast.error('Please select at least one device')
            return
        }

        setIsRemoving(true)
        setIsLoading(true)
        try {
            const result = await removeSingleUserInDevicesAction(locale, userId, selectedDevices)
            
            // Check if the response indicates an error
            if (result && result.error_class) {
                toast.error(result.message || t('ToastMsg.error'))
                return
            }
            
            toast.success(`User removed from ${selectedDevices.length} device(s) successfully`)
            setSelectedDevices([])
            // Reload the devices list to refresh the data
            await loadDevices(page, filters, rowsPerPage)
        } catch (error: unknown) {
            console.error('Error removing devices:', error)
            
            // Handle structured error responses
            if (error instanceof Error) {
                toast.error(error.message)
            } else if (error && typeof error === 'object' && 'message' in error) {
                toast.error(String(error.message))
            } else {
                toast.error(t('ToastMsg.error'))
            }
        } finally {
            setIsRemoving(false)
            setIsLoading(false)
        }
    }

    const handleChangePage = (newPage: number) => {
        loadDevices(newPage, filters, rowsPerPage)
    }


    const handleLimitChange = (limit: number | 'all') => {
        const newLimit = limit === 'all' ? currentMeta.total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadDevices(0, filters, newLimit);
    }

    // Filter handlers
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleApplyFilter = () => {
        loadDevices(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            name: ''
        }
        setFilters(resetFilters)
        loadDevices(0, resetFilters, rowsPerPage)
    }

    // Load devices on component mount - only when userId changes or component first mounts
    useEffect(() => {
        loadDevices(page, filters, rowsPerPage)
    }, [loadDevices, page, filters, rowsPerPage])

    const tPagination = useTranslations('Pagination')

    const renderPagination = () => {
        const totalPages = Math.ceil(currentMeta.total / currentMeta.per_page);
        const currentPage = currentMeta.current_page;
        
        if (totalPages <= 1) return null;

        const generatePageNumbers = () => {
            const pages = []
            const maxVisiblePages = 5

            if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                if (currentPage <= 3) {
                    for (let i = 1; i <= 3; i++) {
                        pages.push(i)
                    }
                    if (totalPages > 4) pages.push('ellipsis')
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    pages.push(1)
                    if (totalPages > 4) pages.push('ellipsis')
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    pages.push(1)
                    pages.push('ellipsis')
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                    }
                    pages.push('ellipsis')
                    pages.push(totalPages)
                }
            }

            return pages
        }

        return (
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="text-sm text-muted-foreground">
                    {tPagination('showing')} {((currentPage - 1) * currentMeta.per_page) + 1} {tPagination('to')} {Math.min(currentPage * currentMeta.per_page, currentMeta.total)} {tPagination('of')} {currentMeta.total} {tPagination('results')}
                </div>
                <Pagination>
                    <PaginationContent className="flex items-center gap-1">
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => currentPage > 1 && handleChangePage(currentPage - 2)}
                                className={cn(
                                    "h-8 w-8 p-0",
                                    currentPage <= 1 && 'pointer-events-none opacity-50'
                                )}
                            >
                                <ChevronLeftIcon className="h-4 w-4"/>
                            </PaginationLink>
                        </PaginationItem>

                        {generatePageNumbers().map((pageNum, index) => (
                            <PaginationItem key={index}>
                                {pageNum === 'ellipsis' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => handleChangePage((pageNum as number) - 1)}
                                        isActive={pageNum === currentPage}
                                        className="h-8 w-8 p-0"
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationLink
                                onClick={() => currentPage < totalPages && handleChangePage(currentPage)}
                                className={cn(
                                    "h-8 w-8 p-0",
                                    currentPage >= totalPages && 'pointer-events-none opacity-50'
                                )}
                            >
                                <ChevronRightIcon className="h-4 w-4"/>
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        );
    };

    const renderDeviceCard = (deviceStatus: DeviceUserStatus) => {
        const device = deviceStatus?.faceDevice;
        if (!device) return null;

        const isSelected = selectedDevices.includes(device.id);

        const handleCardClick = () => {
            if (canRemoveDevices && !isRemoving) {
                handleSelectDevice(device.id, !isSelected);
            }
        };

        return (
            <Card 
                key={device.id} 
                className={cn(
                    "group hover:shadow-lg transition-all duration-200 border-l-4 relative",
                    isSelected ? "border-l-red-500 bg-red-50/50 dark:bg-red-950/10" : "border-l-primary/30 hover:border-l-red-400",
                    canRemoveDevices && !isRemoving && "cursor-pointer"
                )}
                onClick={handleCardClick}
            >
                <CardContent className="p-4 sm:p-5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            {canRemoveDevices && (
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleSelectDevice(device.id, checked as boolean)}
                                    className="mt-1.5 h-5 w-5 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 pointer-events-none"
                                    disabled={isRemoving}
                                />
                            )}
                            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex-shrink-0">
                                <Monitor className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-bold truncate mb-1">{device.name}</h3>
                                <p className="text-sm text-muted-foreground">ID: <span className="font-semibold text-primary">#{device.id}</span></p>
                            </div>
                        </div>
                        {canRemoveDevices && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveDevice(device.id);
                                }}
                                className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all flex-shrink-0"
                                title="Remove user from device"
                                disabled={isRemoving}
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>

                    {/* Status Badges Row */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge 
                            variant={device.status === 'active' ? "default" : "secondary"}
                            className={`text-xs px-2.5 py-1 ${device.status === 'active' ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-500/20"}`}
                        >
                            {device.status === 'active' ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                            {device.status === 'active' ? t('TableHeader.active') : t('TableHeader.inactive')}
                        </Badge>
                        <Badge 
                            variant="outline"
                            className={`text-xs px-2.5 py-1 ${device.type === 'enter' ? "border-emerald-400 text-emerald-700 dark:text-emerald-400" : "border-red-400 text-red-700 dark:text-red-400"}`}
                        >
                            {'→'}
                            {device.type === 'enter' ? t('TableHeader.enter') : t('TableHeader.exit')}
                        </Badge>
                    </div>

                    {/* Connection Info */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">{t('TableHeader.ip')}</p>
                            <p className="font-mono text-sm break-all">{device.ip}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">{t('TableHeader.port')}</p>
                            <p className="font-mono text-sm">{device.port}</p>
                        </div>
                    </div>

                    {/* Sync Status Row */}
                    <div className="pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                {deviceStatus.user_status === 'success' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : deviceStatus.user_status === 'pending' ? (
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm text-muted-foreground font-medium">{t('TableHeader.userStatus')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {deviceStatus.image_status === 'success' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : deviceStatus.image_status === 'pending' ? (
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm text-muted-foreground font-medium">{t('TableHeader.imageStatus')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {deviceStatus.card_status === 'success' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : deviceStatus.card_status === 'pending' ? (
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm text-muted-foreground font-medium">{t('TableHeader.cardStatus')}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="space-y-4">
            {/* Filter Section */}
            <DevicesInUserFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilter={handleApplyFilter}
                onResetFilter={handleResetFilter}
                isLoading={isLoading}
            />
            
            {/* Bulk Actions Banner */}
            {canRemoveDevices && selectedDevices.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-red-500/5 to-red-500/10 border border-red-500/20 rounded-lg shadow-sm gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/20">
                            <Monitor className="h-4 w-4 text-red-500" />
                        </div>
                        <span className="text-sm font-semibold text-red-500">
                            {selectedDevices.length} {t('BulkActions.selected')}
                        </span>
                    </div>
                    <Button
                        onClick={handleRemoveSelectedDevices}
                        disabled={isRemoving}
                        size="sm"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 h-9 text-sm w-full sm:w-auto"
                    >
                        {isRemoving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{t('BulkActions.removing')}</span>
                            </>
                        ) : (
                            <>
                                <X className="h-4 w-4" />
                                <span>{t('BulkActions.removeFromDevices', { count: selectedDevices.length })}</span>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Header with Rows Per Page */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {tPagination('rowsPerPage')}:
                    </span>
                    <Select
                        value={rowsPerPage === currentMeta.total ? 'all' : rowsPerPage.toString()}
                        onValueChange={(value) => {
                            const newLimit = value === 'all' ? currentMeta.total : parseInt(value, 10);
                            handleLimitChange(newLimit);
                        }}
                    >
                        <SelectTrigger className="w-16 h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="all">{tPagination('all')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Device Cards Grid */}
            {isLoading ? (
                <CustomLoading />
            ) : devicesStatusList && devicesStatusList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {devicesStatusList.map(renderDeviceCard)}
                </div>
            ) : (
                <Card className="p-8">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <div className="p-3 bg-muted rounded-full">
                            <Monitor className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-base font-medium">No devices assigned</h3>
                            <p className="text-sm">This user hasn&apos;t been assigned to any face devices yet</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Pagination */}
            {renderPagination()}
        </div>
    );
}

export default FaceDevicesInUser