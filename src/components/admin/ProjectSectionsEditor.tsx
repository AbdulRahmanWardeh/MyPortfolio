"use client";

import * as React from "react";
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { toast } from "sonner";
import {
  upsertProjectSection,
  deleteProjectSection,
  reorderProjectSections,
} from "@/actions/admin";
import { normalizeBlocks, type Block } from "@/lib/blocks";
import { parseJson } from "@/lib/utils";

/**
 * Suggestions only — `type` is a free-text field. It's an admin-side label
 * (never used for public rendering), so any custom value is valid.
 */
const TYPES: { value: string; label: string }[] = [
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
  bodyEn: string;
  blocks: unknown;
}

export function ProjectSectionsEditor({
  projectId,
  initial,
}: {
  projectId: string;
  initial: Section[];
}) {
  const [sections, setSections] = React.useState<Section[]>(
    [...initial].sort((a, b) => a.order - b.order),
  );
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const addSection = async () => {
    const order = sections.length;
    try {
      await upsertProjectSection({
        projectId,
        type: "CUSTOM",
        order,
        titleEn: "Untitled section",
        bodyEn: "",
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
      await reorderProjectSections(
        reordered.map((s) => ({ id: s.id, order: s.order })),
      );
    } catch {
      toast.error("Could not reorder");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteProjectSection(id);
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
                projectId={projectId}
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
  projectId,
  onSaved,
}: {
  section: Section;
  projectId: string;
  onSaved: (s: Section) => void;
}) {
  const [type, setType] = React.useState(section.type);
  const [titleEn, setTitleEn] = React.useState(section.titleEn);
  const [bodyEn, setBodyEn] = React.useState(section.bodyEn);
  const [blocks, setBlocks] = React.useState<Block[]>(() =>
    normalizeBlocks(parseJson<unknown[]>(section.blocks, [])),
  );
  const [saving, setSaving] = React.useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await upsertProjectSection({
        id: section.id,
        projectId,
        type,
        order: section.order,
        titleEn,
        bodyEn,
        blocks,
      });
      onSaved({ ...section, type, titleEn, bodyEn, blocks });
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
        <Input
          value={type}
          onChange={(e) => setType(e.target.value)}
          list="section-type-suggestions"
          placeholder="e.g. Discovery, Goal, Handoff…"
        />
        <datalist id="section-type-suggestions">
          {TYPES.map((t) => (
            <option key={t.value} value={t.label} />
          ))}
        </datalist>
        <p className="text-xs text-tint/40">
          Type anything, or pick one of the suggestions.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Title</Label>
        <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Body</Label>
        <Textarea
          value={bodyEn}
          onChange={(e) => setBodyEn(e.target.value)}
          className="min-h-[140px]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Content blocks</Label>
        <BlockEditor blocks={blocks} onChange={setBlocks} />
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="accent" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save section"}
        </Button>
      </div>
    </div>
  );
}
