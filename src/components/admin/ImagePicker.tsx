"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing-client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Compact, controlled image picker for use inside repeatable editors (section
 * blocks, galleries). Unlike ImageUploadField it carries no <input name>, so it
 * composes into state-driven editors that serialize themselves on save.
 *
 * `config={{ cn }}` swaps UploadThing's plain-join class merger for the
 * twMerge-based one, otherwise its built-in `text-white` survives alongside our
 * `text-black` and wins on stylesheet order — an invisible button label.
 */
export function ImagePicker({
  value,
  onChange,
  aspect = "aspect-[16/10]",
  endpoint = "adminGallery",
  className,
}: {
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
  endpoint?: "adminImage" | "adminGallery";
  className?: string;
}) {
  const [uploading, setUploading] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value ? (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-tint/[0.10]",
            aspect,
          )}
        >
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute end-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-black/90"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          config={{ cn }}
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false);
            const url =
              res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
            if (url) {
              onChange(url);
              toast.success("Uploaded");
            }
          }}
          onUploadError={(err) => {
            setUploading(false);
            toast.error(err.message ?? "Upload failed");
          }}
          appearance={{
            container:
              "m-0 select-none rounded-xl border border-dashed border-tint/15 bg-tint/[0.02] p-5",
            label: "text-xs text-tint/70",
            allowedContent: "text-[0.7rem] text-tint/50",
            button:
              "select-none rounded-full bg-tint text-background px-4 h-8 text-xs font-medium hover:bg-tint/90",
          }}
          content={{
            uploadIcon: uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-tint/60" />
            ) : (
              <ImagePlus className="h-5 w-5 text-tint/50" />
            ),
            label: () => (
              <span>{uploading ? "Uploading…" : "Drop or click to upload"}</span>
            ),
          }}
        />
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="h-8 text-xs"
      />
    </div>
  );
}
