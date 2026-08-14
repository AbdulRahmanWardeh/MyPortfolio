"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RepeatableList } from "./RepeatableList";
import { parseJson } from "@/lib/utils";

type Deliverable = { en: string };

function normalize(input: unknown): Deliverable[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((raw) => {
    if (typeof raw === "string") return [{ en: raw }];
    if (raw && typeof raw === "object") {
      const en = (raw as { en?: unknown }).en;
      return [{ en: typeof en === "string" ? en : "" }];
    }
    return [];
  });
}

/**
 * Replaces the old "Deliverables (JSON)" textarea. Keeps the same persisted
 * shape (`{ en }[]`) via a hidden input, so the server action is unchanged.
 */
export function DeliverablesField({ defaultValue }: { defaultValue?: unknown }) {
  const [items, setItems] = React.useState<Deliverable[]>(() =>
    normalize(parseJson<unknown[]>(defaultValue, [])),
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>Deliverables</Label>
      <input type="hidden" name="deliverables" value={JSON.stringify(items)} readOnly />
      <RepeatableList
        items={items}
        onChange={setItems}
        newItem={() => ({ en: "" })}
        addLabel="Add deliverable"
        empty="No deliverables yet."
      >
        {(item, update) => (
          <Input
            value={item.en}
            onChange={(e) => update({ en: e.target.value })}
            placeholder="e.g. Wireframes & prototype"
          />
        )}
      </RepeatableList>
    </div>
  );
}
