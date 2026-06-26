"use client";

import * as React from "react";
import { FileText, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  defaultValue?: string | null;
}

export function ResumeUploadField({ defaultValue }: Props) {
  const [value, setValue] = React.useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-3">
      <Label>Résumé (PDF)</Label>
      <input type="hidden" name="resumeUrl" value={value} readOnly />
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-white/50" />
          <span className="flex-1 truncate text-sm text-white/70">{value}</span>
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-full bg-white/10 p-1 text-white/60 hover:bg-white/20"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <UploadDropzone
          endpoint="adminResume"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.serverData?.url ?? res?.[0]?.ufsUrl ?? res?.[0]?.url;
            if (url) {
              setValue(url);
              toast.success("Resume uploaded");
            }
          }}
          onUploadError={(err) => {
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
                <FileText className="h-6 w-6 text-white/50" />
                <span>Drag & drop or click to upload PDF</span>
              </div>
            ),
          }}
        />
      )}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>Or paste URL:</span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="/resume.pdf or https://..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
