"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, X, ImagePlus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BilingualField } from "@/components/admin/BilingualField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { UploadDropzone } from "@/lib/uploadthing-client";
import { toast } from "sonner";

interface ProjectDefaults {
  slug: string;
  titleEn: string;
  shortDescEn: string;
  fullDescEn: string;
  coverImage: string | null;
  category: string;
  roleEn: string;
  timelineEn: string;
  client: string | null;
  projectType: string;
  tags: string;
  liveLink: string | null;
  behanceLink: string | null;
  dribbbleLink: string | null;
  figmaLink: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  images?: Array<{ url: string; altEn: string }>;
}

interface Props {
  action: (fd: FormData) => Promise<void>;
  defaults?: ProjectDefaults;
}

interface GalleryItem {
  url: string;
  altEn: string;
}

export function ProjectForm({ action, defaults }: Props) {
  const [gallery, setGallery] = React.useState<GalleryItem[]>(
    defaults?.images?.map((g) => ({ url: g.url, altEn: g.altEn })) ?? [],
  );
  const [uploading, setUploading] = React.useState(false);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <BilingualField label="Title" nameEn="titleEn" defaultEn={defaults?.titleEn} required />
            <BilingualField label="Short description" nameEn="shortDescEn" defaultEn={defaults?.shortDescEn} textarea />
            <BilingualField label="Full description" nameEn="fullDescEn" defaultEn={defaults?.fullDescEn} textarea />
            <BilingualField label="Role" nameEn="roleEn" defaultEn={defaults?.roleEn} />
            <BilingualField label="Timeline" nameEn="timelineEn" defaultEn={defaults?.timelineEn} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <ImageUploadField
              label="Cover image"
              name="coverImage"
              defaultValue={defaults?.coverImage}
            />
            <div className="flex flex-col gap-2">
              <Label>Slug</Label>
              <Input
                name="slug"
                defaultValue={defaults?.slug ?? ""}
                placeholder="auto-generated from title if empty"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Input name="category" defaultValue={defaults?.category ?? "UX/UI"} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Project type</Label>
                <Input name="projectType" defaultValue={defaults?.projectType ?? "Case Study"} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Client</Label>
                <Input name="client" defaultValue={defaults?.client ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Order</Label>
                <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tags</Label>
              <Input
                name="tags"
                defaultValue={defaults?.tags ?? ""}
                placeholder="Fintech, Product Design, Mobile"
              />
              <p className="text-xs text-white/40">
                Comma-separated. Shown next to the project title in the list.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Live URL</Label>
                <Input name="liveLink" defaultValue={defaults?.liveLink ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Behance</Label>
                <Input name="behanceLink" defaultValue={defaults?.behanceLink ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Dribbble</Label>
                <Input name="dribbbleLink" defaultValue={defaults?.dribbbleLink ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Figma</Label>
                <Input name="figmaLink" defaultValue={defaults?.figmaLink ?? ""} />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <label className="inline-flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={defaults?.isFeatured ?? false}
                  className="h-4 w-4"
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={defaults?.isPublished ?? true}
                  className="h-4 w-4"
                />
                Published
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex items-baseline justify-between">
            <Label>Gallery</Label>
            <span className="text-xs text-white/40">{gallery.length} images</span>
          </div>

          {gallery.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
                  <div className="relative aspect-[4/3]">
                    <Image src={g.url} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1.5 p-3">
                    <Input
                      placeholder="Alt text"
                      value={g.altEn}
                      onChange={(e) => {
                        const next = [...gallery];
                        next[i].altEn = e.target.value;
                        setGallery(next);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                    className="absolute end-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <UploadDropzone
            endpoint="adminGallery"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              const urls = (res ?? []).map(
                (r) => r?.serverData?.url ?? r?.ufsUrl ?? r?.url,
              ).filter((u): u is string => !!u);
              setGallery([
                ...gallery,
                ...urls.map((url) => ({ url, altEn: "" })),
              ]);
              toast.success(`Uploaded ${urls.length} image${urls.length === 1 ? "" : "s"}`);
            }}
            onUploadError={(err) => {
              setUploading(false);
              toast.error(err.message ?? "Upload failed");
            }}
            appearance={{
              container:
                "rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6",
              label: "text-sm text-white/70",
              allowedContent: "text-xs text-white/40",
              button:
                "rounded-full bg-white text-black px-5 h-9 text-sm font-medium hover:bg-white/90",
            }}
            content={{
              label: () => (
                <div className="flex flex-col items-center gap-2 text-center">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-5 w-5 text-white/50" />
                  )}
                  <span>Drop or click to add gallery images</span>
                </div>
              ),
            }}
          />

          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>Or add URL:</span>
            <input
              type="url"
              placeholder="https://..."
              className="h-8 flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 text-xs text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = e.currentTarget.value.trim();
                  if (v) {
                    setGallery([...gallery, { url: v, altEn: "" }]);
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={(e) => {
                const input = e.currentTarget
                  .previousElementSibling as HTMLInputElement;
                const v = input.value.trim();
                if (v) {
                  setGallery([...gallery, { url: v, altEn: "" }]);
                  input.value = "";
                }
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SubmitButton variant="accent" size="lg">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
