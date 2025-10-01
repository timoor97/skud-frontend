'use client'
import React, { FC, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { changePasswordSchema, ChangePasswordSchema } from '@/schemas/changePasswordSchema'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { User } from '@/types/usersTypes'
import { changePassword } from '@/app/[locale]/actions/(users)/changePassword'

interface ChangePasswordProps {
    user: User,
}

const ChangePassword: FC<ChangePasswordProps> = ({ user }) => {
    const t = useTranslations('LoginForm')
    const tSecurity = useTranslations('Users.DetailPage.security')
    const locale = useLocale()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { control, handleSubmit, setValue } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema(t)),
        defaultValues: {
            password: '',
            password_confirmation: '',
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordSchema> = async (data) => {
        if (isSubmitting) return
        
        try {
            setIsSubmitting(true)
            
            // Prepare the request data
            const requestData = {
                password: data.password,
                password_confirmation: data.password_confirmation
            }

            // Call the changePassword action
            await changePassword(requestData, user.id, locale)
            
            toast.success(tSecurity('messages.passwordChanged'))
            
            // Reset password fields after successful submission
            setValue('password', '')
            setValue('password_confirmation', '')
            
        } catch (error) {
            console.error('Change password error:', error)
            toast.error(tSecurity('messages.updateFailed'))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {tSecurity('titles.changePassword')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Current Username */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.currentUsername')}
                            </Label>
                            <Input
                                value={user.login || ''}
                                disabled
                                className="h-11 bg-muted"
                            />
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.newPassword')}
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
                                                placeholder={tSecurity('placeholders.newPassword')}
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

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">
                                {tSecurity('labels.confirmNewPassword')}
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
                                                placeholder={tSecurity('placeholders.confirmNewPassword')}
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
                                tSecurity('buttons.changePassword')
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ChangePassword
