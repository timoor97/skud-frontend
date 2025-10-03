'use client'

import React, { FC, useCallback, useEffect } from 'react'
import { MetaData, RoleListItem } from '@/types/rolesTypes'
import { Edit, Trash2, Eye } from "lucide-react"
import { PageHeader } from "@/components/dashboard/page-header"
import { useLocale, useTranslations } from 'next-intl'
import ViewTable, { TableColumn } from '@/components/ui/viewTable'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getRole } from '@/app/[locale]/actions/(roles)/getAllRoles'
import { useViewRoleModal } from '@/hooks/useViewModal'
import {useRoleModalStore} from '@/hooks/useModalStore'
import { useConfirmDeleteStore } from '@/hooks/useConfirmDelete'
import DeleteWithConfirmation from "@/components/ui/DeleteWithConfirmation";
import { toast } from 'sonner'
import { CurrentUser } from "@/types/currentUserTypes";
import { PERMISSIONS } from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import RoleFilters from '@/components/clientLayout/roles/filters/RoleFilter'

interface RolesListProps {
    roles: RoleListItem[] | null
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    meta: MetaData
}

const RolesList: FC<RolesListProps> = ({ roles, userActions, currentUser, meta }) => {

    const t = useTranslations('Roles')
    const [page, setPage] = React.useState(meta.current_page - 1);
    const [rowsPerPage, setRowsPerPage] = React.useState(meta.per_page);
    const [rolesList, setRolesList] = React.useState<RoleListItem[] | null>(roles)
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentMeta, setCurrentMeta] = React.useState<MetaData>(meta)
    const [filters, setFilters] = React.useState({
        name: ''
    })
    const { id: deleteId, setDeleteId } = useConfirmDeleteStore()
    const { hasPermission } = usePermissions(userActions, currentUser.includes.role?.name || '')

    const locale = useLocale()

    const { openModal } = useRoleModalStore();
    const { openModal: openViewModal } = useViewRoleModal()

    const canViewRole = hasPermission(PERMISSIONS.VIEW_ROLE);
    const canCreateRole = hasPermission(PERMISSIONS.CREATE_ROLE);
    const canEditRole = hasPermission(PERMISSIONS.EDIT_ROLE);
    const canDeleteRole = hasPermission(PERMISSIONS.DELETE_ROLE);

    const loadRoles = useCallback(async (page: number, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            // Convert string values to proper types for API
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined

            const res = await getRole(locale, page + 1, apiName, currentRowsPerPage)
            setRolesList(res.data.models)
            setCurrentMeta(res.data.meta)
            setPage(page)
        } catch (error) {
            console.error('Error loading roles:', error)
            toast.error('Failed to load roles')
        } finally {
            setIsLoading(false)
        }
    }, [locale, filters, rowsPerPage])

    useEffect(() => {
        useRoleModalStore.getState().setOnSuccess(() => {
            setPage(0)
            const resetFilters = {
                name: '',
            }
            setFilters(resetFilters)
            loadRoles(0, resetFilters, rowsPerPage)
        })
    }, [rowsPerPage, loadRoles])

    const handleChangePage = (newPage: number) => {
        loadRoles(newPage, filters, rowsPerPage)
    }

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage)
        loadRoles(0, filters, newRowsPerPage) // Reset to first page
    }

    const handleDelete = async (roleId: number) => {
        try {
            const res = await fetch(`/${locale}/api/roles/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Accept-Language': locale || 'ru',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                toast.success(t('ToastMsg.delete'))
                loadRoles(page, filters, rowsPerPage) // Reload current page
            } else {
                const errorData = await res.json()
                toast.error(errorData.message || 'Failed to delete role')
            }
        } catch (error) {
            console.error('Delete role error:', error)
            toast.error('Failed to delete role')
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
        setPage(0) // Reset to first page when filtering
        loadRoles(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            name: ''
        }
        setFilters(resetFilters)
        setPage(0)
        loadRoles(0, resetFilters, rowsPerPage)
    }

    const handleLimitChange = (limit: number | 'all') => {
        const newLimit = limit === 'all' ? currentMeta.total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadRoles(0, filters, newLimit);
    }

    const columns: TableColumn[] = [
        { key: 'id', label: t('TableHeader.id'), className: 'text-center' },
        { key: 'name', label: t('TableHeader.name'), className: 'text-center' },
        { key: 'key', label: t('TableHeader.key'), className: 'text-center' },
        { key: 'actions', label: t('TableHeader.actions'), className: 'text-center' },
    ]

    return (
        <>
            <PageHeader
                title={t('RolesManagement.title')}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <RoleFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilter={handleApplyFilter}
                    onResetFilter={handleResetFilter}
                    isLoading={isLoading}
                />
                <ViewTable
                    isLoading={isLoading}
                    canCreate={canCreateRole}
                    createLabel={t('CreateBtn.label')}
                    columns={columns}
                    openModal={openModal}
                    total={currentMeta.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    showLimitSelector={true}
                    onLimitChange={handleLimitChange}
                >
                    {rolesList && rolesList.length > 0 ? (
                        rolesList.map((role) => (
                            <TableRow key={role.id} className="group hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-200 border-b border-border/50">
                                <TableCell className="text-center py-2">
                                    <span className="font-semibold text-primary text-sm">{role.id}</span>
                                </TableCell>
                                <TableCell className="text-center py-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                            <span className="text-xs font-bold text-primary">
                                                {role.name?.[0]?.toUpperCase() || 'R'}
                                            </span>
                                        </div>
                                        <span className="font-bold text-sm truncate">{role.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center py-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                        {role.key}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center py-2">
                                    <div className="flex items-center justify-center gap-1">
                                        {canViewRole && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openViewModal(role.id)}
                                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all"
                                                title="View role"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {canEditRole && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openModal(role.id)}
                                                className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                                                title="Edit role"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {canDeleteRole && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteId(role.id)}
                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 transition-all"
                                                title="Delete role"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 sm:py-16">
                                <div className="flex flex-col items-center gap-4 sm:gap-5">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-inner">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg sm:text-xl font-bold text-foreground/80">{t('ToastMsg.noRoles')}</p>
                                        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm">
                                            No roles found matching your criteria. Try adjusting your filters.
                                        </p>
                                    </div>
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

export default RolesList
