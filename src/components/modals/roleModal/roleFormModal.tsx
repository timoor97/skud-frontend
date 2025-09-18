'use client'
import {useRoleModalStore} from '@/hooks/useModalStore'
import ViewModal from '@/components/modals/viewModal'
import {useRouter} from "@/i18n/navigation";
import {useLocale, useTranslations} from 'next-intl'
import React, {FC, useEffect, useState} from 'react'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from 'sonner'
import {getRoleById} from '@/app/[locale]/actions/(roles)/getRoleById'
import {roleSchema} from '@/schemas/roleSchema'
import {z} from 'zod'
import {PermissionListItem} from '@/types/permissionsTypes'

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import TranslatableTabs from "@/components/ui/translatable-tabs"

interface CreateRoleModalProps {
    permissions: PermissionListItem[];
}

const RoleFormModal: FC<CreateRoleModalProps> = ({permissions}) => {

    const {open, id, closeModal} = useRoleModalStore()
    const locale = useLocale()
    const router = useRouter()
    const tModal = useTranslations('Roles.Modal')

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {control, handleSubmit, setValue, reset} = useForm({
        resolver: zodResolver(roleSchema(tModal)),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            name: {
                uz: '',
                ru: '',
                en: ''
            },
            description: {
                uz: '',
                ru: '',
                en: ''
            },
            permissions: [],
            key: ''
        }
    });

    useEffect(() => {
        const fetchRoleData = async () => {
            if (id) {
                try {
                    const {data} = await getRoleById(locale, id)

                    // Use setTimeout to ensure form is ready
                    setTimeout(() => {
                        setValue('name.uz', data.name?.uz || '');
                        setValue('name.ru', data.name?.ru || '');
                        setValue('name.en', data.name?.en || '');
                        setValue('description.uz', data.description?.uz || '');
                        setValue('description.ru', data.description?.ru || '');
                        setValue('description.en', data.description?.en || '');
                        // Convert permissions to simple array of IDs
                        const permissionIds = data.permissions ? data.permissions.map((perm: number | { id?: number; permission_id?: number; name?: string }) => 
                            typeof perm === 'number' ? perm : perm.id || perm.permission_id || 0
                        ) : [];
                        setValue('permissions', permissionIds);
                        setValue('key', data.key || '');
                    }, 100);
                } catch (error) {
                    console.error('Error loading role data:', error);
                }
            } else {
                reset()
            }
        }
        fetchRoleData()
    }, [id, setValue, reset, locale, open, router]);

    const handleCancel = () => {
        // Reset form to discard any changes
        reset()
        closeModal()
    }

    const onSubmit: SubmitHandler<z.infer<ReturnType<typeof roleSchema>>> = async (data) => {
        if (isSubmitting) return; // Prevent multiple submissions
        
        try {
            setIsSubmitting(true);

            // Prepare data exactly like your backend format
            const submitData = {
                name: data.name,
                description: data.description,
                permissions: data.permissions || [],
                key: data.key
            }

            if (id) {
                // Edit mode - update existing role
                try {
                    const res = await fetch(`/${locale}/api/roles/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(submitData),
                        headers: {
                            'Accept-Language': locale || 'ru',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.roleUpdated'))
                        router.refresh()
                        closeModal()
                        reset()
                    } else {
                        const errorData = await res.json()
                        
                        // Handle validation errors specifically
                        if (res.status === 422 && errorData.errors) {
                            // Check for key uniqueness error specifically
                            if (errorData.errors.key && errorData.errors.key.includes('already exists')) {
                                toast.error(tModal('errors.keyExists'))
                            } else {
                            // Show specific field errors
                            Object.keys(errorData.errors).forEach(field => {
                                const fieldErrors = errorData.errors[field]
                                if (Array.isArray(fieldErrors)) {
                                    fieldErrors.forEach(errorMsg => {
                                            toast.error(errorMsg)
                                    })
                                } else {
                                        toast.error(fieldErrors)
                                }
                            })
                            }
                        } else if (res.status === 409) {
                            // Handle conflict errors (like duplicate key)
                            toast.error(tModal('errors.keyExists'))
                        } else {
                            toast.error(errorData.message || 'Failed to update role')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Update role error:', error)
                    toast.error('Failed to update role')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            } else {
                // Create mode - create new role
                try {
                    const res = await fetch(`/${locale}/api/roles`, {
                        method: 'POST',
                        body: JSON.stringify(submitData),
                        headers: {
                            'Accept-Language': locale || 'ru',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.roleCreated'))
                        router.refresh()
                        closeModal()
                        reset()
                    } else {
                        const errorData = await res.json()
                        
                        // Handle validation errors specifically
                        if (res.status === 422 && errorData.errors) {
                            // Check for key uniqueness error specifically
                            if (errorData.errors.key && errorData.errors.key.includes('already exists')) {
                                toast.error(tModal('errors.keyExists'))
                            } else {
                            // Show specific field errors
                            Object.keys(errorData.errors).forEach(field => {
                                const fieldErrors = errorData.errors[field]
                                if (Array.isArray(fieldErrors)) {
                                    fieldErrors.forEach(errorMsg => {
                                            toast.error(errorMsg)
                                    })
                                } else {
                                        toast.error(fieldErrors)
                                }
                            })
                            }
                        } else if (res.status === 409) {
                            // Handle conflict errors (like duplicate key)
                            toast.error(tModal('errors.keyExists'))
                        } else {
                            toast.error(errorData.message || 'Failed to create role')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Create role error:', error)
                    toast.error('Failed to create role')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            }
        } catch (error) {
            console.error('Role form error:', error)
            toast.error('An error occurred while saving the role')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ViewModal
            open={open}
            handleClose={handleCancel}
            title={id ? tModal('messages.editRole', {id}) : tModal('messages.createRole')}
        >
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    {id ? tModal('messages.editRole', {id}) : tModal('messages.createRole')}
                </div>

                {/* Language Tabs at the top */}
                <TranslatableTabs>
                    {(locale) => (
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            {/* Role Name Field */}
                        <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    {tModal('labels.name')} <span className="text-red-500">*</span>
                                </Label>
                            <Controller
                                    name={`name.${locale}` as 'name.uz' | 'name.ru' | 'name.en'}
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                            <Input
                                            {...field}
                                                value={String(field.value || '')}
                                                placeholder={tModal(`placeholders.name${locale.charAt(0).toUpperCase() + locale.slice(1)}`)}
                                            className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                            {/* Key Field */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    {tModal('labels.key')} <span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                    name="key"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Input
                                                    {...field}
                                                placeholder={tModal('placeholders.key')}
                                                className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Permissions Field */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    {tModal('labels.permissions')}
                                </Label>
                                <div className="space-y-4 max-h-60 overflow-y-auto border rounded-md p-4">
                                    {permissions.map((model) => (
                                        <div key={model.id} className="space-y-2">
                                            <Controller
                                                name="permissions"
                                                control={control}
                                                render={({field}) => {
                                                    const currentPermissionIds = field.value || [];
                                                    const modelPermissionIds = model.permissions.map(p => p.id);
                                                    
                                                    // Check which model permissions are selected
                                                    const selectedModelPermissions = modelPermissionIds.filter(id => 
                                                        currentPermissionIds.includes(id)
                                                    );

                                                    const isAllSelected = modelPermissionIds.length > 0 && selectedModelPermissions.length === modelPermissionIds.length;
                                                    const isIndeterminate = selectedModelPermissions.length > 0 && selectedModelPermissions.length < modelPermissionIds.length;

                                                    return (
                                                        <>
                                                            <label
                                                                className="flex items-center space-x-2 text-sm font-medium text-gray-700 border-b pb-1 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAllSelected}
                                                                    ref={(el) => {
                                                                        if (el) el.indeterminate = isIndeterminate;
                                                                    }}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            // Select all permissions in this model
                                                                            const otherPermissionIds = currentPermissionIds.filter(id =>
                                                                                !modelPermissionIds.includes(id)
                                                                            );
                                                                            field.onChange([...otherPermissionIds, ...modelPermissionIds]);
                                                                        } else {
                                                                            // Deselect all permissions in this model
                                                                            const remainingPermissionIds = currentPermissionIds.filter(id =>
                                                                                !modelPermissionIds.includes(id)
                                                                            );
                                                                            field.onChange(remainingPermissionIds);
                                                                        }
                                                                    }}
                                                                    className="rounded border-gray-300"
                                                                />
                                                                <span>{model.name}</span>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2 ml-4">
                                                                {model.permissions.map((permission) => {
                                                                    const isChecked = currentPermissionIds.includes(permission.id);

                                                                    return (
                                                                        <label key={permission.id}
                                                                               className="flex items-center space-x-2 text-sm">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isChecked}
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        field.onChange([...currentPermissionIds, permission.id]);
                                                                                    } else {
                                                                                        field.onChange(currentPermissionIds.filter(id => id !== permission.id));
                                                                                    }
                                                                                }}
                                                                                className="rounded border-gray-300"
                                                                            />
                                                                            <span>{permission.name}</span>
                                </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium">
                                    {tModal('labels.description')}
                                </Label>
                                <Controller
                                    name={`description.${locale}` as 'description.uz' | 'description.ru' | 'description.en'}
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <textarea
                                                    {...field}
                                                value={String(field.value || '')}
                                                placeholder={tModal(`placeholders.description${locale.charAt(0).toUpperCase() + locale.slice(1)}`)}
                                                className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                                rows={3}
                                            />
                                            {fieldState.error && (
                                                <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                    </div>

                            {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors"
                    >
                        {tModal('buttons.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {id ? tModal('buttons.updating') : tModal('buttons.creating')}
                            </div>
                        ) : (
                            id ? tModal('buttons.update') : tModal('buttons.create')
                        )}
                    </button>
                </div>
                        </form>
                    )}
                </TranslatableTabs>
            </div>
        </ViewModal>
    )
}

export default RoleFormModal