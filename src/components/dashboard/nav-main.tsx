"use client"

import {ChevronRight, type LucideIcon} from "lucide-react"
import {Link, usePathname} from "@/i18n/navigation";
import {useEffect, useState} from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"


export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)
    
    // Ensure we're on the client side to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true)
    }, [])
    
    // Helper function to check if a path is active
    const isActivePath = (url: string) => {
        if (!isClient) return false // Return false during SSR to prevent hydration mismatch
        if (url === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname.startsWith(url)
    }
    
    // Helper function to check if any sub-item is active
    const hasActiveSubItem = (subItems: { title: string; url: string }[]) => {
        if (!isClient) return false // Return false during SSR to prevent hydration mismatch
        return subItems.some(subItem => isActivePath(subItem.url))
    }
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isItemActive = isActivePath(item.url)
                        const hasActiveSubItems = item.items ? hasActiveSubItem(item.items) : false
                        // Only use client-side active state for collapsible opening, fallback to item.isActive for SSR
                        const shouldOpenCollapsible = isClient ? (item.isActive || hasActiveSubItems) : item.isActive
                        
                        // Check if item has sub-items to determine if it should be collapsible
                        return item.items && item.items.length > 0 ? (
                            // Collapsible item (like Role and Permissions)
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={shouldOpenCollapsible}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton 
                                            tooltip={item.title}
                                            isActive={hasActiveSubItems}
                                        >
                                            {item.icon && <item.icon/>}
                                            <span>{item.title}</span>
                                            <ChevronRight
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem) => {
                                                const isSubItemActive = isActivePath(subItem.url)
                                                return (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                                                            <Link href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ) : (
                            // Simple item (like Dashboard)
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title} asChild isActive={isItemActive}>
                                    <Link href={item.url}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}