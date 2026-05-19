import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createService } from "@/actions/admin";
import { redirect } from "next/navigation";

async function action(fd: FormData) {
  "use server";
  await createService(fd);
  redirect("/en/admin/services");
}

export default function NewServicePage() {
  return (
    <div>
      <PageHeader title="New service" />
      <ServiceForm action={action} />
    </div>
  );
}
