import * as React from "react";
import { cn } from "@/lib/utils";
import { Behance02Icon as Behance, Linkedin02Icon as LinkedIn, WhatsappIcon as WhatsApp, InstagramIcon as Instagram } from "hugeicons-react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Dribbble = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm9.81 13.81c-.51-.16-2.49-.74-4.96-.34 1.04 2.85 1.46 5.17 1.54 5.65a10.32 10.32 0 0 0 3.42-5.31zM12 21.6c-2.31 0-4.43-.78-6.12-2.09.13-.32 1.62-3.55 5.86-5.04l.05-.02c.43 1.12 2.85 7.71 2.94 7.99-.86.07-1.74.11-2.73.16zm-9.6-9.6C2.4 7.13 7.13 2.4 12 2.4c2.86 0 5.46 1.13 7.38 2.97-.17.26-1.59 2.27-4.93 3.59C12.51 5.86 10.85 3.95 10.6 3.69c-.05.02-.1.04-.16.06A9.65 9.65 0 0 0 4.4 9.9c.5-.07 2.59-.31 5.05.13.06-.01.13-.02.19-.03-.13-.28-1.18-2.34-2.43-4.31 1.59-.6 3.66-.94 5.74-.94.16 0 .33 0 .49.01.18.34 2.21 4.13 2.79 5.49-5.42 1.44-9.54 5.91-10.04 6.5-1.07-1.79-1.69-3.9-1.69-6.15z" />
  </svg>
);



const GitHub = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

const Figma = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4zM4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4zM4 4c0-2.21 1.79-4 4-4h4v8H8C5.79 8 4 6.21 4 4zM12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0zM20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" />
  </svg>
);

const Youtube = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
  </svg>
);

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  behance: Behance,
  dribbble: Dribbble,
  linkedin: LinkedIn,
  whatsapp: WhatsApp,
  instagram: Instagram,
  github: GitHub,
  figma: Figma,
  youtube: Youtube,
};

function pickIcon(platform: string): React.ComponentType<{ className?: string }> | null {
  const key = platform.toLowerCase().trim();
  return ICONS[key] ?? null;
}

export function SocialButton({
  platform,
  url,
  className,
}: {
  platform: string;
  url: string;
  className?: string;
}) {
  const Icon = pickIcon(platform);
  if (!Icon) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className={cn(
        "group inline-flex h-12 w-12 items-center justify-center rounded-full border border-tint/[0.10] bg-tint/[0.03] text-tint/75 transition-all hover:scale-[1.05] hover:border-tint/30 hover:bg-tint hover:text-background",
        className,
      )}
    >
      <Icon className="h-6 w-6" />
    </a>
  );
}

export function SocialButtonsRow({
  links,
  className,
  buttonClassName,
}: {
  links: Array<{ platform: string; url: string }>;
  className?: string;
  buttonClassName?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((s) => (
        <SocialButton key={s.platform + s.url} platform={s.platform} url={s.url} className={buttonClassName} />
      ))}
    </div>
  );
}
