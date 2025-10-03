'use client'

import React, {FC, useCallback, useEffect} from 'react'
import {MetaData, UserListItem} from '@/types/usersTypes'
import {Edit, Trash2, Eye} from "lucide-react"
import {PageHeader} from "@/components/dashboard/page-header"
import {useLocale, useTranslations} from 'next-intl'
import ViewTable, {TableColumn} from '@/components/ui/viewTable'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {getAllUsers} from '@/app/[locale]/actions/(users)/getAllUsers'
import {useUserModalStore} from '@/hooks/useModalStore'
import {useConfirmDeleteStore} from '@/hooks/useConfirmDelete'
import DeleteWithConfirmation from "@/components/ui/DeleteWithConfirmation";
import {toast} from 'sonner'
import Image from 'next/image'
import {CurrentUser} from "@/types/currentUserTypes";
import UserFilters from "@/components/clientLayout/users/filters/UserFilter";
import { PERMISSIONS } from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import { useRouter } from '@/i18n/navigation'

interface UsersListProps {
    users: UserListItem[] | null
    userActions: {
        action: string
    }[]
    currentUser: CurrentUser
    meta: MetaData
}

const UsersList: FC<UsersListProps> = ({users,userActions,currentUser, meta}) => {

    const t = useTranslations('Users')
    const tStatus = useTranslations('Users.Modal.status')
    const [page, setPage] = React.useState(meta.current_page - 1);
    const [rowsPerPage, setRowsPerPage] = React.useState(meta.per_page);
    const [usersList, setUsersList] = React.useState<UserListItem[] | null>(users)
    const [isLoading, setIsLoading] = React.useState(false)
    const [currentMeta, setCurrentMeta] = React.useState<MetaData>(meta)
    const [filters, setFilters] = React.useState({
        name: '',
        role_id: 'all',
        status: 'all'
    })
    const {id: deleteId, setDeleteId} = useConfirmDeleteStore()
    const { hasPermission } = usePermissions(userActions, currentUser.includes.role?.name || '')

    const locale = useLocale()
    const router = useRouter()

    const {openModal} = useUserModalStore();


    const canViewUser = hasPermission(PERMISSIONS.VIEW_USER);
    const canCreateUser = hasPermission(PERMISSIONS.CREATE_USER);
    const canEditUser = hasPermission(PERMISSIONS.EDIT_USER);
    const canDeleteUser = hasPermission(PERMISSIONS.DELETE_USER);

    const loadUsers = useCallback(async (page: number, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            // Convert string values to proper types for API
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined
            const apiRoleId = currentFilters.role_id && currentFilters.role_id !== 'all' ? currentFilters.role_id : undefined

            const apiStatus = (() => {
                if (!currentFilters.status || currentFilters.status === 'all' || currentFilters.status === '') {
                    return undefined
                }
                return currentFilters.status === 'true'
            })()

            const res = await getAllUsers(locale, page + 1, apiName, apiRoleId, apiStatus, currentRowsPerPage)
            setUsersList(res.data.models)

            setCurrentMeta(res.data.meta)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setIsLoading(false)
        }
    }, [locale, filters, rowsPerPage])

    useEffect(() => {
        useUserModalStore.getState().setOnSuccess(() => {
            setPage(0)
            const resetFilters = {
                name: '',
                role_id: 'all',
                status: 'all'
            }
            setFilters(resetFilters)
            loadUsers(0, resetFilters, rowsPerPage)
        })
    }, [rowsPerPage, loadUsers])



    const handleChangePage = (newPage: number) => {
        // Check if the requested page is valid based on current meta
        const maxPage = Math.max(0, Math.ceil(currentMeta.total / currentMeta.per_page) - 1)
        const validPage = Math.min(newPage, maxPage)

        setPage(validPage);
        loadUsers(validPage, filters, rowsPerPage)
    };

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        loadUsers(0, filters, newRowsPerPage)
    };

    const handleDelete = async (id: number) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/${locale}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept-Language': locale,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                toast.success(`${t('ToastMsg.delete')}`)
            } else {
                toast.error(`${t('ToastMsg.error')}`)
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(`${t('ToastMsg.error')}`)
        } finally {
            setIsLoading(false)
        }

        loadUsers(page, filters, rowsPerPage)
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
        loadUsers(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        const resetFilters = {
            name: '',
            role_id: 'all',
            status: 'all'
        }
        setFilters(resetFilters)
        setPage(0)
        loadUsers(0, resetFilters, rowsPerPage)
    }

    const handleLimitChange = (limit: number | 'all') => {
        const newLimit = limit === 'all' ? currentMeta.total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadUsers(0, filters, newLimit);
    }

    // Define table columns with responsive styling
    const columns: TableColumn[] = [
        {key: 'id', label: 'ID', className: 'text-center hidden sm:table-cell'},
        {key: 'image', label: t('TableHeader.image'), className: 'text-center'},
        {key: 'first_name', label: t('TableHeader.firstName'), className: 'text-center'},
        {key: 'last_name', label: t('TableHeader.lastName'), className: 'text-center hidden md:table-cell'},
        {key: 'phone', label: t('TableHeader.phone'), className: 'text-center hidden lg:table-cell'},
        {key: 'role', label: t('TableHeader.role'), className: 'text-center hidden sm:table-cell'},
        {key: 'status', label: t('TableHeader.status'), className: 'text-center'},
        {key: 'actions', label: t('TableHeader.actions'), className: 'text-center'},
    ]

    return (
        <>
            <PageHeader
                title={t('UsersManagement.title')}
            />
            <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4 pt-4 sm:pt-6">
                <UserFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilter={handleApplyFilter}
                    onResetFilter={handleResetFilter}
                    isLoading={isLoading}
                />
                <ViewTable
                    isLoading={isLoading}
                    canCreate={canCreateUser}
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
                    {usersList && usersList.length > 0 ? (
                        usersList.map((user) => (
                            <TableRow 
                                key={user.id} 
                                className="group hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-200 border-b border-border/50 cursor-pointer"
                                onClick={() => router.push(`/users/${user.id}`)}
                            >
                                <TableCell className="text-center font-mono text-xs sm:text-sm hidden sm:table-cell">
                                    <span className="font-semibold text-primary">{user.id}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                    {user.image ? (
                                        <div className="relative inline-block">
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image}`}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                width={40}
                                                height={40}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mx-auto ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                            <span className="text-sm font-bold text-primary">
                                                {user.first_name?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col sm:block">
                                        <span className="font-bold text-sm sm:text-base truncate">{user.first_name}</span>
                                        <span className="text-xs text-muted-foreground sm:hidden">{user.last_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-semibold text-sm sm:text-base hidden md:table-cell">
                                    {user.last_name}
                                </TableCell>
                                <TableCell className="text-center text-muted-foreground text-xs sm:text-sm font-medium hidden lg:table-cell">
                                    {user.phone}
                                </TableCell>
                                <TableCell className="text-center hidden sm:table-cell">
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {user.includes?.roles && user.includes.roles.length > 0 ? (
                                            user.includes.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20">
                                                    {role.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                {t('ToastMsg.noRole')}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span
                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                            user.status
                                                ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${
                                            user.status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                                        }`}></span>
                                        <span className="hidden sm:inline">{user.status ? tStatus('active') : tStatus('inactive')}</span>
                                        <span className="sm:hidden">{user.status ? tStatus('active').charAt(0) : tStatus('inactive').charAt(0)}</span>
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        {canViewUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/users/${user.id}`);
                                                }}
                                                className="h-9 w-9 p-0 touch-manipulation hover:bg-primary/10 hover:text-primary transition-all"
                                                title="View user"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canEditUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(user.id);
                                                }}
                                                className="h-9 w-9 p-0 touch-manipulation hover:bg-blue-500/10 hover:text-blue-600 transition-all"
                                                title="Edit user"
                                            >
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canDeleteUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteId(user.id);
                                                }}
                                                className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive touch-manipulation transition-all"
                                                title="Delete user"
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
                            <TableCell colSpan={8} className="text-center py-12 sm:py-16">
                                <div className="flex flex-col items-center gap-4 sm:gap-5">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-inner">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg sm:text-xl font-bold text-foreground/80">{t('ToastMsg.noUsers')}</p>
                                        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-sm">
                                            No users found matching your criteria. Try adjusting your filters.
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
export default UsersList