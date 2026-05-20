import { BilingualField } from "@/components/admin/BilingualField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseJson } from "@/lib/utils";

interface Props {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    icon: string;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    deliverables: unknown;
    timelineEn: string;
    timelineAr: string;
    ctaLabelEn: string;
    ctaLabelAr: string;
    isActive: boolean;
    order: number;
  };
}

export function ServiceForm({ action, defaults }: Props) {
  const deliverables = JSON.stringify(
    parseJson<unknown[]>(defaults?.deliverables, [{ en: "", ar: "" }]),
    null,
    2,
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <Label>Icon (Lucide name)</Label>
            <Input name="icon" defaultValue={defaults?.icon ?? "Sparkles"} />
            <p className="text-xs text-white/40">
              See https://lucide.dev for names. E.g. Search, Layout, Smartphone.
            </p>
          </div>
          <BilingualField
            label="Title"
            nameEn="titleEn"
            nameAr="titleAr"
            defaultEn={defaults?.titleEn}
            defaultAr={defaults?.titleAr}
            required
          />
          <BilingualField
            label="Description"
            nameEn="descriptionEn"
            nameAr="descriptionAr"
            defaultEn={defaults?.descriptionEn}
            defaultAr={defaults?.descriptionAr}
            textarea
          />
          <BilingualField
            label="Timeline"
            nameEn="timelineEn"
            nameAr="timelineAr"
            defaultEn={defaults?.timelineEn}
            defaultAr={defaults?.timelineAr}
          />
          <BilingualField
            label="CTA label"
            nameEn="ctaLabelEn"
            nameAr="ctaLabelAr"
            defaultEn={defaults?.ctaLabelEn}
            defaultAr={defaults?.ctaLabelAr}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <Label>Deliverables (JSON)</Label>
            <Textarea
              name="deliverables"
              defaultValue={deliverables}
              className="min-h-[180px] font-mono text-xs"
            />
            <p className="text-xs text-white/40">
              Array of {`{ en, ar }`} strings.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Order</Label>
              <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
            </div>
            <label className="mt-auto inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={defaults?.isActive ?? true}
                className="h-4 w-4"
              />
              Active
            </label>
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
