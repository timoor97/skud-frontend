import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { SectionCards } from "@/components/dashboard/section-cards"
import { PageHeader } from "@/components/dashboard/page-header"
import {FC} from "react";
import { getTranslations } from 'next-intl/server';


interface DashboardPageProps {
    params: Promise<{
        locale: string
    }>
}
const DashboardPage: FC<DashboardPageProps> = async () => {
    // const { locale } = await params
    const t = await getTranslations('PageHeader')
    
    return (
        <>
            <PageHeader
                title={t('defaultTitle')}
                description={t('defaultDescription')}
            />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DashboardPage
