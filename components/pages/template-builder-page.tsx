"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Save,
  Trash2,
  Copy,
  Sparkles,
  CheckCircle,
} from "lucide-react"
import { NEWSLETTER_KEYS } from "@/lib/newsletters"
import { getActiveAccountId } from "@/lib/account-api"
import { DefaultTemplatesSection } from "@/components/pages/default-templates-section"

/* ---------------- types ---------------- */
interface Template {
  name: string
  description: string
  attributes: Record<string, boolean>
  overwriteFalse: boolean
  createdAt: string
  updatedAt?: string
}

/* -------------- util fetchers -------------- */
const apiGetNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json()

const apiGetTpl = async (name: string): Promise<Template | null> => {
  try {
    const res = await fetch(`/api/templates/${name}`)
    if (!res.ok) return null
    return (await res.json()) as Template
  } catch {
    return null
  }
}

const apiSaveTpl = (tpl: Template, exists: boolean) =>
  fetch(`/api/templates${exists ? `/${tpl.name}` : ""}`, {
    method: exists ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  })

const apiDeleteTpl = (name: string) =>
  fetch(`/api/templates/${name}`, { method: "DELETE" })

const emptyTpl = (): Template => ({
  name: "",
  description: "",
  attributes: {},
  overwriteFalse: true,
  createdAt: "",
})

export default function TemplateBuilderPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [current, setCurrent] = useState<Template>(emptyTpl())
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState<"create" | "manage">("create")
  const [saved, setSaved] = useState<string>("")
  const accId = getActiveAccountId()

  useEffect(() => {
    if (!accId) return
    ;(async () => {
      try {
        const names = await apiGetNames()
        const fetched = await Promise.all(names.map(apiGetTpl))
        const customs = fetched.filter(Boolean) as Template[]
        setTemplates(customs.sort((a, b) => a.name.localeCompare(b.name)))
      } catch (err) {
        console.error(err)
        setTemplates([])
      }
    })()
  }, [accId])

  const buildAttributePayload = (): Record<string, boolean> => {
    if (!current.overwriteFalse) {
      return { ...current.attributes }
    }
    const full: Record<string, boolean> = {}
    NEWSLETTER_KEYS.forEach((slug) => {
      full[slug] = current.attributes[slug] || false
    })
    return full
  }

  const saveCurrent = async () => {
    if (!current.name.trim()) return alert("Template needs a name")

    const now = new Date().toISOString()
    const exists = templates.some((t) => t.name === current.name)

    const payload: Template = {
      ...current,
      attributes: buildAttributePayload(),
      createdAt: exists ? current.createdAt : now,
      updatedAt: now,
    }

    await apiSaveTpl(payload, exists)
    setTemplates((prev) =>
      [...prev.filter((t) => t.name !== payload.name), payload].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    )
    setSaved(exists ? "Template updated" : "Template created")
    setTimeout(() => setSaved(""), 3000)
    reset()
    setTab("manage")
  }

  const deleteTpl = async (name: string) => {
    await apiDeleteTpl(name)
    setTemplates((p) => p.filter((t) => t.name !== name))
  }

  const reset = () => {
    setCurrent(emptyTpl())
    setIsEditing(false)
  }

  const attrChecked = (k: string) => current.attributes[k] || false
  const attrCount = Object.values(current.attributes).filter(Boolean).length

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-2xl">
            <FileText className="h-6 w-6" /> Template Builder
          </CardTitle>
          <p className="text-gray-400">
            Create, save and apply custom templates
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid grid-cols-2 border-b border-white/10 bg-transparent">
              <TabsTrigger value="create">
                {isEditing ? "Edit" : "Create"}
              </TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            {/* ---------- CREATE / EDIT ---------- */}
            <TabsContent value="create" className="mt-6 space-y-6">
              {saved && (
                <Alert className="border-green-500/50 bg-green-500/10 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">
                    {saved}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={current.name}
                    onChange={(e) =>
                      setCurrent({ ...current, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={current.description}
                    onChange={(e) =>
                      setCurrent({ ...current, description: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* overwrite toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={current.overwriteFalse}
                  onCheckedChange={(v) =>
                    setCurrent((p) => ({ ...p, overwriteFalse: v === true }))
                  }
                />
                <Label className="text-gray-300">
                  Include <em>all</em> newsletter keys (unchecked ={" "}
                  <span className="font-semibold">false</span>)
                </Label>
              </div>

              <Badge>{attrCount} attributes selected</Badge>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white/5 p-4 border border-white/10 rounded">
                {NEWSLETTER_KEYS.map((slug) => (
                  <div key={slug} className="flex items-center space-x-2">
                    <Checkbox
                      checked={attrChecked(slug)}
                      onCheckedChange={(v) =>
                        setCurrent((p) => ({
                          ...p,
                          attributes: {
                            ...p.attributes,
                            [slug]: v === true,
                          },
                        }))
                      }
                    />
                    <Label className="text-gray-300 capitalize cursor-pointer">
                      {slug.replace(/-/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={saveCurrent} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />{" "}
                  {isEditing ? "Update" : "Save"}
                </Button>
                {isEditing && (
                  <Button variant="outline" onClick={reset}>
                    Cancel
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* ---------- MANAGE ---------- */}
            <TabsContent value="manage" className="mt-6 space-y-4">
              <DefaultTemplatesSection />

              {templates.length === 0 && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    No custom templates yet. Create one in the Create tab.
                  </AlertDescription>
                </Alert>
              )}

              {templates.map((tpl) => (
                <Card key={tpl.name} className="bg-white/5 border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg text-white capitalize">
                          {tpl.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs text-yellow-300 border-yellow-400/50"
                        >
                          Custom
                        </Badge>
                        {tpl.overwriteFalse && (
                          <Badge
                            variant="outline"
                            className="text-xs text-purple-300 border-purple-400/50"
                          >
                            Overwrites&nbsp;false
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Created:{" "}
                        {new Date(tpl.createdAt).toLocaleDateString()}{" "}
                        {tpl.updatedAt &&
                          `(Updated ${new Date(
                            tpl.updatedAt,
                          ).toLocaleDateString()})`}
                      </p>
                      <p
                        className="text-sm text-gray-300 max-w-md truncate"
                        title={tpl.description}
                      >
                        {tpl.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrent(tpl)
                          setIsEditing(true)
                          setTab("create")
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setCurrent({
                            ...tpl,
                            name: `${tpl.name}-copy`,
                            createdAt: "",
                            updatedAt: undefined,
                          })
                          setIsEditing(false)
                          setTab("create")
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400"
                        onClick={() => deleteTpl(tpl.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
