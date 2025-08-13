// app/teams/page.tsx
import UsersPage from "@/components/pages/users-page"
import { MainLayout } from "@/components/main-layout"


export const metadata = {
  title: "Users",
}

export default function TeamsPage() {
  // Server component wrapper ensures this page inherits app/layout.tsx
  return (
    <MainLayout>
      <UsersPage />
    </MainLayout>
  )
}
