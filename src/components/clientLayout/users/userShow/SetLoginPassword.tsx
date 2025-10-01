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
import { MultiSelect, Option } from '@/components/ui/multi-select'
import { securitySchema, SecuritySchema } from '@/schemas/securitySchema'
import { Eye, EyeOff, Key } from 'lucide-react'
import { RoleListItem } from '@/types/rolesTypes'
import { User } from '@/types/usersTypes'
import { setLoginPassword } from '@/app/[locale]/actions/(users)/setLoginPassword'

interface SetLoginPasswordProps {
    roles?: RoleListItem[] | null
    user: User
}

const SetLoginPassword: FC<SetLoginPasswordProps> = ({ user, roles }) => {
    const t = useTranslations('LoginForm')
    const tSecurity = useTranslations('Users.DetailPage.security')
    const locale = useLocale()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { control, handleSubmit, setValue } = useForm<SecuritySchema>({
        resolver: zodResolver(securitySchema(t)),
        defaultValues: {
            login: '',
            password: '',
            password_confirmation: '',
            can_login: false,
            role_ids: [],
        }
    })

    useEffect(() => {
        if (user) {
            setValue('login', user.login || '')
            setValue('can_login', user.can_login ?? false)
            if (user.includes?.roles) {
                const roleIds = user.includes.roles.map(role => role.id)
                setValue('role_ids', roleIds)
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
                role_ids: data.role_ids || [],
                password: data.password && data.password.length > 0 ? data.password : undefined,
                password_confirmation: data.password_confirmation && data.password_confirmation.length > 0 ? data.password_confirmation : undefined
            }

            // Call the setLoginPassword action
            await setLoginPassword(requestData, user.id, locale)
            
            toast.success(tSecurity('messages.loginPasswordSet'))
            
            // Reset password fields after successful submission
            setValue('password', '')
            setValue('password_confirmation', '')
            
        } catch (error) {
            console.error('Set login password error:', error)
            toast.error(tSecurity('messages.updateFailed'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    {tSecurity('titles.setLoginPassword')}
                </CardTitle>
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

                        {/* Roles */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.roles')}
                            </Label>
                            <Controller
                                name="role_ids"
                                control={control}
                                render={({ field, fieldState }) => {
                                    const roleOptions: Option[] = roles ? roles.map(role => ({
                                        label: role.name,
                                        value: role.id.toString()
                                    })) : []
                                    
                                    return (
                                    <>
                                        <MultiSelect
                                            options={roleOptions}
                                            selected={field.value ? field.value.map(id => id.toString()) : []}
                                            onChange={(selected) => field.onChange(selected.map(id => parseInt(id)))}
                                            placeholder={tSecurity('placeholders.roles')}
                                            className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            maxCount={2}
                                            emptyText={tSecurity('messages.noRoles')}
                                        />
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
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={tSecurity('placeholders.password')}
                                                className={`h-11 pr-10 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                                tSecurity('buttons.setLoginPassword')
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default SetLoginPassword
