"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  label: string;
  name: string;
  defaultValue?: string | null;
  endpoint?: "adminImage" | "adminGallery";
}

export function ImageUploadField({
  label,
  name,
  defaultValue,
  endpoint = "adminImage",
}: Props) {
  const [value, setValue] = React.useState(defaultValue ?? "");
  const [uploading, setUploading] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={value} readOnly />
      {value ? (
        <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08]">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute end-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false);
            const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
            if (url) {
              setValue(url);
              toast.success("Uploaded");
            }
          }}
          onUploadError={(err) => {
            setUploading(false);
            toast.error(err.message ?? "Upload failed");
          }}
          appearance={{
            container:
              "rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 ut-ready:bg-white/[0.02] ut-uploading:bg-white/[0.04]",
            label: "text-sm text-white/70",
            allowedContent: "text-xs text-white/40",
            button:
              "rounded-full bg-white text-black px-5 h-10 text-sm font-medium hover:bg-white/90",
          }}
          content={{
            label: () => (
              <div className="flex flex-col items-center gap-2 text-center">
                <ImagePlus className="h-6 w-6 text-white/50" />
                <span>Drag & drop or click to choose</span>
              </div>
            ),
            uploadIcon: uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : undefined,
          }}
        />
      )}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>Or paste URL:</span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
