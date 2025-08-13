// app/teams/page.tsx
import TeamManagerPage from "@/components/pages/team-manager-page"
import { MainLayout } from "@/components/main-layout"


export const metadata = {
  title: "Teams",
}

export default function TeamsPage() {
  // Server component wrapper ensures this page inherits app/layout.tsx
  return (
    <MainLayout>
      <TeamManagerPage accountId={""} />
    </MainLayout>
  )
}
