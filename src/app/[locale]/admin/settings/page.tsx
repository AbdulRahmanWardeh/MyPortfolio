import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { updateSettings } from "@/actions/admin";
import { CtaIconField } from "./CtaIconField";

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <PageHeader title="Site Settings" description="Theme, name, and default locale." />
      <form action={updateSettings}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2">
              <Label>Site name</Label>
              <Input name="siteName" defaultValue={s.siteName} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Background (hex)</Label>
                <Input name="primaryColor" defaultValue={s.primaryColor} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Accent (hex)</Label>
                <Input name="accentColor" defaultValue={s.accentColor} />
              </div>
            </div>

            <ImageUploadField
              label="Default OG image"
              name="ogImage"
              defaultValue={s.ogImage}
            />

            <CtaIconField defaultValue={s.ctaIcon} />
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <SubmitButton variant="accent" size="lg">
            Save changes
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
