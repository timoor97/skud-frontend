'use client'

import React, {FC, useCallback, useEffect} from 'react'
import {FaceDevice} from '@/types/faceDevicesTypes'
import {Edit, Trash2, Eye} from "lucide-react"
import {PageHeader} from "@/components/dashboard/page-header"
import {useLocale, useTranslations} from 'next-intl'
import ViewTable, {TableColumn} from '@/components/ui/viewTable'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {getAllFaceDevices} from '@/app/[locale]/actions/(faceDevices)/getAllFaceDevices'
import {useViewFaceDeviceModal} from '@/hooks/useViewModal'
import {useFaceDeviceModalStore} from '@/hooks/useModalStore'
import {useConfirmDeleteStore} from '@/hooks/useConfirmDelete'
import DeleteWithConfirmation from "@/components/ui/DeleteWithConfirmation";
import {toast} from 'sonner'
import FaceDeviceFilter from '@/components/clientLayout/faceDevices/filters/FaceDeviceFilter'
import {User} from "@/types/currentUserTypes";
import {PERMISSIONS} from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import {MetaData} from "@/types/rolesTypes";

interface FaceDevicesListProps {
    faceDevices: FaceDevice[] | null
    userActions: {
        action: string
    }[]
    user: User
    meta: MetaData
}

const FaceDevicesList: FC<FaceDevicesListProps> = ({faceDevices, userActions, user, meta}) => {

    const t = useTranslations('FaceDevices')
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
    const {hasPermission} = usePermissions(userActions, user.includes.role?.name || '')

    const locale = useLocale()

    const {openModal} = useFaceDeviceModalStore();
    const {openModal: openViewModal} = useViewFaceDeviceModal()

    const canViewFaceDevice = hasPermission(PERMISSIONS.VIEW_FACE_DEVICE);
    const canCreateFaceDevice = hasPermission(PERMISSIONS.CREATE_FACE_DEVICE);
    const canEditFaceDevice = hasPermission(PERMISSIONS.EDIT_FACE_DEVICE);
    const canDeleteFaceDevice = hasPermission(PERMISSIONS.DELETE_FACE_DEVICE);

    const loadFaceDevices = useCallback(async (page: number, currentFilters = filters) => {
        setIsLoading(true)
        try {
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined
            const apiType = currentFilters.type && currentFilters.type !== 'all' ? currentFilters.type : undefined
            const apiStatus = currentFilters.status && currentFilters.status !== 'all' ? currentFilters.status : undefined

            const res = await getAllFaceDevices(locale, page + 1, apiName, apiType, apiStatus)
            setFaceDevicesList(res.data.models)
            setCurrentMeta(res.data.meta)
            setPage(page)
        } catch (error) {
            console.error('Error loading face devices:', error)
            toast.error('Failed to load face devices')
        } finally {
            setIsLoading(false)
        }
    }, [locale, filters])

    useEffect(() => {
        setFaceDevicesList(faceDevices)
        setCurrentMeta(meta)
    }, [faceDevices, meta]);

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
                loadFaceDevices(page, filters) // Reload current page
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
        loadFaceDevices(0, filters)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            name: '',
            type: 'all',
            status: 'all'
        }
        setFilters(resetFilters)
        loadFaceDevices(0, resetFilters)
    }

    const handleChangePage = (newPage: number) => {
        loadFaceDevices(newPage, filters)
    }

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
        loadFaceDevices(0, filters) // Reset to first page
    }

    const columns: TableColumn[] = [
        {key: 'id', label: t('TableHeader.id'), className: 'text-center'},
        {key: 'name', label: t('TableHeader.name'), className: 'text-center'},
        {key: 'type', label: t('TableHeader.type'), className: 'text-center'},
        {key: 'ip', label: t('TableHeader.ip'), className: 'text-center'},
        {key: 'port', label: t('TableHeader.port'), className: 'text-center'},
        {key: 'status', label: t('TableHeader.status'), className: 'text-center'},
        {key: 'actions', label: t('TableHeader.actions'), className: 'text-center'},
    ]

    return (
        <>
            <PageHeader
                title={t('Title.title')}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <FaceDeviceFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilter={handleApplyFilter}
                    onResetFilter={handleResetFilter}
                    isLoading={isLoading}
                />
                <ViewTable
                    isLoading={isLoading}
                    canCreate={canCreateFaceDevice}
                    createLabel={t('CreateBtn.label')}
                    columns={columns}
                    openModal={openModal}
                    total={currentMeta.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                >
                    {faceDevicesList && faceDevicesList.length > 0 ? (
                        faceDevicesList.map((device) => (
                            <TableRow key={device.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="text-center font-mono text-sm">{device.id}</TableCell>
                                <TableCell className="text-center font-semibold">
                                    {device.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        device.type === 'enter'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {device.type === 'enter' ? t('TableHeader.enter') : t('TableHeader.exit')}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center font-mono text-sm">{device.ip}</TableCell>
                                <TableCell className="text-center font-mono text-sm">{device.port}</TableCell>
                                <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        device.status
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {device.status ? t('TableHeader.active') : t('TableHeader.inactive')}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {canViewFaceDevice && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openViewModal(device.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canEditFaceDevice && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openModal(device.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canDeleteFaceDevice && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteId(device.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">{t('ToastMsg.noDevices')}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {deleteId !== null && (
                        <DeleteWithConfirmation
                            id={deleteId}
                            onDelete={handleDelete}
                            onClose={() => setDeleteId(null)}
                        />
                    )}
                </ViewTable>
            </div>
        </>
    );
}

export default FaceDevicesList
