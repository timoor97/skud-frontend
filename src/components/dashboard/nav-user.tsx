"use client"

import {
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"
import {toast} from 'sonner'
import {useRouter} from "@/i18n/navigation";
import {useLocale, useTranslations} from 'next-intl'
import {User, ApiResponse} from '@/types/currentUserTypes'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({ user }: { user: ApiResponse<User> | null }) {
    const {isMobile} = useSidebar()
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('NavUser')

    const handleLogOut = async () => {
        try {
            const res = await fetch(`/${locale}/api/logout`, {
                method: 'GET',
                headers: {
                    'Accept-Language': locale,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (res.ok) {
                const responseData = await res.json()
                toast.success(responseData.message || t('messages.logoutSuccess'))
                // Redirect to login page while preserving the current locale
                router.replace('/login')
            } else {
                toast.error(t('errors.logoutFailed'))
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error(t('errors.generalError'))
        }
    }


    if (!user) {
        return null
    }

    // Extract user data from the ApiResponse structure
    const userData = user.data
    const userInitials = userData.first_name?.[0]?.toUpperCase() || t('defaults.userInitial')
    const userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || t('defaults.userName')
    const userPhone = userData.phone || t('defaults.noPhone')

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={userData.image ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://skud-beckend.test'}/${userData.image}` : ""}
                                    alt={userName}
                                />
                                <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{userName}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {userPhone}
                                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage 
                                        src={userData.image ? `${process.env.NEXT_PUBLIC_BASE_URL || 'http://skud-beckend.test'}/${userData.image}` : ""} 
                                        alt={userName}
                                    />
                                    <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{userName}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {userPhone}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <IconUserCircle/>
                                {t('menu.account')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <IconNotification/>
                                {t('menu.notifications')}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <IconLogout/>
                            <button
                                onClick={handleLogOut}
                                type="submit">{t('menu.logout')}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

