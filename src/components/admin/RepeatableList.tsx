"use client";

import * as React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Generic add/remove/reorder list used by every editor that replaced a raw
 * JSON textarea. Owns only the array plumbing — each caller renders its own
 * fields for a single item via `children`.
 */
export function RepeatableList<T>({
  items,
  onChange,
  newItem,
  addLabel = "Add item",
  empty = "Nothing yet.",
  children,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  addLabel?: string;
  empty?: string;
  children: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-tint/10 px-4 py-6 text-center text-xs text-tint/40">
          {empty}
        </p>
      ) : null}

      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-tint/[0.08] bg-tint/[0.02] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[0.7rem] font-medium uppercase tracking-wide text-tint/40">
              #{i + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-tint/60 hover:text-tint"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-tint/60 hover:text-tint"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-tint/60 hover:text-red-400"
                onClick={() => remove(i)}
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {children(item, (patch) => update(i, patch), i)}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => onChange([...items, newItem()])}
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}
