"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RepeatableList } from "./RepeatableList";
import { parseJson } from "@/lib/utils";

type Highlight = { titleEn: string; descEn: string };

/**
 * Replaces the old "Highlights (JSON array)" textarea.
 *
 * Note the previous helper text advertised `{ title, desc }`, but
 * AboutPreview reads `titleEn`/`descEn` — anything entered under the old keys
 * rendered blank. Normalizing here accepts both and writes the correct shape.
 */
function normalize(input: unknown): Highlight[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const r = raw as Record<string, unknown>;
    const pick = (...keys: string[]) => {
      for (const k of keys) if (typeof r[k] === "string") return r[k] as string;
      return "";
    };
    return [{ titleEn: pick("titleEn", "title"), descEn: pick("descEn", "desc") }];
  });
}

export function HighlightsField({ defaultValue }: { defaultValue?: unknown }) {
  const [items, setItems] = React.useState<Highlight[]>(() =>
    normalize(parseJson<unknown[]>(defaultValue, [])),
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>Highlights</Label>
      <input type="hidden" name="highlights" value={JSON.stringify(items)} readOnly />
      <RepeatableList
        items={items}
        onChange={setItems}
        newItem={() => ({ titleEn: "", descEn: "" })}
        addLabel="Add highlight"
        empty="No highlights yet."
      >
        {(item, update) => (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Title</Label>
              <Input
                value={item.titleEn}
                onChange={(e) => update({ titleEn: e.target.value })}
                placeholder="e.g. 6 years experience"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={item.descEn}
                onChange={(e) => update({ descEn: e.target.value })}
                className="min-h-[70px]"
                placeholder="A short supporting line"
              />
            </div>
          </div>
        )}
      </RepeatableList>
    </div>
  );
}
