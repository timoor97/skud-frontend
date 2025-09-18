'use client'

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { User, ApiResponse } from "@/types/currentUserTypes"

export default function ClientLayout({
    children,
    user,
}: {
    children: React.ReactNode
    user: ApiResponse<User> | null
}) {

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar user={user} />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
