"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search01Icon as Search } from "hugeicons-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import type { Locale } from "@/lib/i18n-helpers";
import { pickField } from "@/lib/i18n-helpers";

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string | null;
  category: string;
  tags: string;
  titleEn: string;
  shortDescEn: string;
}

interface Props {
  projects: ProjectItem[];
  locale: Locale;
}

export function ProjectFilters({ projects, locale }: Props) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const [category, setCategory] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        pickField(p, locale, "title").toLowerCase().includes(q) ||
        pickField(p, locale, "shortDesc").toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [projects, query, category, locale]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ps-10"
          />
        </div>
        <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition",
                category === c
                  ? "border-white bg-white text-black"
                  : "border-white/[0.08] bg-white/[0.02] text-white/70 hover:bg-white/[0.06]",
              )}
            >
              {c === "all" ? tCommon("all") : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="surface p-12 text-center text-sm text-white/60">
          {tCommon("noResults")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
