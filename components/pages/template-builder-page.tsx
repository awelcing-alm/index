import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const alerts = [
  { id: "legal-updates", title: "Legal Updates", subtitle: "alert" },
  { id: "court-rulings", title: "Court Rulings", subtitle: "Employment Law" },
  { id: "employment-review", title: "Employment Law Review", subtitle: "newsletter" },
  { id: "regulatory-compliance", title: "Regulatory Compliance", subtitle: "alert" },
]

export function TemplateBuilderPage() {
  return (
    <div className="grid gap-8 h-full">
      <div>
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 shadow-[0_0_15px_rgba(128,0,128,0.5)]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Template Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Template name..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save</Button>
            </div>
            <Tabs defaultValue="alerts" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-white/10 rounded-none p-0">
                <TabsTrigger
                  value="alerts"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
                >
                  Alerts
                </TabsTrigger>
                <TabsTrigger
                  value="newsletters"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
                >
                  Newsletters
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white data-[state=active]:shadow-none text-gray-300"
                >
                  Preferences
                </TabsTrigger>
              </TabsList>
              <TabsContent value="alerts" className="mt-6 space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <Label htmlFor={alert.id} className="text-lg font-medium text-white">
                        {alert.title}
                      </Label>
                      <p className="text-sm text-gray-400">{alert.subtitle}</p>
                    </div>
                    <Switch id={alert.id} className="data-[state=checked]:bg-purple-600" />
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
