'use client'

import React, {FC, useCallback, useEffect} from 'react'
import {MetaData, UserListItem} from '@/types/usersTypes'
import {RoleListItem} from '@/types/rolesTypes'
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
    roles?: RoleListItem[] | null
}

const UsersList: FC<UsersListProps> = ({users,userActions,currentUser, meta, roles}) => {

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
                    roles={roles}
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
                            <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="text-center font-mono text-xs sm:text-sm hidden sm:table-cell">{user.id}</TableCell>
                                <TableCell className="text-center">
                                    {user.image ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${user.image}`}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            width={32}
                                            height={32}
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover mx-auto"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                                        <span className="text-xs text-gray-500">
                                            {user.first_name?.[0]?.toUpperCase() || '?'}
                                        </span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center font-semibold text-sm sm:text-base">
                                    <div className="flex flex-col sm:block">
                                        <span className="truncate">{user.first_name}</span>
                                        <span className="text-xs text-muted-foreground sm:hidden">{user.last_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-semibold text-sm sm:text-base hidden md:table-cell">{user.last_name}</TableCell>
                                <TableCell className="text-center text-muted-foreground text-xs sm:text-sm hidden lg:table-cell">{user.phone}</TableCell>
                                <TableCell className="text-center hidden sm:table-cell">
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {user.includes?.roles && user.includes.roles.length > 0 ? (
                                            user.includes.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {role.name}
                                            </span>
                                            ))
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {t('ToastMsg.noRole')}
                                        </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                user.status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                user.status ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                            <span className="hidden sm:inline">{user.status ? tStatus('active') : tStatus('inactive')}</span>
                                            <span className="sm:hidden">{user.status ? tStatus('active').charAt(0) : tStatus('inactive').charAt(0)}</span>
                                        </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {canViewUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/users/${user.id}`)}
                                                className="h-8 w-8 p-0 touch-manipulation"
                                                title="View user"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canEditUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openModal(user.id)}
                                                className="h-8 w-8 p-0 touch-manipulation"
                                                title="Edit user"
                                            >
                                                <Edit className="h-4 w-4"/>
                                            </Button>
                                        )}
                                        {canDeleteUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteId(user.id)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 touch-manipulation"
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
                            <TableCell colSpan={8} className="text-center py-8 sm:py-12">
                                <div className="flex flex-col items-center gap-3 sm:gap-4 text-muted-foreground">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-base sm:text-lg font-medium">{t('ToastMsg.noUsers')}</p>
                                    <p className="text-xs sm:text-sm text-center max-w-xs">No users found matching your criteria</p>
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