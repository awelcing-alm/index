import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Construction } from "lucide-react"

export default function BulkOpsPage() {
  return (
    <MainLayout>
      <div className="w-full">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Layers className="h-6 w-6" />
              Bulk Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Construction className="h-16 w-16 text-purple-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Coming Soon!</h2>
              <p className="text-gray-400 max-w-md">
                The Bulk Operations section is currently under development. This area will allow for managing multiple
                users, products, or settings at once.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
