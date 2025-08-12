import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";

export function DefaultTemplatesSection() {
  return (
    <>
      {DEFAULT_TEMPLATES.map((tpl) => (
        <Card key={tpl.name} className="rounded-none border border-line bg-paper">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-ink capitalize">{tpl.name}</h3>

                <Badge
                  variant="outline"
                  className="rounded-none border-line text-ink text-xs inline-flex items-center gap-1"
                  title="Default template"
                >
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  default
                </Badge>
              </div>

              {tpl.description ? (
                <p className="max-w-md truncate text-sm text-[hsl(var(--muted-foreground))]" title={tpl.description}>
                  {tpl.description}
                </p>
              ) : (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No description</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
