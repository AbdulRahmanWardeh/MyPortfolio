import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe02Icon as Globe } from "hugeicons-react";

type IconProps = React.SVGProps<SVGSVGElement>;

const Behance = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M22 7h-7V5.5h7V7zM15.5 17.5c-.61 0-2.5 0-2.5-1.92 0-2.27 2.74-2.43 2.74-2.43v-.85s-.74 0-2.27-.05c-1.84-.06-3.97.94-3.97 3.43 0 2.85 2.6 3.32 4 3.32 1.74 0 3.5-.69 3.5-3.5h-1.5c0 1.5-1.32 2-2 2zM17 11.5c-.55-.5-1.5-.78-2.85-.83 0 0-.65-.03-1.65-.03h-3.5c0 1.45-.04 2.06-.13 2.5h6.06c0 .55-.18 1.5-1.18 1.5-1.21 0-1.5-.78-1.5-1.5h-2c0 .5.16 3.05 3.5 3.05 1.97 0 3.27-.86 3.55-2.5h2.5c0 0-.32-1.34-2.8-2.19zM6.5 12c1.31 0 1.5-.59 1.5-1.5 0-.92-.36-1.5-1.5-1.5H4v3h2.5zm.34 1.5H4v3.25h3.07c.65 0 1.43-.42 1.43-1.5 0-1.29-1.1-1.75-1.66-1.75zM6.81 7.5C9 7.5 11 8.04 11 10.5c0 1.05-.36 1.94-1.35 2.39 1.34.39 1.92 1.5 1.92 2.85 0 2.66-2.16 3.51-4.51 3.51H2V7.5h4.81z" />
  </svg>
);

const Dribbble = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm9.81 13.81c-.51-.16-2.49-.74-4.96-.34 1.04 2.85 1.46 5.17 1.54 5.65a10.32 10.32 0 0 0 3.42-5.31zM12 21.6c-2.31 0-4.43-.78-6.12-2.09.13-.32 1.62-3.55 5.86-5.04l.05-.02c.43 1.12 2.85 7.71 2.94 7.99-.86.07-1.74.11-2.73.16zm-9.6-9.6C2.4 7.13 7.13 2.4 12 2.4c2.86 0 5.46 1.13 7.38 2.97-.17.26-1.59 2.27-4.93 3.59C12.51 5.86 10.85 3.95 10.6 3.69c-.05.02-.1.04-.16.06A9.65 9.65 0 0 0 4.4 9.9c.5-.07 2.59-.31 5.05.13.06-.01.13-.02.19-.03-.13-.28-1.18-2.34-2.43-4.31 1.59-.6 3.66-.94 5.74-.94.16 0 .33 0 .49.01.18.34 2.21 4.13 2.79 5.49-5.42 1.44-9.54 5.91-10.04 6.5-1.07-1.79-1.69-3.9-1.69-6.15z" />
  </svg>
);

const LinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05a3.73 3.73 0 0 1 3.36-1.85c3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.51C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z" />
  </svg>
);

const TwitterX = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Instagram = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.74 1.48 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
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

const ICONS: Record<string, React.FC<IconProps>> = {
  behance: Behance,
  dribbble: Dribbble,
  linkedin: LinkedIn,
  twitter: TwitterX,
  x: TwitterX,
  instagram: Instagram,
  github: GitHub,
  figma: Figma,
  youtube: Youtube,
};

function pickIcon(platform: string): React.FC<IconProps> {
  const key = platform.toLowerCase().trim();
  return ICONS[key] ?? ((p: IconProps) => <Globe className={p.className as string} />);
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
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className={cn(
        "group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/75 transition-all hover:scale-[1.05] hover:border-white/30 hover:bg-white hover:text-black",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export function SocialButtonsRow({
  links,
  className,
}: {
  links: Array<{ platform: string; url: string }>;
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((s) => (
        <SocialButton key={s.platform + s.url} platform={s.platform} url={s.url} />
      ))}
    </div>
  );
}
