import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateHero } from "@/actions/admin";

export default async function AdminHeroPage() {
  const hero = await prisma.heroContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nameEn: "",
      nameAr: "",
      titleEn: "",
      titleAr: "",
      introEn: "",
      introAr: "",
    },
  });

  return (
    <div>
      <PageHeader title="Hero Section" description="The first thing visitors see." />
      <form action={updateHero}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <BilingualField
                label="Name"
                nameEn="nameEn"
                nameAr="nameAr"
                defaultEn={hero.nameEn}
                defaultAr={hero.nameAr}
                required
              />
              <BilingualField
                label="Title"
                nameEn="titleEn"
                nameAr="titleAr"
                defaultEn={hero.titleEn}
                defaultAr={hero.titleAr}
                required
              />
              <BilingualField
                label="Intro"
                nameEn="introEn"
                nameAr="introAr"
                defaultEn={hero.introEn}
                defaultAr={hero.introAr}
                textarea
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-5 p-6">
              <ImageUploadField
                label="Profile image"
                name="profileImage"
                defaultValue={hero.profileImage}
              />
              <BilingualField
                label="Primary CTA label"
                nameEn="primaryCtaLabelEn"
                nameAr="primaryCtaLabelAr"
                defaultEn={hero.primaryCtaLabelEn}
                defaultAr={hero.primaryCtaLabelAr}
              />
              <div className="flex flex-col gap-2">
                <Label>Primary CTA URL</Label>
                <Input name="primaryCtaHref" defaultValue={hero.primaryCtaHref} />
              </div>
              <BilingualField
                label="Secondary CTA label"
                nameEn="secondaryCtaLabelEn"
                nameAr="secondaryCtaLabelAr"
                defaultEn={hero.secondaryCtaLabelEn}
                defaultAr={hero.secondaryCtaLabelAr}
              />
              <div className="flex flex-col gap-2">
                <Label>Secondary CTA URL</Label>
                <Input name="secondaryCtaHref" defaultValue={hero.secondaryCtaHref} />
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
