import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
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
    },
  });
  if (!project) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateProject(id, fd);
    redirect(`/${locale}/admin/projects`);
  }

  return (
    <div>
      <PageHeader title="Edit project" description={project.titleEn} />
      <ProjectForm action={action} defaults={project} />
    </div>
  );
}
