import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateAbout } from "@/actions/admin";

export default async function AdminAboutPage() {
  const about = await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      headlineEn: "",
      headlineAr: "",
      biographyEn: "",
      biographyAr: "",
      philosophyEn: "",
      philosophyAr: "",
      experienceSummaryEn: "",
      experienceSummaryAr: "",
    },
  });

  const highlights = JSON.stringify(about.highlights ?? [], null, 2);

  return (
    <div>
      <PageHeader title="About" description="Manage your about content." />
      <form action={updateAbout}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <BilingualField
                label="Headline"
                nameEn="headlineEn"
                nameAr="headlineAr"
                defaultEn={about.headlineEn}
                defaultAr={about.headlineAr}
              />
              <BilingualField
                label="Biography"
                nameEn="biographyEn"
                nameAr="biographyAr"
                defaultEn={about.biographyEn}
                defaultAr={about.biographyAr}
                textarea
              />
              <BilingualField
                label="Design philosophy"
                nameEn="philosophyEn"
                nameAr="philosophyAr"
                defaultEn={about.philosophyEn}
                defaultAr={about.philosophyAr}
                textarea
              />
              <BilingualField
                label="Experience summary"
                nameEn="experienceSummaryEn"
                nameAr="experienceSummaryAr"
                defaultEn={about.experienceSummaryEn}
                defaultAr={about.experienceSummaryAr}
                textarea
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <ImageUploadField
                label="Profile image"
                name="profileImage"
                defaultValue={about.profileImage}
              />
              <div className="flex flex-col gap-2">
                <Label>Highlights (JSON array)</Label>
                <Textarea
                  name="highlights"
                  defaultValue={highlights}
                  className="min-h-[220px] font-mono text-xs"
                />
                <p className="text-xs text-white/40">
                  Array of {`{ titleEn, titleAr, descEn, descAr }`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <SubmitButton variant="accent" size="lg">
            Save changes
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
