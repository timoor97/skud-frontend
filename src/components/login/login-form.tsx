'use client'

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {useLocale, useTranslations} from 'next-intl'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useRouter} from "@/i18n/navigation";
import axios from 'axios'
import {loginSchema, LoginSchema} from '@/schemas/loginSchema'
import React, {useState} from 'react'
import {toast} from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import CustomLoading from "@/components/ui/customLoading";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {

    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('LoginForm');

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema(t)),
        mode: 'onChange',
        defaultValues: {
            login: '',
            password: ''
        }
    })

    const router = useRouter()

    const locale = useLocale()
    const onSubmit = async (data: LoginSchema) => {
        try {
            setIsLoading(true);

            const res = await axios.post(`/${locale}/api/login`, data, {
                headers: {
                    'Accept-Language': locale,
                },
            })

            if (res.status === 200) {
                // Show success toast with backend message if available
                const successMessage = res.data?.message;
                toast.success(successMessage);
                
                // Success - redirect to dashboard
                router.replace('/dashboard')
            }
        } catch (error) {
            // Handle different error responses from backend
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                if (axiosError.response && axiosError.response.data) {
                    const backendMessage = axiosError.response.data.message;
                    // Show error toast with backend message
                    toast.error(backendMessage);
                } else {
                    // Network or other errors
                    toast.error(t('errors.connectionError'));
                }
            } else {
                // Network or other errors
                toast.error(t('errors.connectionError'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return  <CustomLoading/>
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t('title')}</CardTitle>
                    <CardDescription>
                        {t('description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-3">

                                        <FormField
                                            control={form.control}
                                            name="login"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{t('labels.login')}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="login"
                                                            type="text"
                                                            placeholder={t('placeholders.login')}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{t('labels.password')}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        placeholder={t('placeholders.password')}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                {form.formState.errors.root && (
                                    <div className="text-red-500 text-sm text-center">
                                        {form.formState.errors.root.message}
                                    </div>
                                )}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {t('buttons.login')}
                                </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
