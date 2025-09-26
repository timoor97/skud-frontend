'use client'
import {useUserModalStore} from '@/hooks/useModalStore'
import ViewModal from '@/components/ui/viewModal'
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CreateUserModalProps {}

const UserFormModal: FC<CreateUserModalProps> = () => {
    const {open, id, closeModal} = useUserModalStore()
    const locale = useLocale()
    const router = useRouter()
    const t = useTranslations('LoginForm')
    const tModal = useTranslations('Users.Modal')


    const [isSubmitting, setIsSubmitting] = useState(false);
    const {control, handleSubmit, setValue, reset, formState: {}} = useForm<UserSchema>({
        resolver: zodResolver(userSchema(t)),
        defaultValues: {
            first_name: '',
            last_name: '',
            phone: '',
            card_number: '',
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
                        setValue('card_number', data.card_number ? String(data.card_number) : '');
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
                card_number: data.card_number || null,
                status: data.status ?? true,  // Use switch value or default to true
                image: data.image || null
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
                    formData.append('card_number', String(submitData.card_number || ''))
                    formData.append('status', String(submitData.status || false))
                    
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
                    formData.append('card_number', String(submitData.card_number || ''))
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Image Upload - Centered */}
                    <div className="flex justify-center">
                        <div className="w-32">
                            <Controller
                                name="image"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <div className="relative">
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(file);
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={`w-32 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${fieldState.error ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary hover:bg-accent/30'}`}>
                                                {field.value ? (
                                                    <Image 
                                                        src={typeof field.value === 'string' 
                                                            ? (field.value.startsWith('http') ? field.value : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://skud-beckend.test'}/${field.value}`)
                                                            : URL.createObjectURL(field.value)} 
                                                        alt="Preview" 
                                                        width={120}
                                                        height={120}
                                                        className="w-full h-full rounded-2xl object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground text-center">Upload Photo</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-center mt-2">
                                            JPEG/PNG, max 1MB
                                        </div>
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs block text-center mt-1">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tModal('labels.firstName')} <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="first_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder={tModal('placeholders.firstName')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">{tModal('labels.lastName')}</Label>
                            <Controller
                                name="last_name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder={tModal('placeholders.lastName')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">{tModal('labels.phone')}</Label>
                            <Controller
                                name="phone"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder={tModal('placeholders.phone')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Card Number */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">{tModal('labels.cardNumber')}</Label>
                            <Controller
                                name="card_number"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder={tModal('placeholders.cardNumber')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>


                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">{tModal('labels.status')}</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        value={field.value ? 'true' : 'false'}
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                    >
                                        <SelectTrigger className="h-11 w-full">
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
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            {tModal('buttons.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    {id ? tModal('buttons.updating') : tModal('buttons.creating')}
                                </div>
                            ) : (
                                id ? tModal('buttons.update') : tModal('buttons.create')
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </ViewModal>
    )
}

export default UserFormModal
