import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n-helpers";
import { buildMetadata, getSiteSettings } from "@/lib/seo";
import { LegalDocument, type LegalBlock } from "@/components/public/LegalDocument";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({
    locale: locale as Locale,
    path: `/${locale}/privacy`,
    title: "Privacy Policy",
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings();
  const name = settings.siteName;

  const blocks: LegalBlock[] = [
    {
      heading: "Information We Collect",
      paragraphs: [
        `We only collect information that you choose to provide, together with limited technical data gathered automatically to keep the Site running smoothly.`,
      ],
      bullets: [
        `Contact details you submit — such as your name, email address, phone number, and company.`,
        `The content of any message or project inquiry you send us.`,
        `Booking details, including your preferred meeting type, date, and time.`,
        `Basic technical data such as browser type, device, and anonymized usage statistics.`,
      ],
    },
    {
      heading: "How We Use Your Information",
      bullets: [
        `To respond to your inquiries and communicate with you about your request.`,
        `To schedule, confirm, and manage meetings you book through the Site.`,
        `To improve the content, performance, and usability of the Site.`,
        `To comply with legal obligations where applicable.`,
      ],
    },
    {
      heading: "Cookies & Analytics",
      paragraphs: [
        `The Site may use cookies or similar technologies to remember your preferences (such as light or dark theme) and to understand how visitors use the Site. You can disable cookies through your browser settings, though some features may not function as intended.`,
      ],
    },
    {
      heading: "How We Share Information",
      paragraphs: [
        `We do not sell or rent your personal information. We may share data only with trusted service providers that help us operate the Site — for example, hosting or email delivery — and only to the extent necessary to provide those services, or where required by law.`,
      ],
    },
    {
      heading: "Data Retention",
      paragraphs: [
        `We retain the information you provide for as long as necessary to respond to your request, fulfill the purpose it was collected for, or comply with legal requirements. You may request deletion of your data at any time.`,
      ],
    },
    {
      heading: "Your Rights",
      paragraphs: [`Depending on your location, you may have the right to:`],
      bullets: [
        `Access the personal information we hold about you.`,
        `Request correction of inaccurate or incomplete data.`,
        `Request deletion of your personal information.`,
        `Object to or restrict certain processing of your data.`,
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        `We take reasonable technical and organizational measures to protect your information against unauthorized access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.`,
      ],
    },
    {
      heading: "Changes to This Policy",
      paragraphs: [
        `We may update this Privacy Policy from time to time. Any changes will be reflected on this page with a revised "last updated" date.`,
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `If you have questions about this Privacy Policy or would like to exercise your rights, please reach out through the contact page.`,
      ],
    },
  ];

  return (
    <LegalDocument
      title="Privacy Policy"
      updated="July 4, 2026"
      intro={`This Privacy Policy explains how ${name} ("we", "us", or "our") collects, uses, and protects the information you provide when you visit or interact with this Site. We are committed to handling your data responsibly and transparently.`}
      blocks={blocks}
    />
  );
}
