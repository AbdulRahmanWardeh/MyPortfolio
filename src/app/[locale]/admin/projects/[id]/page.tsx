import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectSectionsEditor } from "@/components/admin/ProjectSectionsEditor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateProject } from "@/actions/admin";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      sections: { orderBy: { order: "asc" } },
    },
  });
  if (!project) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateProject(id, fd);
    redirect(`/${locale}/admin/projects`);
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title="Edit project" description={project.titleEn} />
        <ProjectForm action={action} defaults={project} />
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
          <ProjectSectionsEditor projectId={project.id} initial={project.sections} />
        </CardContent>
      </Card>
    </div>
  );
}
