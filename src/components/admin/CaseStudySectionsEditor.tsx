"use client";

import * as React from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  upsertCaseStudySection,
  deleteCaseStudySection,
  reorderCaseStudySections,
} from "@/actions/admin";
import type { CaseStudySectionType } from "@/lib/enums";
import { parseJson } from "@/lib/utils";

const TYPES: { value: CaseStudySectionType; label: string }[] = [
  { value: "OVERVIEW", label: "Overview" },
  { value: "PROBLEM", label: "Problem" },
  { value: "GOAL", label: "Goal" },
  { value: "ROLE", label: "My Role" },
  { value: "TIMELINE", label: "Timeline" },
  { value: "RESEARCH", label: "Research" },
  { value: "INTERVIEWS", label: "User Interviews" },
  { value: "AFFINITY", label: "Affinity Mapping" },
  { value: "PERSONAS", label: "User Personas" },
  { value: "JOURNEY", label: "User Journey" },
  { value: "FLOW", label: "Flow Chart" },
  { value: "WIREFRAMES", label: "Wireframes" },
  { value: "DESIGN_SYSTEM", label: "Design System" },
  { value: "FINAL_UI", label: "Final UI" },
  { value: "USABILITY", label: "Usability Testing" },
  { value: "ITERATIONS", label: "Iterations" },
  { value: "RESULTS", label: "Results" },
  { value: "LEARNINGS", label: "Learnings" },
  { value: "CUSTOM", label: "Custom" },
];

type Section = {
  id: string;
  type: string;
  order: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  blocks: unknown;
}

export function CaseStudySectionsEditor({
  caseStudyId,
  initial,
}: {
  caseStudyId: string;
  initial: Section[];
}) {
  const [sections, setSections] = React.useState<Section[]>(
    [...initial].sort((a, b) => a.order - b.order),
  );
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const addSection = async () => {
    const order = sections.length;
    try {
      await upsertCaseStudySection({
        caseStudyId,
        type: "CUSTOM",
        order,
        titleEn: "Untitled section",
        titleAr: "قسم جديد",
        bodyEn: "",
        bodyAr: "",
        blocks: [],
      });
      toast.success("Section added");
      // simplest: rely on revalidation to refresh — force reload
      window.location.reload();
    } catch {
      toast.error("Could not add");
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[idx], next[target]] = [next[target], next[idx]];
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setSections(reordered);
    try {
      await reorderCaseStudySections(
        reordered.map((s) => ({ id: s.id, order: s.order })),
      );
    } catch {
      toast.error("Could not reorder");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteCaseStudySection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {sections.map((s, i) => (
        <Card key={s.id}>
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <GripVertical className="h-4 w-4 text-white/30" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {s.titleEn}{" "}
                <span className="text-xs uppercase tracking-wide text-white/30">
                  {TYPES.find((t) => t.value === s.type)?.label ?? s.type}
                </span>
              </div>
              <div className="text-xs text-white/40">{s.titleAr}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => move(s.id, -1)}
                disabled={i === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => move(s.id, 1)}
                disabled={i === sections.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                {expanded === s.id ? "Close" : "Edit"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-red-400"
                onClick={() => remove(s.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {expanded === s.id ? (
            <CardContent className="p-6">
              <SectionEditor
                section={s}
                onSaved={(updated) => {
                  setSections(sections.map((x) => (x.id === updated.id ? updated : x)));
                  setExpanded(null);
                }}
                caseStudyId={caseStudyId}
              />
            </CardContent>
          ) : null}
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addSection}
        className="w-fit"
      >
        <Plus className="h-4 w-4" /> Add section
      </Button>
    </div>
  );
}

function SectionEditor({
  section,
  caseStudyId,
  onSaved,
}: {
  section: Section;
  caseStudyId: string;
  onSaved: (s: Section) => void;
}) {
  const [type, setType] = React.useState<CaseStudySectionType>(
    section.type as CaseStudySectionType,
  );
  const [titleEn, setTitleEn] = React.useState(section.titleEn);
  const [titleAr, setTitleAr] = React.useState(section.titleAr);
  const [bodyEn, setBodyEn] = React.useState(section.bodyEn);
  const [bodyAr, setBodyAr] = React.useState(section.bodyAr);
  const [blocksJson, setBlocksJson] = React.useState(
    JSON.stringify(parseJson<unknown[]>(section.blocks, []), null, 2),
  );
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    let blocks: unknown[] = [];
    try {
      blocks = blocksJson ? JSON.parse(blocksJson) : [];
    } catch {
      toast.error("Blocks JSON is invalid");
      setSaving(false);
      return;
    }
    try {
      await upsertCaseStudySection({
        id: section.id,
        caseStudyId,
        type,
        order: section.order,
        titleEn,
        titleAr,
        bodyEn,
        bodyAr,
        blocks,
      });
      onSaved({ ...section, type, titleEn, titleAr, bodyEn, bodyAr, blocks });
      toast.success("Saved");
    } catch {
      toast.error("Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Section type</Label>
        <Select value={type} onValueChange={(v) => setType(v as CaseStudySectionType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Title</Label>
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
          <TabsContent value="en">
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </TabsContent>
          <TabsContent value="ar">
            <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} dir="rtl" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Body</Label>
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
          <TabsContent value="en">
            <Textarea
              value={bodyEn}
              onChange={(e) => setBodyEn(e.target.value)}
              className="min-h-[140px]"
            />
          </TabsContent>
          <TabsContent value="ar">
            <Textarea
              value={bodyAr}
              onChange={(e) => setBodyAr(e.target.value)}
              className="min-h-[140px]"
              dir="rtl"
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Blocks (JSON array)</Label>
        <Textarea
          value={blocksJson}
          onChange={(e) => setBlocksJson(e.target.value)}
          className="min-h-[240px] font-mono text-xs"
        />
        <p className="text-xs text-white/40">
          Each block: {`{ "kind": "metrics" | "gallery" | "image" | "beforeAfter" | "bullets" | "quote" | "cards", "data": {...} }`}
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="accent" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save section"}
        </Button>
      </div>
    </div>
  );
}
