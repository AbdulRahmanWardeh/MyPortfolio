import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { CaseStudySectionsEditor } from "@/components/admin/CaseStudySectionsEditor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateCaseStudy } from "@/actions/admin";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const cs = await prisma.caseStudy.findUnique({
    where: { id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!cs) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateCaseStudy(id, fd);
    redirect(`/${locale}/admin/case-studies`);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title="Edit case study" description={cs.titleEn} />
        <CaseStudyForm action={action} defaults={cs} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            Reorder, edit, or remove sections. Each section can include rich blocks
            (metrics, gallery, quotes, etc.) defined as JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CaseStudySectionsEditor caseStudyId={cs.id} initial={cs.sections} />
        </CardContent>
      </Card>
    </div>
  );
}
