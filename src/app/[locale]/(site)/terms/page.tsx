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
    path: `/${locale}/terms`,
    title: "Terms of Service",
  });
}

export default async function TermsPage({
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
      heading: "Acceptance of Terms",
      paragraphs: [
        `By using this Site you confirm that you have the legal capacity to enter into these Terms and that you will comply with them, along with all applicable laws and regulations.`,
      ],
    },
    {
      heading: "Use of the Site",
      paragraphs: [
        `You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use of the Site.`,
      ],
      bullets: [
        `Do not attempt to gain unauthorized access to the Site, its server, or any connected database.`,
        `Do not use the Site to transmit malicious code, spam, or unsolicited communications.`,
        `Do not copy, reproduce, or redistribute content from the Site without prior written permission.`,
      ],
    },
    {
      heading: "Intellectual Property",
      paragraphs: [
        `All content on this Site — including text, graphics, logos, images, case studies, and design work — is the property of ${name} or its respective content creators and is protected by applicable copyright and intellectual property laws.`,
        `Project work is displayed for portfolio purposes. Some work may be subject to agreements with the respective clients and remains their property where applicable.`,
      ],
    },
    {
      heading: "Bookings & Communications",
      paragraphs: [
        `The Site may allow you to request meetings or submit inquiries through booking and contact forms. Submitting a request does not create a binding contract for services until it is confirmed in writing.`,
        `You are responsible for providing accurate and complete information. Confirmed meetings may be rescheduled or cancelled by either party with reasonable notice.`,
      ],
    },
    {
      heading: "Third-Party Links",
      paragraphs: [
        `This Site may contain links to third-party websites or services that are not owned or controlled by ${name}. We are not responsible for the content, privacy policies, or practices of any third-party sites.`,
      ],
    },
    {
      heading: "Disclaimer",
      paragraphs: [
        `The Site and its content are provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied. We do not guarantee that the Site will be uninterrupted, secure, or error-free.`,
      ],
    },
    {
      heading: "Limitation of Liability",
      paragraphs: [
        `To the fullest extent permitted by law, ${name} shall not be liable for any indirect, incidental, or consequential damages arising out of your access to, use of, or inability to use the Site.`,
      ],
    },
    {
      heading: "Changes to These Terms",
      paragraphs: [
        `We may update these Terms from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.`,
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        `If you have any questions about these Terms, please get in touch through the contact page.`,
      ],
    },
  ];

  return (
    <LegalDocument
      title="Terms of Service"
      updated="July 4, 2026"
      intro={`These Terms of Service ("Terms") govern your access to and use of ${name} (the "Site"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.`}
      blocks={blocks}
    />
  );
}
