'use client'

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { CurrentUser, ApiResponse } from "@/types/currentUserTypes"

export default function ClientLayout({
    children, currentUser, userActions,
}: {
    children: React.ReactNode
    currentUser: ApiResponse<CurrentUser> | null
    userActions: Array<{ action: string }> | null
}) {

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar currentUser={currentUser} userActions={userActions} />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
