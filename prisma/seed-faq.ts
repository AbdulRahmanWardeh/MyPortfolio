/**
 * Idempotent supplemental seed for FAQs + the About résumé link.
 * Safe to re-run: only inserts FAQs when none exist, and only sets a
 * default résumé URL when the field is still empty.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FAQS: { questionEn: string; answerEn: string }[] = [
  {
    questionEn: "What kind of projects do you take on?",
    answerEn:
      "End-to-end product design — UX research, interaction design, and polished UI for web and mobile. I work best with teams shipping something ambitious and care about the details.",
  },
  {
    questionEn: "How does a typical engagement work?",
    answerEn:
      "We start with a short discovery call to align on goals and scope. From there I move through research, wireframes, and high-fidelity design, sharing progress along the way so there are no surprises at handoff.",
  },
  {
    questionEn: "What's your typical timeline?",
    answerEn:
      "Most focused projects run 2–6 weeks depending on scope. I'll give you a clear estimate after our first call once I understand the problem.",
  },
  {
    questionEn: "Do you work with developers on handoff?",
    answerEn:
      "Yes. I deliver clean, token-based design systems and annotated specs, and I stay available through implementation and QA so the build matches the design.",
  },
  {
    questionEn: "How do I get started?",
    answerEn:
      "Book a meeting from the contact page and tell me a bit about your project. I'll follow up within a day or two to set up our first call.",
  },
];

async function main() {
  const existing = await prisma.faq.count();
  if (existing === 0) {
    await prisma.faq.createMany({
      data: FAQS.map((f, i) => ({ ...f, order: i, isActive: true })),
    });
    console.log(`Seeded ${FAQS.length} FAQs.`);
  } else {
    console.log(`FAQs already present (${existing}); skipping.`);
  }

  const about = await prisma.aboutContent.findUnique({
    where: { id: "singleton" },
  });
  if (about && !about.resumeUrl) {
    await prisma.aboutContent.update({
      where: { id: "singleton" },
      data: { resumeUrl: "/resume.pdf" },
    });
    console.log("Set default résumé URL → /resume.pdf");
  } else {
    console.log("Résumé URL already set; skipping.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
