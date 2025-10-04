'use client'

import React, {FC, useCallback,useEffect} from 'react'
import {useLocale, useTranslations} from 'next-intl'
import MultiSelectViewTable, {TableColumn} from '@/components/ui/multiSelectViewTable'
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { UserPlus, Users } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {getUsersOutSingleDeviceAction} from '@/app/[locale]/actions/(faceDeviceUsers)/getUsersOutSingleDevice'
import {addUsersToSingleDeviceAction} from '@/app/[locale]/actions/(faceDeviceUsers)/addUsersToSingleDevice'
import {toast} from 'sonner'
import Image from 'next/image'
import { PERMISSIONS } from '@/constants/permissions'
import usePermissions from '@/hooks/usePermissions'
import UsersOutDeviceFilter from "./filters/UsersOutDeviceFilter"
import {
    UserOutDevice,
    UsersOutDeviceProps,
    MetaData
} from "@/types/usersOutDeviceTypes";

const UsersOutDevice: FC<UsersOutDeviceProps> = ({
    faceDeviceId,
    deviceName,
    userActions,
    currentUser
}) => {
    const t = useTranslations('Users')
    const tBulk = useTranslations('Users.BulkActions')
    const tDevice = useTranslations('Users.UsersOutDevice')
    const [usersList, setUsersList] = React.useState<UserOutDevice[] | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
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
    const [selectedUsers, setSelectedUsers] = React.useState<number[]>([])
    const [isAssigning, setIsAssigning] = React.useState(false)
    
    const { hasPermission } = usePermissions(userActions, currentUser.includes?.role?.name || '')
    const locale = useLocale()

    const canAssignUser = hasPermission(PERMISSIONS.ADD_FACE_DEVICE_USERS);

    const loadUsers = useCallback(async (page: number, currentFilters = filters, currentRowsPerPage = rowsPerPage) => {
        setIsLoading(true)
        try {
            const apiName = currentFilters.name && currentFilters.name.trim() !== '' ? currentFilters.name : undefined

            const res = await getUsersOutSingleDeviceAction(locale, faceDeviceId, page + 1, apiName, currentRowsPerPage)
            setUsersList(res.data.models)
            setCurrentMeta(res.data.meta)
            setPage(page)
        } catch (error) {
            console.error('Error loading users:', error)
            toast.error('Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }, [locale, faceDeviceId, rowsPerPage, filters])

    const handleAssignUser = async (userId: number) => {
        setIsAssigning(true)
        setIsLoading(true)
        try {
            const result = await addUsersToSingleDeviceAction(locale, faceDeviceId, [userId])
            
            // Check if the response indicates an error
            if (result && result.error_class) {
                toast.error(result.message || 'Failed to assign user to device')
                return
            }
            
            toast.success('User assigned to device successfully')
            // Reset page to 0 and reload the users list to refresh the data
            setPage(0)
            await loadUsers(0, filters, rowsPerPage)
        } catch (error: unknown) {
            console.error('Error assigning user:', error)
            
            // Handle structured error responses
            if (error instanceof Error) {
                toast.error(error.message)
            } else if (error && typeof error === 'object' && 'message' in error) {
                toast.error(String(error.message))
            } else {
                toast.error('Failed to assign user to device')
            }
        } finally {
            setIsAssigning(false)
            setIsLoading(false)
        }
    }

    const handleSelectUser = (userId: number, checked: boolean) => {
        setSelectedUsers(prev => 
            checked 
                ? [...prev, userId]
                : prev.filter(id => id !== userId)
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (usersList) {
            setSelectedUsers(checked ? usersList.map(user => user.id) : [])
        }
    }

    const handleAssignSelectedUsers = async () => {
        if (selectedUsers.length === 0) {
            toast.error('Please select at least one user')
            return
        }

        setIsAssigning(true)
        setIsLoading(true)
        try {
            const result = await addUsersToSingleDeviceAction(locale, faceDeviceId, selectedUsers)
            
            // Check if the response indicates an error
            if (result && result.error_class) {
                toast.error(result.message || 'Failed to assign users to device')
                return
            }
            
            toast.success(`${selectedUsers.length} user(s) assigned to device successfully`)
            setSelectedUsers([])
            // Reset page to 0 and reload the users list to refresh the data
            setPage(0)
            await loadUsers(0, filters, rowsPerPage)
        } catch (error: unknown) {
            console.error('Error assigning users:', error)
            
            // Handle structured error responses
            if (error instanceof Error) {
                toast.error(error.message)
            } else if (error && typeof error === 'object' && 'message' in error) {
                toast.error(String(error.message))
            } else {
                toast.error('Failed to assign users to device')
            }
        } finally {
            setIsAssigning(false)
            setIsLoading(false)
        }
    }

    const handleChangePage = (newPage: number) => {
        setSelectedUsers([]) // Clear selections when changing page
        loadUsers(newPage, filters, rowsPerPage)
    }

    const handleChangeRowsPerPage = (newRowsPerPage: number) => {
        setSelectedUsers([]) // Clear selections when changing rows per page
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        loadUsers(0, filters, newRowsPerPage)
    }

    const handleLimitChange = (limit: number | 'all') => {
        setSelectedUsers([]) // Clear selections when changing limit
        const newLimit = limit === 'all' ? currentMeta.total : limit;
        setRowsPerPage(newLimit);
        setPage(0);
        loadUsers(0, filters, newLimit);
    }

    // Filter handlers
    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleApplyFilter = () => {
        setSelectedUsers([]) // Clear selections when applying filters
        loadUsers(0, filters, rowsPerPage)
    }

    const handleResetFilter = () => {
        setSelectedUsers([]) // Clear selections when resetting filters
        const resetFilters = {
            name: ''
        }
        setFilters(resetFilters)
        loadUsers(0, resetFilters, rowsPerPage)
    }

    // Load users on component mount
    useEffect(() => {
        loadUsers(page, filters, rowsPerPage)
    }, [loadUsers, page, filters, rowsPerPage])

    // Define table columns (MultiSelectViewTable adds select column automatically)
    const columns: TableColumn[] = [
        {key: 'id', label: 'ID', className: 'text-center hidden sm:table-cell'},
        {key: 'image', label: t('TableHeader.image'), className: 'text-center'},
        {key: 'first_name', label: t('TableHeader.firstName'), className: 'text-center'},
        {key: 'last_name', label: t('TableHeader.lastName'), className: 'text-center hidden md:table-cell'},
        {key: 'phone', label: t('TableHeader.phone'), className: 'text-center hidden lg:table-cell'},
        {key: 'role', label: t('TableHeader.role'), className: 'text-center hidden sm:table-cell'},
        {key: 'actions', label: 'Actions', className: 'text-center'},
    ]

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Filter Section */}
            <UsersOutDeviceFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilter={handleApplyFilter}
                onResetFilter={handleResetFilter}
                isLoading={isLoading}
            />
            
            {/* Bulk Actions Banner */}
            {canAssignUser && selectedUsers.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg shadow-sm gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-semibold text-primary">
                            {selectedUsers.length} {selectedUsers.length !== 1 ? tBulk('multipleUsersSelected') : tBulk('singleUserSelected')}
                        </span>
                    </div>
                    <Button
                        onClick={handleAssignSelectedUsers}
                        disabled={isAssigning}
                        size="sm"
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                    >
                        {isAssigning ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>{tBulk('adding')}</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-4 w-4" />
                                <span>{tBulk('addToDevice')} ({selectedUsers.length})</span>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Users Table */}
            <MultiSelectViewTable
                isLoading={isLoading}
                canCreate={false}
                columns={columns}
                total={currentMeta.total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showLimitSelector={true}
                onLimitChange={handleLimitChange}
                hasMultiSelect={true}
                selectedItems={selectedUsers}
                onSelectItem={handleSelectUser}
                onSelectAll={handleSelectAll}
                canMultiSelect={canAssignUser}
                selectAllData={{
                    itemCount: usersList?.length || 0,
                    selectedCount: selectedUsers.length
                }}
            >
                {usersList && usersList.length > 0 ? (
                    usersList.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell className="text-center w-12">
                                {canAssignUser && (
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        disabled={isAssigning}
                                    />
                                )}
                            </TableCell>
                            <TableCell className="text-center font-mono text-xs sm:text-sm hidden sm:table-cell">
                                {user.id}
                            </TableCell>
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
                            <TableCell className="text-center font-semibold text-sm sm:text-base hidden md:table-cell">
                                {user.last_name}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground text-xs sm:text-sm hidden lg:table-cell">
                                {user.phone}
                            </TableCell>
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
                                {canAssignUser && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAssignUser(user.id)}
                                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                                        title={tDevice('title')}
                                        disabled={isAssigning}
                                    >
                                        <UserPlus className="h-4 w-4 text-primary" />
                                    </Button>
                                )}
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
                                <p className="text-base sm:text-lg font-medium">{tDevice('noUsersAvailable')}</p>
                                <p className="text-xs sm:text-sm text-center max-w-xs">
                                    {tDevice('allUsersAssigned')} {deviceName || 'this device'}
                                </p>
                            </div>
                        </TableCell>
                    </TableRow>
                )}
            </MultiSelectViewTable>
        </div>
    );
}

export default UsersOutDevice
