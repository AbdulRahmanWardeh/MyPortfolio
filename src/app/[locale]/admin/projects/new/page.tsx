import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "@/actions/admin";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tools = await prisma.tool.findMany({ orderBy: { name: "asc" } });

  async function action(fd: FormData) {
    "use server";
    await createProject(fd);
    redirect(`/${locale}/admin/projects`);
  }

  return (
    <div>
      <PageHeader title="New project" />
      <ProjectForm action={action} allTools={tools} />
    </div>
  );
}
