'use client'
import React, { FC, useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { securitySchema, SecuritySchema } from '@/schemas/securitySchema'
import { Eye, EyeOff, X } from 'lucide-react'
import { RoleListItem } from '@/types/rolesTypes'
import { User } from '@/types/usersTypes'
import { setLoginPassword } from '@/app/[locale]/actions/(users)/setLoginPassword'

interface UserSecurityProps {
    roles?: RoleListItem[] | null
    user: User,
}

const UserSecurity: FC<UserSecurityProps> = ({ user, roles }) => {
    const t = useTranslations('LoginForm')
    const tDetail = useTranslations('Users.DetailPage')
    const tSecurity = useTranslations('Users.DetailPage.security')
    const locale = useLocale()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { control, handleSubmit, setValue } = useForm<SecuritySchema>({
        resolver: zodResolver(securitySchema(t)),
        defaultValues: {
            login: '',
            password: '',
            password_confirmation: '',
            can_login: false,
            role_id: 0,
        }
    })

    useEffect(() => {
        if (user) {
            setValue('login', user.login || '')
            setValue('can_login', user.can_login ?? false)
            if (user.includes?.role) {
                setValue('role_id', user.includes.role.id)
            }
        }
    }, [user, setValue])

    const onSubmit: SubmitHandler<SecuritySchema> = async (data) => {
        if (isSubmitting) return
        
        try {
            setIsSubmitting(true)
            
            // Prepare the request data
            const requestData = {
                login: data.login || '',
                can_login: data.can_login ?? true,
                role_id: data.role_id || 0,
                password: data.password && data.password.length > 0 ? data.password : undefined,
                password_confirmation: data.password_confirmation && data.password_confirmation.length > 0 ? data.password_confirmation : undefined
            }

            // Call the setLoginPassword action
            await setLoginPassword(requestData, user.id, locale)
            
            toast.success(tSecurity('messages.changesSaved'))
            
        } catch (error) {
            console.error('Security update error:', error)
            toast.error(tSecurity('messages.updateFailed'))
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>{tDetail('tabs.security')}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Login Permission Toggle */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">
                            {tSecurity('labels.loginPermission')}
                        </Label>
                        <Controller
                            name="can_login"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Login */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.login')}
                            </Label>
                            <Controller
                                name="login"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <Input
                                            {...field}
                                            placeholder={tSecurity('placeholders.login')}
                                            className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                        />
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.role')}
                            </Label>
                            <Controller
                                name="role_id"
                                control={control}
                                render={({ field, fieldState }) => {
                                    return (
                                    <>
                                        <Select
                                            key={`role-select-${roles?.length || 0}-${field.value}`}
                                            value={field.value && field.value > 0 ? String(field.value) : ""}
                                            onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
                                        >
                                            <SelectTrigger className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                                                <SelectValue placeholder={tSecurity('placeholders.role')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles && roles.length > 0 ? (
                                                    roles.map((role) => (
                                                        <SelectItem key={role.id} value={String(role.id)}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                        No roles available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && (
                                            <span className="text-destructive text-xs">{fieldState.error.message}</span>
                                        )}
                                    </>
                                    )
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.password')}
                            </Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showNewPassword ? 'text' : 'password'}
                                                placeholder={tSecurity('placeholders.password')}
                                                className={`h-11 pr-10 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showNewPassword ? (
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

                        {/* Password Confirmation */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.passwordConfirmation')}
                            </Label>
                            <Controller
                                name="password_confirmation"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder={tSecurity('placeholders.passwordConfirmation')}
                                                className={`h-11 pr-10 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? (
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

                    {/* Save Button */}
                    <div className="flex justify-start pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 px-6"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    {tSecurity('buttons.saving')}
                                </div>
                            ) : (
                                tSecurity('buttons.saveChanges')
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default UserSecurity
