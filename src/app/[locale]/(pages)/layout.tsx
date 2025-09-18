import { FC } from "react"
import ClientLayout from "@/components/clientLayout";
import { currentUser } from "@/app/[locale]/actions/(users)/getCurrentUser";

interface LayoutProps {
  children: React.ReactNode,
  params: Promise<{
    locale: string
  }>
}
export const revalidate = 3600

const Layout: FC<LayoutProps> = async ({ children, params }) => {
  const { locale } = await params;
  
  // Fetch current user data on the server
  let user = null;
  try {
    user = await currentUser(locale);
  } catch (error) {
    console.error('Error fetching current user in layout:', error);
    // User will be null, which is fine for unauthenticated users
  }

  return (
      <ClientLayout user={user}>
        {children}
      </ClientLayout>
  )
}

export default Layout