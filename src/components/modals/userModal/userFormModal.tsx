'use client'
import {useUserModalStore} from '@/hooks/useModalStore'
import ViewModal from '@/components/modals/viewModal'
import {RoleListItem} from '@/types/rolesTypes'
import {useRouter} from "@/i18n/navigation";
import {useLocale, useTranslations} from 'next-intl'
import React, {FC, useEffect, useState} from 'react'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from 'sonner'
import Image from 'next/image'
import {getUserById} from '@/app/[locale]/actions/(users)/getUserById'
import {userSchema, UserSchema} from '@/schemas/userSchema'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CreateUserModalProps {
    roles: RoleListItem[];
}

const UserFormModal: FC<CreateUserModalProps> = ({roles}) => {
    const {open, id, closeModal} = useUserModalStore()
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations('LoginForm')
    const tModal = useTranslations('Users.Modal')


    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {control, handleSubmit, setValue, reset, formState: {}} = useForm<UserSchema>({
        resolver: zodResolver(userSchema(t)),
        defaultValues: {
            first_name: '',
            last_name: '',
            phone: '',
            role_id: '',
            login: '',
            password: '',
            status: true,
            image: null,
        }
    });



    useEffect(() => {
        const fetchUserData = async () => {
            if (id) {
                try {
                    const {data} = await getUserById(locale, id)

                    // Use setTimeout to ensure form is ready
                    setTimeout(() => {
                        setValue('first_name', data.first_name || '');
                        setValue('last_name', data.last_name || '');
                        setValue('phone', data.phone || '');
                        setValue('role_id', data.includes?.role?.id?.toString() || '');
                        setValue('login', data.login || '');
                        setValue('password', ''); // Always empty for edit mode
                        setValue('status', data.status ?? true);
                        setValue('image', data.image || null);
                    }, 100);
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else {
                reset()
            }
        }
        fetchUserData()
    }, [id, setValue, reset, locale, open, router,]);

    const handleCancel = () => {
        // Reset form to discard any changes
        reset()
        closeModal()
    }

    const onSubmit: SubmitHandler<UserSchema> = async (data) => {
        if (isSubmitting) return; // Prevent multiple submissions
        
        try {
            setIsSubmitting(true);
            // Prepare data exactly like your Postman format
            const submitData: Record<string, string | number | boolean | null | File> = {
                first_name: data.first_name,
                last_name: data.last_name || null,
                phone: data.phone || null,
                role_id: data.role_id ? parseInt(data.role_id) : null,
                login: data.login || null,
                status: data.status ?? true,  // Use switch value or default to true
                image: data.image || null
            }


            // Handle password field based on mode
            if (!id) {
                // For create mode, password is required
                if (data.password && data.password.trim() !== '') {
                    submitData.password = data.password
                } else {
                    toast.error(tModal('messages.passwordRequired'))
                    return
                }
            } else {
                // For edit mode, password is optional
                if (data.password && data.password.trim() !== '') {
                    submitData.password = data.password
                }
                // If password is empty, don't include it in the request
            }

            if (id) {
                // Edit mode - update existing user
                try {
                    // Create FormData for update
                    const formData = new FormData()
                    formData.append('_method', 'PUT')
                    formData.append('first_name', String(submitData.first_name || ''))
                    formData.append('last_name', String(submitData.last_name || ''))
                    formData.append('phone', String(submitData.phone || ''))
                    formData.append('role_id', String(submitData.role_id || 0))
                    formData.append('login', String(submitData.login || ''))
                    formData.append('status', String(submitData.status || false))
                    
                    // Only add password if it's not empty
                    if (submitData.password) {
                        formData.append('password', String(submitData.password))
                    }
                    
                    // Add image if provided
                    if (submitData.image) {
                        if (submitData.image instanceof File) {
                            formData.append('image', submitData.image);
                        } else {
                            formData.append('image', '');
                        }
                    }


                    const res = await fetch(`/${locale}/api/users/${id}`, {
                        method: 'POST', // Use POST for form-data
                        body: formData,
                        headers: {
                            'Accept-Language': locale || 'ru',
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.userUpdated'))
                        router.refresh()
                        closeModal()
                        reset()
                    } else {
                        const errorData = await res.json()
                        
                        // Handle validation errors specifically
                        if (res.status === 422 && errorData.errors) {
                            // Show specific field errors
                            Object.keys(errorData.errors).forEach(field => {
                                const fieldErrors = errorData.errors[field]
                                if (Array.isArray(fieldErrors)) {
                                    fieldErrors.forEach(errorMsg => {
                                        toast.error(errorMsg) // Show just the error message
                                    })
                                } else {
                                    toast.error(fieldErrors) // Show just the error message
                                }
                            })
                        } else {
                            toast.error(errorData.message || 'Failed to update user')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Update user error:', error)
                    toast.error('Failed to update user')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            } else {
                // Create mode - create new user
                try {
                    // Create FormData for create
                    const formData = new FormData()
                    formData.append('first_name', String(submitData.first_name || ''))
                    formData.append('last_name', String(submitData.last_name || ''))
                    formData.append('phone', String(submitData.phone || ''))
                    formData.append('role_id', String(submitData.role_id || 0))
                    formData.append('login', String(submitData.login || ''))
                    formData.append('password', String(submitData.password || ''))
                    formData.append('status', String(submitData.status || false))
                    
                    // Add image if provided
                    if (submitData.image) {
                        if (submitData.image instanceof File) {
                            formData.append('image', submitData.image);
                        } else {
                            formData.append('image', '');
                        }
                    }

                    const res = await fetch(`/${locale}/api/users`, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept-Language': locale || 'ru'
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.userCreated'))
                        router.refresh()
                        closeModal()
                        reset()
                    } else {
                        const errorData = await res.json()
                        
                        // Handle validation errors specifically
                        if (res.status === 422 && errorData.errors) {
                            // Show specific field errors
                            Object.keys(errorData.errors).forEach(field => {
                                const fieldErrors = errorData.errors[field]
                                if (Array.isArray(fieldErrors)) {
                                    fieldErrors.forEach(errorMsg => {
                                        toast.error(errorMsg) // Show just the error message
                                    })
                                } else {
                                    toast.error(fieldErrors) // Show just the error message
                                }
                            })
                        } else {
                            toast.error(errorData.message || 'Failed to create user')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Create user error:', error)
                    toast.error('Failed to create user')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            }
        } catch (error) {
            console.error('User form error:', error)
            toast.error('An error occurred while saving the user')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ViewModal
            open={open}
            handleClose={handleCancel}
            title={id ? tModal('messages.editUser', { id }) : tModal('messages.createUser')}
        >
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    {id ? tModal('messages.editUser', {id}) : tModal('messages.createUser')}
                </div>

                {/* User form */}
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    {/* First row: First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">
                                {tModal('labels.firstName')} <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="first_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder={tModal('placeholders.firstName')}
                                            className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">{tModal('labels.lastName')}</label>
                            <Controller
                                name="last_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder={tModal('placeholders.lastName')}
                                            className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Second row: Role and Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">
                                {tModal('labels.role')} <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="role_id"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger
                                                className={`w-full ${fieldState.error ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder={tModal('placeholders.selectRole')}/>
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {roles.map((roleItem) => (
                                                    <SelectItem key={roleItem.id} value={roleItem.id.toString()}>
                                                        {roleItem.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">{tModal('labels.phone')}</label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder={tModal('placeholders.phone')}
                                            className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Third row: Login and Password */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">
                                {tModal('labels.login')} <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="login"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <input
                                            {...field}
                                            placeholder={tModal('placeholders.login')}
                                            className={`px-3 py-2 border rounded-md ${fieldState.error ? 'border-red-500' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {!id ? (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    {tModal('labels.password')} <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <div className="relative">
                                                <input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder={tModal('placeholders.password')}
                                                    className={`px-3 py-2 border rounded-md w-full pr-10 ${fieldState.error ? 'border-red-500' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                            {fieldState.error && (
                                                <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    {tModal('labels.password')}
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <div className="relative">
                                                <input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder={tModal('placeholders.password')}
                                                    className={`px-3 py-2 border rounded-md w-full pr-10 ${fieldState.error ? 'border-red-500' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                            {fieldState.error && (
                                                <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Fourth row: Status and Image */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">{tModal('labels.status')}</label>
                            <Controller
                                name="status"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        value={field.value ? 'true' : 'false'}
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={tModal('status.selectPlaceholder')}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">{tModal('status.active')}</SelectItem>
                                            <SelectItem value="false">{tModal('status.inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">{tModal('labels.image')}</label>
                            <Controller
                                name="image"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <div className="grid w-full items-center gap-2">
                                            <div className="relative">
                                                <input
                                                    id="image"
                                                    type="file"
                                                    accept="image/jpeg,image/png"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        field.onChange(file);
                                                    }}
                                                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${fieldState.error ? 'border-red-500' : ''}`}
                                                />
                                                <div className={`px-3 py-2 border rounded-md text-sm text-left cursor-pointer hover:bg-gray-50 ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}>
                                                    {field.value ? (
                                                        <span className="text-gray-700">
                                                            {typeof field.value === 'string' ? field.value.split('/').pop() : field.value.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">{tModal('placeholders.noFileChosen')}</span>
                                                    )}
                                                </div>
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                                    {tModal('placeholders.chooseFile')}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                JPEG/PNG, max 1MB
                                            </div>
                                            {field.value && (
                                                <div className="mt-1">
                                                    <Image 
                                                        src={typeof field.value === 'string' 
                                                            ? (field.value.startsWith('http') ? field.value : `${process.env.NEXT_PUBLIC_BASE_URL}/${field.value}`)
                                                            : URL.createObjectURL(field.value)} 
                                                        alt="Preview" 
                                                        width={48}
                                                        height={48}
                                                        className="w-12 h-12 rounded-full object-cover border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {fieldState.error && (
                                            <span className="text-red-500 text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </form>

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
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium transition-colors"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {id ? tModal('buttons.updating') : tModal('buttons.creating')}
                            </div>
                        ) : (
                            id ? tModal('buttons.update') : tModal('buttons.create')
                        )}
                    </button>
                </div>
            </div>
        </ViewModal>
    )
}

export default UserFormModal
