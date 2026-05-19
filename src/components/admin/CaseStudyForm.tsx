import { BilingualField } from "@/components/admin/BilingualField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

interface Props {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    slug: string;
    titleEn: string;
    titleAr: string;
    summaryEn: string;
    summaryAr: string;
    coverImage: string | null;
    client: string | null;
    roleEn: string;
    roleAr: string;
    timelineEn: string;
    timelineAr: string;
    isPublished: boolean;
    isFeatured: boolean;
    order: number;
  };
}

export function CaseStudyForm({ action, defaults }: Props) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <BilingualField
              label="Title"
              nameEn="titleEn"
              nameAr="titleAr"
              defaultEn={defaults?.titleEn}
              defaultAr={defaults?.titleAr}
              required
            />
            <BilingualField
              label="Summary"
              nameEn="summaryEn"
              nameAr="summaryAr"
              defaultEn={defaults?.summaryEn}
              defaultAr={defaults?.summaryAr}
              textarea
            />
            <BilingualField
              label="Role"
              nameEn="roleEn"
              nameAr="roleAr"
              defaultEn={defaults?.roleEn}
              defaultAr={defaults?.roleAr}
            />
            <BilingualField
              label="Timeline"
              nameEn="timelineEn"
              nameAr="timelineAr"
              defaultEn={defaults?.timelineEn}
              defaultAr={defaults?.timelineAr}
            />
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
              <Input name="slug" defaultValue={defaults?.slug ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Client</Label>
              <Input name="client" defaultValue={defaults?.client ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Order</Label>
              <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
            </div>
            <div className="flex gap-4">
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
      <div className="flex justify-end">
        <SubmitButton variant="accent" size="lg">
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
