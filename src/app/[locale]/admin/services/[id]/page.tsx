import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { updateService } from "@/actions/admin";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const item = await prisma.service.findUnique({ where: { id } });
  if (!item) notFound();

  async function action(fd: FormData) {
    "use server";
    await updateService(id, fd);
    redirect(`/${locale}/admin/services`);
  }

  return (
    <div>
      <PageHeader title="Edit service" description={item.titleEn} />
      <ServiceForm action={action} defaults={item} />
    </div>
  );
}
