"use client"

import * as React from "react"
import {
    IconInnerShadowTop,
} from "@tabler/icons-react"

import {
    LayoutDashboard,
    UserCircle,
    Monitor,
} from "lucide-react"

import { useTranslations } from 'next-intl'
import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User, ApiResponse } from "@/types/currentUserTypes"

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: ApiResponse<User> | null }) {
    const t = useTranslations('Sidebar')
    
    // Fallback function for translations
    const getTranslation = (key: string, fallback: string) => {
        try {
            return t(key) || fallback
        } catch {
            return fallback
        }
    }
    
    const data = {
        navMain: [
            {
                title: getTranslation('dashboard', 'Dashboard'),
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: getTranslation('rolePermissions', 'Role and Permissions'),
                url: "#",
                icon: UserCircle,
                isActive: false,
                items: [
                    {
                        title: getTranslation('roles', 'Roles'),
                        url: "/roles",
                    },
                    {
                        title: getTranslation('users', 'Users'),
                        url: "/users",
                    }
                ],
            },
            {
                title: getTranslation('reference', 'Devices'),
                url: "#",
                icon: Monitor,
                isActive: false,
                items: [
                    {
                        title: getTranslation('faceDevices', 'Face Devices'),
                        url: "/faceDevices",
                    }
                ],
            },
        ],
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">{getTranslation('companyName', 'Acme Inc.')}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
