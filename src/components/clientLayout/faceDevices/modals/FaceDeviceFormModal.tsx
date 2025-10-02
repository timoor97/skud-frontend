'use client'
import {useFaceDeviceModalStore} from '@/hooks/useModalStore'
import ViewModal from '@/components/ui/viewModal'
import {useLocale, useTranslations} from 'next-intl'
import React, {FC, useEffect, useState} from 'react'
import {Controller, SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from 'sonner'
import {getFaceDeviceById} from '@/app/[locale]/actions/(faceDevices)/getFaceDeviceById'
import {faceDeviceSchema} from '@/schemas/faceDeviceSchema'
import {z} from 'zod'

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import CustomLoading from "@/components/ui/customLoading"
import {Eye, EyeOff} from "lucide-react"

const FaceDeviceFormModal: FC = () => {

    const {open, id, closeModal,onSuccess} = useFaceDeviceModalStore()
    const locale = useLocale()
    const tModal = useTranslations('FaceDevices.Modal')

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {control, handleSubmit, setValue, reset} = useForm({
        resolver: zodResolver(faceDeviceSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            name: '',
            type: 'enter' as 'enter' | 'exit',
            status: 'active' as 'active' | 'not_active',
            ip: '',
            port: '',
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        const fetchFaceDeviceData = async () => {
            if (id) {
                setIsLoading(true);
                try {
                    const {data} = await getFaceDeviceById(locale, id)

                    // Set values after data is loaded
                    setValue('name', data.name || '');
                    setValue('type', data.type || 'enter');
                    setValue('status', data.status !== undefined ? data.status : 'active');
                    setValue('ip', data.ip || '');
                    setValue('port', data.port || '');
                    setValue('username', data.username || '');
                    setValue('password', data.password || '');
                } catch (error) {
                    console.error('Error loading face device data:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                reset()
            }
        }
        fetchFaceDeviceData()
    }, [id, setValue, reset, locale]);

    const handleCancel = () => {
        // Reset form to discard any changes
        reset()
        closeModal()
    }

    const onSubmit: SubmitHandler<z.infer<typeof faceDeviceSchema>> = async (data) => {
        if (isSubmitting) return; // Prevent multiple submissions
        
        try {
            setIsSubmitting(true);

            // Prepare data exactly like your backend format
            const submitData = {
                name: data.name,
                type: data.type,
                status: data.status,
                ip: data.ip,
                port: data.port,
                username: data.username,
                password: data.password
            }

            if (id) {
                // Edit mode - update existing face device
                try {
                    const res = await fetch(`/${locale}/api/faceDevices/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(submitData),
                        headers: {
                            'Accept-Language': 'uz',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.deviceUpdated'))
                        if (typeof onSuccess === 'function') {
                            onSuccess()
                        }
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
                                            toast.error(errorMsg)
                                    })
                                } else {
                                        toast.error(fieldErrors)
                                }
                            })
                        } else {
                            toast.error(errorData.message || 'Failed to update face device')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Update face device error:', error)
                    toast.error('Failed to update face device')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            } else {
                // Create mode - create new face device
                try {
                    const res = await fetch(`/${locale}/api/faceDevices`, {
                        method: 'POST',
                        body: JSON.stringify(submitData),
                        headers: {
                            'Accept-Language': 'uz',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    if (res.ok) {
                        toast.success(tModal('messages.deviceCreated'))
                        if (typeof onSuccess === 'function') {
                            onSuccess()
                        }
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
                                            toast.error(errorMsg)
                                    })
                                } else {
                                        toast.error(fieldErrors)
                                }
                            })
                        } else {
                            toast.error(errorData.message || 'Failed to create face device')
                        }
                        return // Don't close modal on error
                    }
                } catch (error) {
                    console.error('Create face device error:', error)
                    toast.error('Failed to create face device')
                    return // Don't close modal on error
                } finally {
                    setIsSubmitting(false)
                }
            }
        } catch (error) {
            console.error('Face device form error:', error)
            toast.error('An error occurred while saving the face device')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ViewModal
            open={open}
            handleClose={handleCancel}
            title={id ? tModal('titles.editDevice', {id}) : tModal('titles.createDevice')}
        >
            <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                    {id ? tModal('titles.editDevice', {id}) : tModal('titles.createDevice')}
                </div>

                {isLoading ? (
                    <CustomLoading />
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field - Full Width */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tModal('labels.name')} <span className="text-destructive">*</span>
                            </Label>
                            <Controller
                                name="name"
                                control={control}
                                render={({field, fieldState}) => (
                                    <>
                                        <Input
                                            {...field}
                                            value={String(field.value || '')}
                                            placeholder={tModal('placeholders.name')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Username and Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.username')} <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Input
                                                {...field}
                                                value={String(field.value || '')}
                                                placeholder={tModal('placeholders.username')}
                                                className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.password')} <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    value={String(field.value || '')}
                                                    placeholder={tModal('placeholders.password')}
                                                    className={`h-11 pr-10 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* IP and Port Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* IP Address Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.ip')} <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="ip"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Input
                                                {...field}
                                                value={String(field.value || '')}
                                                placeholder={tModal('placeholders.ip')}
                                                className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Port Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.port')} <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="port"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Input
                                                {...field}
                                                value={String(field.value || '')}
                                                placeholder={tModal('placeholders.port')}
                                                className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Type and Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Type Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.type')} <span className="text-destructive">*</span>
                                </Label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                                                    <SelectValue placeholder={tModal('placeholders.type')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="enter">{tModal('typeOptions.enter')}</SelectItem>
                                                    <SelectItem value="exit">{tModal('typeOptions.exit')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Status Field */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground">
                                    {tModal('labels.status')}
                                </Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                                                    <SelectValue placeholder={tModal('placeholders.status')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">{tModal('statusOptions.active')}</SelectItem>
                                                    <SelectItem value="not_active">{tModal('statusOptions.inactive')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && (
                                                <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                            )}
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Form Buttons */}
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
                )}
            </div>
        </ViewModal>
    )
}

export default FaceDeviceFormModal
