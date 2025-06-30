import {  Card, CardContent } from "@/components/ui/card"
import {  Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react";
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";

export function DefaultTemplatesSection() {
  return (
    <>
      {DEFAULT_TEMPLATES.map((tpl) => (
        <Card key={tpl.name} className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg text-white capitalize">{tpl.name}</h3>
                <Badge className="bg-purple-600/30 text-purple-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  default
                </Badge>
              </div>
              <p
                className="text-sm text-gray-400 max-w-md truncate"
                title={tpl.description}
              >
                {tpl.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
