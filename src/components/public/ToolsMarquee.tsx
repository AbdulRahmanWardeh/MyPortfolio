"use client";

import * as React from "react";
import Image from "next/image";

interface Tool {
  id: string;
  name: string;
  iconUrl: string | null;
}

export function ToolsMarquee({ items }: { items: Tool[] }) {
  if (items.length === 0) return null;
  // Duplicate so the loop is seamless.
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4" aria-hidden={false}>
      <div
        className="pointer-events-none absolute inset-y-0 start-0 z-10 w-32"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background)) 10%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 end-0 z-10 w-32"
        style={{
          background:
            "linear-gradient(to left, hsl(var(--background)) 10%, transparent 100%)",
        }}
      />
      <div className="flex w-max animate-marquee items-center gap-20 px-6 will-change-transform">
        {doubled.map((tool, i) => (
          <div
            key={`${tool.id}-${i}`}
            title={tool.name}
            className="grid h-14 w-14 shrink-0 place-items-center opacity-70 transition hover:opacity-100"
          >
            {tool.iconUrl ? (
              <Image
                src={tool.iconUrl}
                alt={tool.name}
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-sm font-medium text-white/85">
                {tool.name.slice(0, 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
