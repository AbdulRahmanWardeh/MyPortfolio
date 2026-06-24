import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateFooter } from "@/actions/admin";

export default async function AdminFooterPage() {
  const f = await prisma.footerContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return (
    <div>
      <PageHeader title="Footer" />
      <form action={updateFooter}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <BilingualField label="Bio" nameEn="bioEn" defaultEn={f.bioEn} textarea />
            <div className="flex flex-col gap-2">
              <Label>Contact email</Label>
              <Input name="email" type="email" defaultValue={f.email} />
            </div>
            <BilingualField label="Copyright" nameEn="copyrightEn" defaultEn={f.copyrightEn} />
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <SubmitButton variant="accent" size="lg">Save changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
