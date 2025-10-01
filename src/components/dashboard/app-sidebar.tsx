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
import { CurrentUser, ApiResponse } from "@/types/currentUserTypes"
import usePermissions from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/constants/permissions'

export function AppSidebar({ currentUser, userActions, ...props }: React.ComponentProps<typeof Sidebar> & { 
    currentUser: ApiResponse<CurrentUser> | null
    userActions: Array<{ action: string }> | null
}) {
    const t = useTranslations('Sidebar')
    
    // Initialize permissions hook
    const { hasPermission } = usePermissions(
        userActions || [], 
        currentUser?.data?.includes?.role?.name || ''
    )
    
    // Check permissions for menu items
    const canViewUsers = hasPermission(PERMISSIONS.VIEW_USERS)
    const canViewRoles = hasPermission(PERMISSIONS.VIEW_ROLES)
    const canViewFaceDevices = hasPermission(PERMISSIONS.VIEW_FACE_DEVICES)
    
    // Fallback function for translations
    const getTranslation = (key: string, fallback: string) => {
        try {
            return t(key) || fallback
        } catch {
            return fallback
        }
    }
    
    // Build navigation items based on permissions
    const navMain: Array<{
        title: string
        url: string
        icon?: any
        isActive?: boolean
        items?: Array<{
            title: string
            url: string
        }>
    }> = [
        {
            title: getTranslation('dashboard', 'Dashboard'),
            url: "/dashboard",
            icon: LayoutDashboard,
        }
    ]

    // Add Role and Permissions section if user has access to roles or users
    if (canViewRoles || canViewUsers) {
        const rolePermissionsItems = []
        
        if (canViewRoles) {
            rolePermissionsItems.push({
                title: getTranslation('roles', 'Roles'),
                url: "/roles",
            })
        }
        
        if (canViewUsers) {
            rolePermissionsItems.push({
                title: getTranslation('users', 'Users'),
                url: "/users",
            })
        }

        if (rolePermissionsItems.length > 0) {
            navMain.push({
                title: getTranslation('rolePermissions', 'Role and Permissions'),
                url: "#",
                icon: UserCircle,
                items: rolePermissionsItems,
            })
        }
    }

    // Add Devices section if user has access to face devices
    if (canViewFaceDevices) {
        navMain.push({
            title: getTranslation('reference', 'Devices'),
            url: "#",
            icon: Monitor,
            items: [
                {
                    title: getTranslation('faceDevices', 'Face Devices'),
                    url: "/faceDevices",
                }
            ],
        })
    }

    const data = {
        navMain
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
                <NavUser currentUser={currentUser} />
            </SidebarFooter>
        </Sidebar>
    )
}
