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
      titleEn: "",
      introEn: "",
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
                defaultEn={hero.nameEn}
                required
              />
              <BilingualField
                label="Title"
                nameEn="titleEn"
                defaultEn={hero.titleEn}
                required
              />
              <BilingualField
                label="Intro"
                nameEn="introEn"
                defaultEn={hero.introEn}
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
              <div className="flex flex-col gap-2">
                <Label>Primary CTA label</Label>
                <Input name="primaryCtaLabel" defaultValue={hero.primaryCtaLabel} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Primary CTA URL</Label>
                <Input name="primaryCtaHref" defaultValue={hero.primaryCtaHref} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Secondary CTA label</Label>
                <Input name="secondaryCtaLabel" defaultValue={hero.secondaryCtaLabel} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Secondary CTA URL</Label>
                <Input name="secondaryCtaHref" defaultValue={hero.secondaryCtaHref} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-white/[0.06]">
                <div className="flex flex-col gap-2">
                  <Label>Years of experience</Label>
                  <Input name="yearsExperience" type="number" min={0} defaultValue={hero.yearsExperience} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Projects built</Label>
                  <Input name="projectsBuilt" type="number" min={0} defaultValue={hero.projectsBuilt} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Clients served</Label>
                  <Input name="clientsServed" type="number" min={0} defaultValue={hero.clientsServed} />
                </div>
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
