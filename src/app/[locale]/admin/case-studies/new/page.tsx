import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { createCaseStudy } from "@/actions/admin";

export default async function NewCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  async function action(fd: FormData) {
    "use server";
    await createCaseStudy(fd);
    const slug = String(fd.get("slug") || fd.get("titleEn") || "").toLowerCase();
    const cs = slug
      ? await prisma.caseStudy.findFirst({ where: { slug } })
      : null;
    redirect(
      cs ? `/${locale}/admin/case-studies/${cs.id}` : `/${locale}/admin/case-studies`,
    );
  }

  return (
    <div>
      <PageHeader
        title="New case study"
        description="Save first, then add sections on the next page."
      />
      <CaseStudyForm action={action} />
    </div>
  );
}
