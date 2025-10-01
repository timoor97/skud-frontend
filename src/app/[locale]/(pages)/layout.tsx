import { FC } from "react"
import ClientLayout from "@/components/clientLayout";
import { currentUser, currentUserPermissionsActions } from "@/app/[locale]/actions/(users)/getCurrentUser";

interface LayoutProps {
  children: React.ReactNode,
  params: Promise<{
    locale: string
  }>
}
export const revalidate = 3600

const Layout: FC<LayoutProps> = async ({ children, params }) => {
  const { locale } = await params;
  
  // Fetch current user data and permissions on the server
  let currentUserData = null;
  let userActions = null;
  try {
      currentUserData = await currentUser(locale);
      userActions = await currentUserPermissionsActions(locale);
  } catch (error) {
    console.error('Error fetching current user in layout:', error);
    // User will be null, which is fine for unauthenticated users
  }

  return (
      <ClientLayout currentUser={currentUserData} userActions={userActions}>
        {children}
      </ClientLayout>
  )
}

export default Layout