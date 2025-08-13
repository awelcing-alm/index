// app/groups/page.tsx
import GroupManagerPage from "@/components/pages/group-manager-page"
import { MainLayout } from "@/components/main-layout"

export default function GroupsPage() {
  return (
    <MainLayout>
      <GroupManagerPage />
    </MainLayout>
  )
}