import { setRequestLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const session = await auth();
  if (session?.user) {
    redirect({ href: "/admin", locale });
  }

  return (
    <section className="theme-fixed-dark grid min-h-[calc(100vh-4rem)] place-items-center bg-background px-6 py-16">
      <div className="surface w-full max-w-md p-8">
        <h1 className="h-display text-2xl font-semibold">{t("login.title")}</h1>
        <p className="mt-2 text-sm text-white/60">
          {t("contact.subtitle")}
        </p>
        <div className="mt-8">
          <LoginForm
            labels={{
              email: t("login.email"),
              password: t("login.password"),
              submit: t("login.submit"),
              error: t("login.error"),
            }}
          />
        </div>
      </div>
    </section>
  );
}
