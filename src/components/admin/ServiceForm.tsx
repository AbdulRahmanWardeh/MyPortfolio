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
    descriptionEn: string;
    deliverables: unknown;
    timelineEn: string;
    ctaLabelEn: string;
    isActive: boolean;
    order: number;
  };
}

export function ServiceForm({ action, defaults }: Props) {
  const deliverables = JSON.stringify(
    parseJson<unknown[]>(defaults?.deliverables, [{ en: "" }]),
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
          <BilingualField label="Title" nameEn="titleEn" defaultEn={defaults?.titleEn} required />
          <BilingualField label="Description" nameEn="descriptionEn" defaultEn={defaults?.descriptionEn} textarea />
          <BilingualField label="Timeline" nameEn="timelineEn" defaultEn={defaults?.timelineEn} />
          <BilingualField label="CTA label" nameEn="ctaLabelEn" defaultEn={defaults?.ctaLabelEn} />
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
              Array of {`{ en }`} strings.
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
