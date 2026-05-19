import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect({ href: "/login", locale });
  }

  return (
    <AdminShell
      user={{
        email: session!.user.email ?? "",
        name: session!.user.name,
      }}
    >
      {children}
      <Toaster />
    </AdminShell>
  );
}
