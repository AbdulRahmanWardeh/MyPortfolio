"use client";

import * as React from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "./ImagePicker";
import { RepeatableList } from "./RepeatableList";
import {
  BLOCK_KINDS,
  emptyBlock,
  type Block,
  type BlockKind,
} from "@/lib/blocks";

/**
 * Visual replacement for the old "Blocks (JSON array)" textarea. Each block
 * kind gets real form fields, and every image field is a real uploader rather
 * than a URL the admin has to paste by hand.
 */
export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (next: Block[]) => void;
}) {
  const [adding, setAdding] = React.useState(false);

  const patch = (i: number, next: Block) =>
    onChange(blocks.map((b, idx) => (idx === i ? next : b)));

  const remove = (i: number) => onChange(blocks.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const target = i + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  const add = (kind: BlockKind) => {
    onChange([...blocks, emptyBlock(kind)]);
    setAdding(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {blocks.length === 0 && !adding ? (
        <p className="rounded-xl border border-dashed border-tint/10 px-4 py-8 text-center text-sm text-tint/40">
          No content blocks yet. Add images, metrics, quotes and more below.
        </p>
      ) : null}

      {blocks.map((block, i) => {
        const meta = BLOCK_KINDS.find((k) => k.value === block.kind);
        return (
          <div
            key={i}
            className="rounded-2xl border border-tint/[0.08] bg-tint/[0.02] p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-accent/30 bg-accent/15 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-accent">
                  {meta?.label ?? block.kind}
                </span>
                <span className="text-xs text-tint/40">{meta?.hint}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-tint/60 hover:text-tint"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move block up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-tint/60 hover:text-tint"
                  onClick={() => move(i, 1)}
                  disabled={i === blocks.length - 1}
                  aria-label="Move block down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-tint/60 hover:text-red-400"
                  onClick={() => remove(i)}
                  aria-label="Remove block"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <SingleBlockEditor block={block} onChange={(b) => patch(i, b)} />
          </div>
        );
      })}

      {adding ? (
        <div className="rounded-2xl border border-tint/[0.08] bg-tint/[0.02] p-5">
          <div className="mb-3 flex items-center justify-between">
            <Label>Choose a block type</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {BLOCK_KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => add(k.value)}
                className="rounded-xl border border-tint/[0.10] bg-tint/[0.03] px-4 py-3 text-start text-tint transition hover:border-accent/40 hover:bg-accent/10"
              >
                <div className="text-sm font-medium">{k.label}</div>
                <div className="mt-0.5 text-xs text-tint/50">{k.hint}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => setAdding(true)}
        >
          <Plus className="h-3.5 w-3.5" /> Add content block
        </Button>
      )}
    </div>
  );
}

function SingleBlockEditor({
  block,
  onChange,
}: {
  block: Block;
  onChange: (b: Block) => void;
}) {
  switch (block.kind) {
    case "image":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            <ImagePicker
              value={block.data.url}
              onChange={(url) => onChange({ ...block, data: { ...block.data, url } })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Caption (optional)</Label>
            <Input
              value={block.data.captionEn ?? ""}
              onChange={(e) =>
                onChange({ ...block, data: { ...block.data, captionEn: e.target.value } })
              }
              placeholder="Describe the image"
            />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="flex flex-col gap-2">
          <Label>Images</Label>
          <RepeatableList
            items={block.data.images}
            onChange={(images) => onChange({ ...block, data: { ...block.data, images } })}
            newItem={() => ({ url: "", altEn: "" })}
            addLabel="Add image"
            empty="No images in this gallery yet."
          >
            {(img, update) => (
              <div className="flex flex-col gap-2">
                <ImagePicker
                  value={img.url}
                  onChange={(url) => update({ url })}
                  aspect="aspect-[4/3]"
                />
                <Input
                  value={img.altEn ?? ""}
                  onChange={(e) => update({ altEn: e.target.value })}
                  placeholder="Alt text (for accessibility)"
                  className="h-8 text-xs"
                />
              </div>
            )}
          </RepeatableList>
        </div>
      );

    case "beforeAfter":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Before</Label>
            <ImagePicker
              value={block.data.beforeUrl}
              onChange={(beforeUrl) =>
                onChange({ ...block, data: { ...block.data, beforeUrl } })
              }
              aspect="aspect-[4/3]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>After</Label>
            <ImagePicker
              value={block.data.afterUrl}
              onChange={(afterUrl) =>
                onChange({ ...block, data: { ...block.data, afterUrl } })
              }
              aspect="aspect-[4/3]"
            />
          </div>
        </div>
      );

    case "metrics":
      return (
        <div className="flex flex-col gap-2">
          <Label>Metrics</Label>
          <RepeatableList
            items={block.data.items}
            onChange={(items) => onChange({ ...block, data: { ...block.data, items } })}
            newItem={() => ({ labelEn: "", value: "" })}
            addLabel="Add metric"
            empty="No metrics yet."
          >
            {(item, update) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Value</Label>
                  <Input
                    value={item.value}
                    onChange={(e) => update({ value: e.target.value })}
                    placeholder="e.g. +38%"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Label</Label>
                  <Input
                    value={item.labelEn}
                    onChange={(e) => update({ labelEn: e.target.value })}
                    placeholder="e.g. Conversion lift"
                  />
                </div>
              </div>
            )}
          </RepeatableList>
        </div>
      );

    case "bullets":
      return (
        <div className="flex flex-col gap-2">
          <Label>List items</Label>
          <RepeatableList
            items={block.data.items}
            onChange={(items) => onChange({ ...block, data: { ...block.data, items } })}
            newItem={() => ({ en: "" })}
            addLabel="Add bullet"
            empty="No bullets yet."
          >
            {(item, update) => (
              <Input
                value={item.en}
                onChange={(e) => update({ en: e.target.value })}
                placeholder="Bullet text"
              />
            )}
          </RepeatableList>
        </div>
      );

    case "quote":
      return (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label>Quote</Label>
            <Textarea
              value={block.data.textEn}
              onChange={(e) =>
                onChange({ ...block, data: { ...block.data, textEn: e.target.value } })
              }
              className="min-h-[90px]"
              placeholder="What was said"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Author (optional)</Label>
            <Input
              value={block.data.authorEn ?? ""}
              onChange={(e) =>
                onChange({ ...block, data: { ...block.data, authorEn: e.target.value } })
              }
              placeholder="Who said it"
            />
          </div>
        </div>
      );

    case "cards":
      return (
        <div className="flex flex-col gap-2">
          <Label>Cards</Label>
          <RepeatableList
            items={block.data.items}
            onChange={(items) => onChange({ ...block, data: { ...block.data, items } })}
            newItem={() => ({ titleEn: "", descEn: "" })}
            addLabel="Add card"
            empty="No cards yet."
          >
            {(item, update) => (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label>Title</Label>
                  <Input
                    value={item.titleEn}
                    onChange={(e) => update({ titleEn: e.target.value })}
                    placeholder="Card title"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Description</Label>
                  <Textarea
                    value={item.descEn}
                    onChange={(e) => update({ descEn: e.target.value })}
                    className="min-h-[70px]"
                    placeholder="Card description"
                  />
                </div>
              </div>
            )}
          </RepeatableList>
        </div>
      );
  }
}
