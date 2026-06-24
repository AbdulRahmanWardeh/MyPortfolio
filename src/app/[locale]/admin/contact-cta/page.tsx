import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateContactCta } from "@/actions/admin";

export default async function AdminContactCtaPage() {
  const cta = await prisma.contactCta.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <PageHeader title="Contact CTA" description="The call-to-action shown at the bottom of pages." />
      <form action={updateContactCta}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <BilingualField label="Headline" nameEn="headlineEn" defaultEn={cta.headlineEn} />
            <BilingualField label="Subtitle" nameEn="subtitleEn" defaultEn={cta.subtitleEn} />
            <BilingualField label="CTA label" nameEn="ctaLabelEn" defaultEn={cta.ctaLabelEn} />
            <div className="flex flex-col gap-2">
              <Label>CTA URL</Label>
              <Input name="ctaHref" defaultValue={cta.ctaHref} />
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <SubmitButton variant="accent" size="lg">Save changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
