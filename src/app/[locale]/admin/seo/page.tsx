import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateSeo } from "@/actions/admin";

export default async function AdminSeoPage() {
  const s = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <div>
      <PageHeader title="SEO" description="Default metadata used across the site." />
      <form action={updateSeo}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <BilingualField
              label="SEO title"
              nameEn="seoTitleEn"
              nameAr="seoTitleAr"
              defaultEn={s.seoTitleEn}
              defaultAr={s.seoTitleAr}
            />
            <BilingualField
              label="SEO description"
              nameEn="seoDescEn"
              nameAr="seoDescAr"
              defaultEn={s.seoDescEn}
              defaultAr={s.seoDescAr}
              textarea
            />
            <ImageUploadField
              label="Open Graph image"
              name="ogImage"
              defaultValue={s.ogImage}
            />
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
