"use client";

/* ----------------------------------------------------------------------
 * UserEditModal (newspaper theme)
 * - load / display user details
 * - let admin apply a template, edit attributes, save
 * - “Applied template” toast only appears AFTER the Save call succeeds
 * -------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Save,
  AlertTriangle,
  Info,
  FileText,
} from "lucide-react";

import { DEFAULT_TEMPLATES } from "@/lib/template-defaults";
import { updateUserAttributesAction } from "@/lib/user-actions";
import type { ZephrUser } from "@/lib/zephr-types";

/* ---------------- template helpers ---------------- */
const DEFAULT_MAP = Object.fromEntries(DEFAULT_TEMPLATES.map((t) => [t.name, t]));

const fetchCustomTemplateNames = async (): Promise<string[]> =>
  (await fetch("/api/templates")).json();

const fetchTemplate = async (name: string) => {
  if (DEFAULT_MAP[name]) return DEFAULT_MAP[name];
  const res = await fetch(`/api/templates/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Template not found");
  return (await res.json()) as {
    name: string;
    attributes: Record<string, boolean>;
  };
};

const saveTemplate = async (tpl: {
  name: string;
  description: string;
  attributes: Record<string, boolean>;
}) =>
  fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tpl),
  });

/* ------------- visible attribute schema ------------ */
const ATTRIBUTE_SCHEMA: Record<
  string,
  { label: string; type: "text" | "select" | "tel"; options?: string[] }
> = {
  firstname: { label: "First Name", type: "text" },
  lastname: { label: "Last Name", type: "text" },
  organization: { label: "Organization", type: "text" },
  "job-area": {
    label: "Job Area",
    type: "select",
    options: [
      "In-House Counsel",
      "Technology Executive",
      "Corporate Executive",
      "Law Firm",
      "Solo Practitioner",
    ],
  },
  "job-function": {
    label: "Job Function",
    type: "select",
    options: ["General Counsel", "Associate", "CEO", "Student"],
  },
  address: { label: "Address", type: "text" },
  city: { label: "City", type: "text" },
  phone: { label: "Phone", type: "tel" },
};

/* ------------------ component ---------------------- */
interface Props {
  userDetails: ZephrUser | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}

export function UserEditModal({
  userDetails,
  loading,
  error,
  isOpen,
  onClose,
  onUserUpdated,
}: Props) {
  const [edited, setEdited] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* templates */
  const [tplNames, setTplNames] = useState<string[]>([]);
  const [tplErr, setTplErr] = useState<string | null>(null);
  const [pendingTpl, setPendingTpl] = useState<string | null>(null);

  /* ------------ load template list ------------- */
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const custom = await fetchCustomTemplateNames();
        const defaults = DEFAULT_TEMPLATES.map((t) => t.name);
        const merged = [...defaults, ...custom.filter((n) => !defaults.includes(n))];
        setTplNames(merged);
        setTplErr(null);
      } catch (e) {
        console.error(e);
        setTplErr("Failed to load templates");
      }
    })();
  }, [isOpen]);

  /* ------------ initialise form ----------------- */
  useEffect(() => {
    if (!userDetails || !isOpen) return;
    const init: Record<string, any> = {};
    Object.keys(ATTRIBUTE_SCHEMA).forEach((k) => {
      init[k] = userDetails.attributes[k] ?? "";
    });
    Object.entries(userDetails.attributes).forEach(([k, v]) => {
      if (!(k in init)) init[k] = v;
    });
    setEdited(init);
    setSaveErr(null);
    setSuccess(null);
    setPendingTpl(null);
  }, [userDetails, isOpen]);

  /* ------------- handlers ----------------------- */
  const onAttrChange = (k: string, v: string) => setEdited((p) => ({ ...p, [k]: v }));

  const applyTemplate = async (name: string) => {
    if (!name) return;
    try {
      const tpl = await fetchTemplate(name);
      setEdited((p) => ({ ...p, ...tpl.attributes }));
      setPendingTpl(name); // toast only after successful PATCH
      setSaveErr(null);
    } catch (e) {
      console.error(e);
      setSaveErr("Failed to apply template");
    }
  };

  const saveAsTemplate = async () => {
    if (!userDetails) return;
    const tplName = userDetails.identifiers.email_address;
    try {
      await saveTemplate({
        name: tplName,
        description: `Template captured from ${tplName}`,
        attributes: edited,
      });
      setTplNames((p) => (p.includes(tplName) ? p : [...p, tplName]));
      setSuccess("Template saved!");
    } catch (e) {
      console.error(e);
      setSaveErr("Could not save template");
    }
  };

  const handleSave = async () => {
    if (!userDetails) return;
    setSaving(true);
    setSaveErr(null);
    setSuccess(null);

    const patch: Record<string, any> = {};
    for (const [k, v] of Object.entries(edited)) if (v !== "") patch[k] = v;

    if (Object.keys(patch).length === 0) {
      setSaveErr("No attributes to save");
      setSaving(false);
      return;
    }

    try {
      const res = await updateUserAttributesAction(userDetails.user_id, patch);
      if (res.success) {
        setSuccess(
          pendingTpl ? `Template “${pendingTpl}” applied & user updated!` : "User updated successfully!"
        );
        setPendingTpl(null);
        onUserUpdated?.();
        setTimeout(onClose, 1500);
      } else setSaveErr(res.error || "Failed to update user");
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- render ---------------------- */
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border border-line text-ink"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-ink">
            <User className="h-5 w-5" aria-hidden="true" />
            Edit User: {userDetails?.identifiers.email_address || "…"}
          </DialogTitle>
        </DialogHeader>

        {/* ---------- template selector ---------- */}
        <div className="space-y-2">
          <Label className="text-[hsl(var(--muted-foreground))]">Apply Template</Label>
          {tplErr ? (
            <p className="text-xs text-[hsl(var(--destructive))]">{"Failed to load templates"}</p>
          ) : tplNames.length === 0 ? (
            <Select disabled>
              <SelectTrigger className="rounded-none border border-line bg-paper text-[hsl(var(--muted-foreground))]">
                <SelectValue placeholder="No templates available" />
              </SelectTrigger>
            </Select>
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
        </div>

        {/* ---------- alerts ---------- */}
        {error && (
          <Alert className="mt-4 rounded-none border border-line bg-[hsl(var(--muted))]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-ink">{error}</AlertDescription>
          </Alert>
        )}
        {saveErr && (
          <Alert variant="destructive" className="mt-4 rounded-none">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{saveErr}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4 rounded-none border border-line bg-[hsl(var(--secondary))]/20">
            <Info className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="text-ink">{success}</AlertDescription>
          </Alert>
        )}

        {/* ---------- attribute form ---------- */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-ink" />
            <span className="text-[hsl(var(--muted-foreground))]">Loading…</span>
          </div>
        ) : (
          userDetails && (
            <Card className="mt-6 rounded-none border border-line bg-paper">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-ink">User Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(ATTRIBUTE_SCHEMA).map(([k, s]) => (
                    <div key={k} className="space-y-2">
                      <Label className="text-[hsl(var(--muted-foreground))]">{s.label}</Label>
                      {s.type === "select" ? (
                        <Select
                          value={(edited[k] as string) || ""}
                          onValueChange={(v) => onAttrChange(k, v)}
                        >
                          <SelectTrigger className="rounded-none border border-line bg-paper text-ink">
                            <SelectValue placeholder={`Select ${s.label}`} />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border border-line bg-paper">
                            {s.options!.map((opt) => (
                              <SelectItem
                                key={opt}
                                value={opt}
                                className="rounded-none text-ink hover:bg-[hsl(var(--muted))]"
                              >
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={s.type}
                          value={(edited[k] as string) || ""}
                          onChange={(e) => onAttrChange(k, e.target.value)}
                          className="rounded-none border border-line bg-paper text-ink placeholder:text-[hsl(var(--muted-foreground))]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* ---------- actions ---------- */}
        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={saveAsTemplate}
            className="rounded-none border-line text-ink hover:bg-[hsl(var(--muted))]"
            title="Create template from current attributes"
          >
            <FileText className="mr-1 h-4 w-4" />
            Save Template
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
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
      </DialogContent>
    </Dialog>
  );
}
