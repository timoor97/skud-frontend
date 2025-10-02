'use client'

import React, {FC, useCallback, useEffect} from 'react'
import {FaceDevice} from '@/types/faceDevicesTypes'
import {Edit, Trash2, Eye, Plus, Monitor, Wifi, WifiOff} from "lucide-react"
import {PageHeader} from "@/components/dashboard/page-header"
import {useLocale, useTranslations} from 'next-intl'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {getAllFaceDevices} from '@/app/[locale]/actions/(faceDevices)/getAllFaceDevices'
import {useViewFaceDeviceModal} from '@/hooks/useViewModal'
import {useFaceDeviceModalStore} from '@/hooks/useModalStore'
import {useConfirmDeleteStore} from '@/hooks/useConfirmDelete'
import DeleteWithConfirmation from "@/components/ui/DeleteWithConfirmation";
import {toast} from 'sonner'
import FaceDeviceFilter from '@/components/clientLayout/faceDevices/filters/FaceDeviceFilter'
import {CurrentUser} from "@/types/currentUserTypes";
import {PERMISSIONS} from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import {MetaData} from "@/types/rolesTypes";
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
import CustomLoading from "@/components/ui/customLoading"

interface FaceDevicesListProps {
    faceDevices: FaceDevice[] | null
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    meta: MetaData
}

const FaceDevicesList: FC<FaceDevicesListProps> = ({faceDevices, userActions, currentUser, meta}) => {

    const t = useTranslations('FaceDevices')
    const tPagination = useTranslations('Pagination')
    const tModal = useTranslations('FaceDevices.Modal.labels')
    const [page, setPage] = React.useState(meta.current_page - 1);
    const [rowsPerPage, setRowsPerPage] = React.useState(meta.per_page);
    const [faceDevicesList, setFaceDevicesList] = React.useState<FaceDevice[] | null>(faceDevices)
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentMeta, setCurrentMeta] = React.useState<MetaData>(meta)
    const [filters, setFilters] = React.useState({
        name: '',
        type: 'all',
        status: 'all'
    })
    const {id: deleteId, setDeleteId} = useConfirmDeleteStore()
    const {hasPermission} = usePermissions(userActions, currentUser.includes.role?.name || '')

    const locale = useLocale()

    const {openModal} = useFaceDeviceModalStore();
    const {openModal: openViewModal} = useViewFaceDeviceModal()

    const canViewFaceDevice = hasPermission(PERMISSIONS.VIEW_FACE_DEVICE);
    const canCreateFaceDevice = hasPermission(PERMISSIONS.CREATE_FACE_DEVICE);
    const canEditFaceDevice = hasPermission(PERMISSIONS.EDIT_FACE_DEVICE);
    const canDeleteFaceDevice = hasPermission(PERMISSIONS.DELETE_FACE_DEVICE);

    const loadFaceDevices = useCallback(async (page: number, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined
            const apiType = currentFilters.type && currentFilters.type !== 'all' ? currentFilters.type : undefined
            const apiStatus = currentFilters.status && currentFilters.status !== 'all' ? currentFilters.status : undefined

            const res = await getAllFaceDevices(locale, page + 1, apiName, apiType, apiStatus, currentRowsPerPage)
            setFaceDevicesList(res.data.models)
            setCurrentMeta(res.data.meta)
            setPage(page)
        } catch (error) {
            console.error('Error loading face devices:', error)
            toast.error('Failed to load face devices')
        } finally {
            setIsLoading(false)
        }
    }, [locale, filters, rowsPerPage])

    useEffect(() => {
        useFaceDeviceModalStore.getState().setOnSuccess(() => {
            setPage(0)
            const resetFilters = {
                name: '',
                type: 'all',
                status: 'all'
            }
            setFilters(resetFilters)
            loadFaceDevices(0, resetFilters, rowsPerPage)
        })
    }, [rowsPerPage, loadFaceDevices])

    const handleDelete = async (deviceId: number) => {
        try {
            const res = await fetch(`/${locale}/api/faceDevices/${deviceId}`, {
                method: 'DELETE',
                headers: {
                    'Accept-Language': locale || 'ru',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                toast.success(t('ToastMsg.delete'))
                loadFaceDevices(page, filters, rowsPerPage) // Reload current page
            } else {
                const errorData = await res.json()
                toast.error(errorData.message || 'Failed to delete face device')
            }
        } catch (error) {
            console.error('Delete face device error:', error)
            toast.error('Failed to delete face device')
        } finally {
            setDeleteId(null)
        }
    }

    // Filter handlers
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleApplyFilter = () => {
        loadFaceDevices(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            name: '',
            type: 'all',
            status: 'all'
        }
        setFilters(resetFilters)
        loadFaceDevices(0, resetFilters, rowsPerPage)
    }

    const handleChangePage = (newPage: number) => {
        loadFaceDevices(newPage, filters, rowsPerPage)
    }


    const handleLimitChange = (limit: number | 'all') => {
        const newLimit = limit === 'all' ? currentMeta.total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadFaceDevices(0, filters, newLimit);
    }

    const renderPagination = () => {
        const totalPages = Math.ceil(currentMeta.total / currentMeta.per_page);
        const currentPage = currentMeta.current_page;
        
        if (totalPages <= 1) return null;

        const generatePageNumbers = () => {
            const pages = []
            const maxVisiblePages = 5

            if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                // Show first page, current page context, and last page with ellipsis
                if (currentPage <= 3) {
                    // Show first few pages
                    for (let i = 1; i <= 3; i++) {
                        pages.push(i)
                    }
                    if (totalPages > 4) pages.push('ellipsis')
                    pages.push(totalPages)
                } else if (currentPage >= totalPages - 2) {
                    // Show last few pages
                    pages.push(1)
                    if (totalPages > 4) pages.push('ellipsis')
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                        pages.push(i)
                    }
                } else {
                    // Show current page context
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
            <div className="px-6 py-4 border-t">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        {tPagination('showing')} {((currentPage - 1) * currentMeta.per_page) + 1} {tPagination('to')} {Math.min(currentPage * currentMeta.per_page, currentMeta.total)} {tPagination('of')} {currentMeta.total} {tPagination('results')}
                    </div>
                    <div className="flex items-center justify-center">
                        <Pagination>
                            <PaginationContent className="flex items-center gap-2">
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => currentPage > 1 && handleChangePage(currentPage - 2)}
                                        className={cn(
                                            "px-3 py-2 h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md",
                                            currentPage <= 1
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
                                                    onClick={() => handleChangePage((pageNum as number) - 1)}
                                                    isActive={pageNum === currentPage}
                                                    className={cn(
                                                        "h-10 w-10 rounded-lg border transition-all duration-200 cursor-pointer font-medium text-sm",
                                                        pageNum === currentPage
                                                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                            : "bg-background border-border hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                                                    )}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}
                                </div>

                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => currentPage < totalPages && handleChangePage(currentPage)}
                                        className={cn(
                                            "px-3 py-2 h-10 w-10 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md",
                                            currentPage >= totalPages
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
                </div>
            </div>
        );
    };

    const renderDeviceCard = (device: FaceDevice) => (
        <Card key={device.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg font-semibold truncate">{device.name}</CardTitle>
                            <p className="text-xs sm:text-sm text-muted-foreground">ID: {device.id}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                            variant={device.status === 'active' ? "default" : "secondary"}
                            className={`text-xs ${device.status === 'active' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}`}
                        >
                            {device.status === 'active' ? (
                                <>
                                    <Wifi className="h-3 w-3 mr-1" />
                                    <span className="hidden xs:inline">{t('TableHeader.active')}</span>
                                    <span className="xs:hidden">Active</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3 w-3 mr-1" />
                                    <span className="hidden xs:inline">{t('TableHeader.inactive')}</span>
                                    <span className="xs:hidden">Inactive</span>
                                </>
                            )}
                        </Badge>
                        <Badge 
                            variant="outline"
                            className={`text-xs ${device.type === 'enter' ? "border-emerald-500 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400" : "border-red-500 text-red-700 dark:border-red-400 dark:text-red-400"}`}
                        >
                            {device.type === 'enter' ? t('TableHeader.enter') : t('TableHeader.exit')}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('TableHeader.ip')}</p>
                        <p className="text-xs sm:text-sm font-mono break-all">{device.ip}</p>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('TableHeader.port')}</p>
                        <p className="text-xs sm:text-sm font-mono">{device.port}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground truncate">
                        {tModal('username')}: {device.username}
                    </div>
                    <div className="flex items-center gap-1 justify-end sm:justify-start">
                        {canViewFaceDevice && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewModal(device.id)}
                                className="h-8 w-8 p-0 touch-manipulation"
                                title="View device"
                            >
                                <Eye className="h-4 w-4"/>
                            </Button>
                        )}
                        {canEditFaceDevice && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openModal(device.id)}
                                className="h-8 w-8 p-0 touch-manipulation"
                                title="Edit device"
                            >
                                <Edit className="h-4 w-4"/>
                            </Button>
                        )}
                        {canDeleteFaceDevice && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(device.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 touch-manipulation"
                                title="Delete device"
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <>
            <PageHeader
                title={t('Title.title')}
            />
            <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-4 sm:pt-6">
                <FaceDeviceFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilter={handleApplyFilter}
                    onResetFilter={handleResetFilter}
                    isLoading={isLoading}
                />
                
                {/* Header with Create Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                {tPagination('rowsPerPage')}:
                            </span>
                            <Select
                                value={rowsPerPage === currentMeta.total ? 'all' : rowsPerPage.toString()}
                                onValueChange={(value) => {
                                    const newLimit = value === 'all' ? currentMeta.total : parseInt(value, 10);
                                    handleLimitChange(newLimit);
                                }}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="all">{tPagination('all')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {canCreateFaceDevice && (
                        <Button onClick={() => openModal()} className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('CreateBtn.label')}
                        </Button>
                    )}
                </div>

                {/* Device Cards Grid */}
                {isLoading ? (
                    <CustomLoading />
                ) : faceDevicesList && faceDevicesList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {faceDevicesList.map(renderDeviceCard)}
                    </div>
                ) : (
                    <Card className="p-8 sm:p-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <div className="p-3 sm:p-4 bg-muted rounded-full">
                                <Monitor className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-base sm:text-lg font-medium">{t('ToastMsg.noDevices')}</h3>
                                <p className="text-xs sm:text-sm">No face recognition devices found</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Pagination */}
                {renderPagination()}

                {/* Delete Confirmation */}
                {deleteId !== null && (
                    <DeleteWithConfirmation
                        id={deleteId}
                        onDelete={handleDelete}
                        onClose={() => setDeleteId(null)}
                    />
                )}
            </div>
        </>
    );
}

export default FaceDevicesList
