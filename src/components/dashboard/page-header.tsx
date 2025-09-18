import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { DynamicBreadcrumb } from './dynamic-breadcrumb'
import LanguageSwitcher from "@/components/dashboard/language-switcher";
import ThemeSwitcher from "@/components/dashboard/theme-switcher";

interface PageHeaderProps {
    title?: string
    description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <>
            {/* Main Navigation Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <DynamicBreadcrumb />
                </div>
                <div className="ml-auto flex items-center gap-2 px-4">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>
            </header>
            
            {/* Page Title Section */}
            {(title || description) && (
                <div className="flex flex-col gap-1 px-6 py-4 border-b bg-muted/30">
                    {title && <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>}
                    {description && <p className="text-muted-foreground text-sm">{description}</p>}
                </div>
            )}
        </>
    )
}
