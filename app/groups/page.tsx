// app/groups/page.tsx
import dynamic from "next/dynamic"
import { MainLayout } from "@/components/main-layout"


const GroupManagerPage = dynamic(() => import("@/components/pages/group-manager-page"), {
  ssr: false,
})

export default function GroupsPage() {
  return 
      <MainLayout>
<GroupManagerPage />
      </MainLayout>

}
