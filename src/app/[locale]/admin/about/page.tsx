import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ResumeUploadField } from "@/components/admin/ResumeUploadField";
import { HighlightsField } from "@/components/admin/HighlightsField";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateAbout } from "@/actions/admin";

export default async function AdminAboutPage() {
  const about = await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      headlineEn: "",
      biographyEn: "",
      philosophyEn: "",
      experienceSummaryEn: "",
    },
  });

  return (
    <div>
      <PageHeader title="About" description="Manage your about content." />
      <form action={updateAbout}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <BilingualField label="Headline" nameEn="headlineEn" defaultEn={about.headlineEn} />
              <BilingualField label="Biography" nameEn="biographyEn" defaultEn={about.biographyEn} textarea />
              <BilingualField label="Design philosophy" nameEn="philosophyEn" defaultEn={about.philosophyEn} textarea />
              <BilingualField label="Experience summary" nameEn="experienceSummaryEn" defaultEn={about.experienceSummaryEn} textarea />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <ImageUploadField label="Profile image" name="profileImage" defaultValue={about.profileImage} />
              <ResumeUploadField defaultValue={about.resumeUrl} />
              <HighlightsField defaultValue={about.highlights} />
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <SubmitButton variant="accent" size="lg">Save changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
