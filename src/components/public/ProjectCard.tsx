import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { pickField, type Locale } from "@/lib/i18n-helpers";

interface ProjectCardProps {
  project: {
    slug: string;
    coverImage: string | null;
    category: string;
    titleEn: string;
    titleAr: string;
    shortDescEn: string;
    shortDescAr: string;
  };
  locale: Locale;
  className?: string;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group surface relative block overflow-hidden transition hover:bg-white/[0.04]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={pickField(project, locale, "title")}
            fill
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
        )}
        <div className="pointer-events-none absolute inset-x-4 top-4 flex justify-between text-xs">
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-white/80 backdrop-blur">
            {project.category}
          </span>
          <span className="rounded-full bg-white text-black p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight className="h-3.5 w-3.5 rtl:rotate-[-90deg]" />
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium leading-tight">
          {pickField(project, locale, "title")}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/55">
          {pickField(project, locale, "shortDesc")}
        </p>
      </div>
    </Link>
  );
}
