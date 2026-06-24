import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      biographyEn: "",
      philosophyEn: "",
      experienceSummaryEn: "",
    },
  });

  const { parseJson } = await import("@/lib/utils");
  const highlightsParsed = parseJson<unknown[]>(about.highlights, []);
  const highlights = JSON.stringify(highlightsParsed, null, 2);

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
              <div className="flex flex-col gap-2">
                <Label>Résumé URL</Label>
                <Input
                  name="resumeUrl"
                  type="url"
                  defaultValue={about.resumeUrl}
                  placeholder="/resume.pdf or https://..."
                />
                <p className="text-xs text-white/40">
                  Shown as a “Download résumé” button on the About page. Leave
                  empty to hide it.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Highlights (JSON array)</Label>
                <Textarea name="highlights" defaultValue={highlights} className="min-h-[220px] font-mono text-xs" />
                <p className="text-xs text-white/40">
                  Array of {`{ title, desc }`}
                </p>
              </div>
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
