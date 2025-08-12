"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Save, AlertTriangle, FileText } from "lucide-react";
import type { ZephrUser } from "@/lib/zephr-types";
import { NEWSLETTER_KEYS } from "@/lib/newsletters";
import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";

interface TemplateResp {
  name: string;
  description: string;
  overwriteFalse: boolean;
  attributes: Record<string, boolean>;
}

const fetchTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json();

const fetchTemplate = async (name: string): Promise<TemplateResp | null> => {
  const defaultHit = DEFAULT_TEMPLATES.find((d) => d.name === name);
  if (defaultHit) return defaultHit as any;
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`);
  return res.ok ? ((await res.json()) as TemplateResp) : null;
};

const postTemplate = async (tpl: TemplateResp) =>
  fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  });

interface Props {
  userId: string;
  userEmail: string;
  children: React.ReactNode;
  onUserUpdated?: () => void;
}

export function UserEditDialog({
  userId,
  userEmail,
  children,
  onUserUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<ZephrUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, any>>({});
  const [tplNames, setTplNames] = useState<string[]>([]);
  const [tplErr, setTplErr] = useState<string | null>(null);

  // Load templates when dialog opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const names = await fetchTemplateNames();
        const combined = Array.from(
          new Set([...DEFAULT_TEMPLATES.map((d) => d.name), ...names])
        ).sort();
        setTplNames(combined);
      } catch (e) {
        console.error(e);
        setTplErr("Template list failed");
      }
    })();
  }, [open]);

  // Load user details when dialog opens
  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error(await res.text());
        const details: ZephrUser = await res.json();
        setUser(details);
        setEdited(details.attributes || {});
      } catch (e) {
        console.error(e);
        setError("Unable to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, userId]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setUser(null);
      setEdited({});
      setError(null);
    }
  }, [open]);

  const handleAttrChange = (k: string, v: any) =>
    setEdited((p) => ({ ...p, [k]: v }));

  const applyTemplate = async (name: string) => {
    if (!name) return;
    const tpl = await fetchTemplate(name);
    if (!tpl) return;
    setEdited((prev) => {
      const next = { ...prev, ...tpl.attributes };
      if (tpl.overwriteFalse) {
        NEWSLETTER_KEYS.forEach((slug) => {
          if (!(slug in tpl.attributes)) next[slug] = false;
        });
      }
      return next;
    });
  };

  const saveTemplateFromUser = async () => {
    if (!user) return;
    const tpl: TemplateResp = {
      name: userEmail,
      description: `Template captured from ${userEmail}`,
      overwriteFalse: true,
      attributes: NEWSLETTER_KEYS.reduce<Record<string, boolean>>((acc, key) => {
        if (key in edited) acc[key] = !!edited[key];
        return acc;
      }, {}),
    };
    try {
      await postTemplate(tpl);
      if (!tplNames.includes(tpl.name))
        setTplNames((prev) => [...prev, tpl.name].sort());
    } catch (e) {
      console.error("Save template failed", e);
      setError("Could not save template");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attributes: edited }),
      });
      if (!res.ok) throw new Error(await res.text());
      onUserUpdated?.();
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const changed =
    !!user && JSON.stringify(edited) !== JSON.stringify(user.attributes || {});

  /* ---------- UI ---------- */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-2xl rounded-none border border-line bg-paper text-ink">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-ink">
            <User className="h-5 w-5" aria-hidden="true" />
            Edit User • {userEmail}
          </DialogTitle>
        </DialogHeader>

        {/* template selector */}
        <div className="mb-4">
          <Label className="mb-1 block text-[hsl(var(--muted-foreground))]">
            Apply Template
          </Label>

          {tplErr ? (
            <p className="text-xs text-[hsl(var(--destructive))]">{tplErr}</p>
          ) : tplNames.length === 0 ? (
            <Badge className="rounded-none border border-line bg-[hsl(var(--muted))] text-ink">
              No templates
            </Badge>
          ) : (
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                <SelectValue placeholder="Choose template…" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-line bg-paper">
                {tplNames.map((n) => (
                  <SelectItem
                    key={n}
                    value={n}
                    className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                  >
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={saveTemplateFromUser}
            className="mt-2 rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
            title="Create template from current attributes"
          >
            <FileText className="mr-1 h-3 w-3" />
            Save as Template
          </Button>
        </div>

        {/* status */}
        {loading ? (
          <div className="flex items-center justify-center py-6" aria-live="polite">
            <Loader2 className="h-6 w-6 animate-spin text-ink" />
          </div>
        ) : error ? (
          <Alert className="rounded-none border border-line bg-[hsl(var(--muted))]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-ink">{error}</AlertDescription>
          </Alert>
        ) : null}

        {/* main form */}
        {user && !loading && (
          <>
            <Card className="mb-6 rounded-none border border-line bg-paper">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-ink">Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {NEWSLETTER_KEYS.map((slug) => (
                  <div key={slug} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!edited[slug]}
                      onCheckedChange={(v) => handleAttrChange(slug, v === true)}
                      className="rounded-none"
                    />
                    <Label className="capitalize text-[hsl(var(--muted-foreground))]">
                      {slug.replace(/-/g, " ")}
                    </Label>
                  </div>
                ))}

                {/* Extra (non-newsletter) attributes */}
                {Object.entries(edited)
                  .filter(
                    ([k]) => !(NEWSLETTER_KEYS as readonly string[]).includes(k as string)
                  )
                  .map(([key, val]) => (
                    <div key={key}>
                      <Label className="text-[hsl(var(--muted-foreground))]">
                        {key}
                      </Label>
                      <Input
                        value={val ?? ""}
                        onChange={(e) => handleAttrChange(key, e.target.value)}
                        className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
              >
                Cancel
              </Button>
              <Button
                disabled={!changed || saving}
                onClick={handleSave}
                className="rounded-none bg-ink text-paper hover:bg-ink/90 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
