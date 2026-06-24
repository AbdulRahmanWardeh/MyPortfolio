import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

type CaseStudySectionType =
  | "OVERVIEW" | "PROBLEM" | "GOAL" | "ROLE" | "TIMELINE" | "RESEARCH"
  | "INTERVIEWS" | "AFFINITY" | "PERSONAS" | "JOURNEY" | "FLOW"
  | "WIREFRAMES" | "DESIGN_SYSTEM" | "FINAL_UI" | "USABILITY"
  | "ITERATIONS" | "RESULTS" | "LEARNINGS" | "CUSTOM";

const prisma = new PrismaClient();

const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80";
const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80";
const PLACEHOLDER_PROFILE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80";

async function main() {
  // -------- Admin user --------
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2025";
  const name = process.env.ADMIN_NAME ?? "Portfolio Admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, name },
    create: { email, hashedPassword, name },
  });

  // -------- Singletons --------
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nameEn: "Abdulrahman",
      titleEn: "UX/UI Designer · Product Design",
      introEn:
        "I craft calm, premium digital products — turning complex problems into elegant interfaces people love.",
      profileImage: PLACEHOLDER_PROFILE,
      yearsExperience: 6,
      projectsBuilt: 32,
      clientsServed: 18,
    },
  });

  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      headlineEn: "Design with intent. Build with care.",
      biographyEn:
        "I'm a product designer focused on UX research, interaction, and visual systems. Over the past several years I've helped startups and established teams ship intuitive, high-conversion products across web and mobile.",
      philosophyEn:
        "Great design is invisible. It removes friction, respects the user's attention, and gets out of the way so the product can shine.",
      experienceSummaryEn:
        "6+ years designing across SaaS, fintech, and consumer apps. Led design systems used by teams of 20+ engineers.",
      profileImage: "/about.png",
      highlights: JSON.stringify([
        { titleEn: "Design systems", descEn: "Scalable, token-based component libraries." },
        { titleEn: "Research-driven", descEn: "Interviews, journeys, and usability tests." },
        { titleEn: "End-to-end", descEn: "From discovery to handoff and QA." },
      ]),
    },
  });

  await prisma.contactCta.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  await prisma.footerContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // -------- Tools --------
  await prisma.tool.deleteMany();
  const tools: Array<{ name: string; iconUrl: string }> = [
    { name: "Figma", iconUrl: "https://cdn.simpleicons.org/figma/ffffff" },
    { name: "Sketch", iconUrl: "https://cdn.simpleicons.org/sketch/ffffff" },
    { name: "Framer", iconUrl: "https://cdn.simpleicons.org/framer/ffffff" },
    { name: "Adobe XD", iconUrl: "https://cdn.simpleicons.org/adobexd/ffffff" },
    { name: "Photoshop", iconUrl: "https://cdn.simpleicons.org/adobephotoshop/ffffff" },
    { name: "Illustrator", iconUrl: "https://cdn.simpleicons.org/adobeillustrator/ffffff" },
    { name: "After Effects", iconUrl: "https://cdn.simpleicons.org/adobeaftereffects/ffffff" },
    { name: "Notion", iconUrl: "https://cdn.simpleicons.org/notion/ffffff" },
    { name: "Miro", iconUrl: "https://cdn.simpleicons.org/miro/ffffff" },
    { name: "Maze", iconUrl: "https://cdn.simpleicons.org/maze/ffffff" },
  ];
  await Promise.all(
    tools.map((t, i) =>
      prisma.tool.create({
        data: { name: t.name, iconUrl: t.iconUrl, category: "Design", order: i },
      }),
    ),
  );

  const allTools = await prisma.tool.findMany();
  const toolByName = (n: string) => allTools.find((t) => t.name === n)!;

  // -------- Social links --------
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "Behance", url: "https://behance.net/yourname", order: 0 },
      { platform: "Dribbble", url: "https://dribbble.com/yourname", order: 1 },
      { platform: "LinkedIn", url: "https://linkedin.com/in/yourname", order: 2 },
      { platform: "Twitter", url: "https://x.com/yourname", order: 3 },
      { platform: "Instagram", url: "https://instagram.com/yourname", order: 4 },
    ],
  });

  // -------- Experience --------
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        roleEn: "Senior Product Designer",
        company: "Northwind Studio",
        locationEn: "Remote",
        descriptionEn: "Leading design for a B2B analytics platform serving 40k+ users.",
        startDate: new Date("2023-03-01"),
        isCurrent: true,
        order: 0,
      },
      {
        roleEn: "UX/UI Designer",
        company: "Bluebird Labs",
        locationEn: "Dubai, UAE",
        descriptionEn: "Designed fintech onboarding flows and a shared design system.",
        startDate: new Date("2020-08-01"),
        endDate: new Date("2023-02-28"),
        order: 1,
      },
      {
        roleEn: "Junior UI Designer",
        company: "Pixel & Co.",
        locationEn: "Amman, Jordan",
        descriptionEn: "Shipped marketing sites and early product UI for consumer apps.",
        startDate: new Date("2018-06-01"),
        endDate: new Date("2020-07-31"),
        order: 2,
      },
    ],
  });

  // -------- Testimonials --------
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        author: "Sara Khalil",
        roleEn: "Head of Product",
        company: "Northwind",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn: "One of the most thoughtful designers I've worked with. Calm, sharp, and product-minded.",
        rating: 5,
        isFeatured: true,
        order: 0,
      },
      {
        author: "Omar Haddad",
        roleEn: "CEO",
        company: "Bluebird",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn: "Transformed our onboarding from a leaky funnel into our best-converting flow.",
        rating: 5,
        isFeatured: true,
        order: 1,
      },
      {
        author: "Laila Mansour",
        roleEn: "Product Manager",
        company: "Acme",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn: "Every detail considered. Every interaction felt intentional. Highly recommended.",
        rating: 5,
        order: 2,
      },
    ],
  });

  // -------- Services --------
  await prisma.service.deleteMany();
  const services: Array<{
    icon: string;
    titleEn: string;
    descEn: string;
    deliverables: Array<{ en: string }>;
    timelineEn: string;
  }> = [
    {
      icon: "Search",
      titleEn: "UX Research",
      descEn: "Interviews, surveys, and synthesis that uncover real user needs.",
      deliverables: [{ en: "Research plan" }, { en: "User interviews" }, { en: "Insight report" }],
      timelineEn: "2-3 weeks",
    },
    {
      icon: "Layout",
      titleEn: "UI Design",
      descEn: "Premium, on-brand interfaces refined to pixel-level precision.",
      deliverables: [{ en: "High-fidelity screens" }, { en: "Component library" }, { en: "Style guide" }],
      timelineEn: "3-5 weeks",
    },
    {
      icon: "Smartphone",
      titleEn: "Mobile App Design",
      descEn: "iOS & Android product design that feels native and delightful.",
      deliverables: [{ en: "User flows" }, { en: "Screen designs" }, { en: "Prototype" }],
      timelineEn: "4-6 weeks",
    },
    {
      icon: "Globe",
      titleEn: "Website Design",
      descEn: "Marketing sites and product surfaces that convert.",
      deliverables: [{ en: "Sitemap" }, { en: "Wireframes" }, { en: "Final design" }],
      timelineEn: "3-5 weeks",
    },
    {
      icon: "Component",
      titleEn: "Design Systems",
      descEn: "Tokens, primitives, and patterns engineered to scale.",
      deliverables: [{ en: "Token architecture" }, { en: "Component library" }, { en: "Documentation" }],
      timelineEn: "6-10 weeks",
    },
    {
      icon: "PenLine",
      titleEn: "Wireframing",
      descEn: "Low-fidelity structure that locks in flow before pixels.",
      deliverables: [{ en: "Wireframes" }, { en: "Flow diagrams" }],
      timelineEn: "1-2 weeks",
    },
    {
      icon: "MousePointerClick",
      titleEn: "Prototyping",
      descEn: "Interactive prototypes for stakeholder review and user testing.",
      deliverables: [{ en: "Clickable prototype" }, { en: "Interaction notes" }],
      timelineEn: "1-3 weeks",
    },
    {
      icon: "ClipboardCheck",
      titleEn: "Usability Testing",
      descEn: "Moderated and unmoderated tests with actionable findings.",
      deliverables: [{ en: "Test plan" }, { en: "Session recordings" }, { en: "Findings report" }],
      timelineEn: "2-3 weeks",
    },
    {
      icon: "ScanSearch",
      titleEn: "UX Audit",
      descEn: "Heuristic and accessibility review of your existing product.",
      deliverables: [{ en: "Audit report" }, { en: "Prioritized fixes" }],
      timelineEn: "1-2 weeks",
    },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.create({
      data: {
        icon: s.icon,
        titleEn: s.titleEn,
        descriptionEn: s.descEn,
        deliverables: JSON.stringify(s.deliverables),
        timelineEn: s.timelineEn,
        order: i,
      },
    });
  }

  // -------- Projects --------
  await prisma.project.deleteMany();
  const projectsData = [
    {
      slug: "northwind-analytics",
      titleEn: "Northwind Analytics",
      shortDescEn: "B2B analytics dashboard redesigned for clarity.",
      fullDescEn:
        "A complete redesign of Northwind's analytics platform — from information architecture to a fresh component system. Resulted in a 38% lift in weekly active users.",
      category: "Web App",
      client: "Northwind",
      tags: "Fintech,Product Design",
      isFeatured: true,
      toolNames: ["Figma", "Framer", "Notion"],
    },
    {
      slug: "bluebird-banking",
      titleEn: "Bluebird Banking",
      shortDescEn: "Mobile-first banking experience for the next generation.",
      fullDescEn:
        "End-to-end product design for a neobank — onboarding, accounts, transfers, and budgeting. Native iOS & Android.",
      category: "Mobile App",
      client: "Bluebird",
      tags: "Mobile,Fintech",
      isFeatured: true,
      toolNames: ["Figma", "After Effects"],
    },
    {
      slug: "saffron-commerce",
      titleEn: "Saffron Commerce",
      shortDescEn: "Headless commerce storefront with editorial soul.",
      fullDescEn:
        "Direct-to-consumer storefront for a premium home brand — product discovery, configurator, and checkout.",
      category: "E-commerce",
      client: "Saffron Home",
      tags: "E-commerce,Branding",
      isFeatured: true,
      toolNames: ["Figma", "Photoshop"],
    },
    {
      slug: "atlas-travel",
      titleEn: "Atlas Travel",
      shortDescEn: "Booking experience inspired by editorial magazines.",
      fullDescEn: "Reimagining travel booking — destinations as stories, search as exploration.",
      category: "Web App",
      client: "Atlas",
      tags: "Travel,Editorial",
      isFeatured: false,
      toolNames: ["Figma", "Illustrator"],
    },
    {
      slug: "lumen-design-system",
      titleEn: "Lumen Design System",
      shortDescEn: "Tokenized design system powering five products.",
      fullDescEn:
        "From audit to delivery — a multi-brand, multi-platform design system with tokens, primitives, and patterns.",
      category: "Design System",
      client: "Lumen Co.",
      tags: "Design System,SaaS",
      isFeatured: false,
      toolNames: ["Figma", "Notion"],
    },
    {
      slug: "harbor-health",
      titleEn: "Harbor Health",
      shortDescEn: "Patient portal redesigned with empathy and clarity.",
      fullDescEn:
        "Care plans, appointments, and messaging — designed to reduce anxiety and improve adherence.",
      category: "Healthcare",
      client: "Harbor",
      tags: "Healthcare,Mobile",
      isFeatured: false,
      toolNames: ["Figma", "Maze"],
    },
  ];

  for (const [i, p] of projectsData.entries()) {
    const project = await prisma.project.create({
      data: {
        slug: p.slug,
        titleEn: p.titleEn,
        shortDescEn: p.shortDescEn,
        fullDescEn: p.fullDescEn,
        coverImage: `${PLACEHOLDER_COVER}&sig=${i + 1}`,
        category: p.category,
        client: p.client,
        tags: p.tags,
        isFeatured: p.isFeatured,
        order: i,
        images: {
          create: [1, 2, 3].map((n) => ({
            url: `https://picsum.photos/seed/${p.slug}-${n}/1600/1000`,
            order: n,
            altEn: `${p.titleEn} screen ${n}`,
          })),
        },
        tools: {
          create: p.toolNames.map((name) => ({
            tool: { connect: { id: toolByName(name).id } },
          })),
        },
      },
    });
    void project;
  }

  // -------- Case studies --------
  await prisma.caseStudy.deleteMany();
  const defaultSectionTypes: CaseStudySectionType[] = [
    "OVERVIEW", "PROBLEM", "GOAL", "ROLE", "TIMELINE", "RESEARCH",
    "INTERVIEWS", "AFFINITY", "PERSONAS", "JOURNEY", "FLOW",
    "WIREFRAMES", "DESIGN_SYSTEM", "FINAL_UI", "USABILITY",
    "ITERATIONS", "RESULTS", "LEARNINGS",
  ];

  const sectionTitles: Record<CaseStudySectionType, string> = {
    OVERVIEW: "Overview",
    PROBLEM: "Problem",
    GOAL: "Goal",
    ROLE: "My Role",
    TIMELINE: "Timeline",
    RESEARCH: "Research",
    INTERVIEWS: "User Interviews",
    AFFINITY: "Affinity Mapping",
    PERSONAS: "User Personas",
    JOURNEY: "User Journey",
    FLOW: "Flow Chart",
    WIREFRAMES: "Wireframes",
    DESIGN_SYSTEM: "Design System",
    FINAL_UI: "Final UI",
    USABILITY: "Usability Testing",
    ITERATIONS: "Iterations",
    RESULTS: "Results",
    LEARNINGS: "Learnings",
    CUSTOM: "Custom Section",
  };

  const caseStudies = [
    {
      slug: "northwind-analytics-case",
      titleEn: "Redesigning Northwind Analytics",
      summaryEn: "How a deep IA rework and a fresh component system lifted Northwind's WAU by 38%.",
      isFeatured: true,
    },
    {
      slug: "bluebird-onboarding-case",
      titleEn: "A calmer onboarding for Bluebird",
      summaryEn: "From a leaky 6-step flow to a guided 3-step path — and a measurable win.",
      isFeatured: true,
    },
  ];

  for (const [i, c] of caseStudies.entries()) {
    const cs = await prisma.caseStudy.create({
      data: {
        slug: c.slug,
        titleEn: c.titleEn,
        summaryEn: c.summaryEn,
        coverImage: `${PLACEHOLDER_COVER}&sig=case${i + 1}`,
        isFeatured: c.isFeatured,
        order: i,
      },
    });

    for (const [j, type] of defaultSectionTypes.entries()) {
      const titleEn = sectionTitles[type];
      const isMetrics = type === "RESULTS";
      const isGallery = type === "WIREFRAMES" || type === "FINAL_UI";
      const isBullets = type === "LEARNINGS" || type === "ITERATIONS" || type === "GOAL";

      await prisma.caseStudySection.create({
        data: {
          caseStudyId: cs.id,
          type,
          order: j,
          titleEn,
          bodyEn: "Context, decisions, and outcomes for this section of the case study.",
          blocks: JSON.stringify(
            isMetrics
              ? [
                  {
                    kind: "metrics",
                    data: {
                      items: [
                        { labelEn: "WAU lift", value: "+38%" },
                        { labelEn: "Time to insight", value: "-46%" },
                        { labelEn: "NPS", value: "62" },
                      ],
                    },
                  },
                ]
              : isGallery
              ? [
                  {
                    kind: "gallery",
                    data: {
                      images: [1, 2, 3].map((n) => ({
                        url: `https://picsum.photos/seed/${c.slug}-${type}-${n}/1600/1000`,
                        altEn: `${titleEn} ${n}`,
                      })),
                    },
                  },
                ]
              : isBullets
              ? [
                  {
                    kind: "bullets",
                    data: {
                      items: [
                        { en: "Insight one drawn from research." },
                        { en: "Decision two that shaped the flow." },
                        { en: "Outcome three measured post-launch." },
                      ],
                    },
                  },
                ]
              : [],
          ),
        },
      });
    }
  }

  // -------- Booking: meeting types --------
  await prisma.meetingType.deleteMany();
  await prisma.meetingType.createMany({
    data: [
      {
        slug: "discovery-call",
        nameEn: "Discovery Call",
        descriptionEn: "Quick intro to discuss your project at a high level.",
        durationMinutes: 30,
        order: 0,
      },
      {
        slug: "ux-ui-consultation",
        nameEn: "UX/UI Consultation",
        descriptionEn: "Deep dive into product design challenges and direction.",
        durationMinutes: 45,
        order: 1,
      },
      {
        slug: "project-discussion",
        nameEn: "Project Discussion",
        descriptionEn: "Scope, timeline, and pricing for a new engagement.",
        durationMinutes: 60,
        order: 2,
      },
    ],
  });

  // -------- Availability rules: Mon-Fri 10:00-17:00 --------
  await prisma.availabilityRule.deleteMany();
  for (let day = 1; day <= 5; day++) {
    await prisma.availabilityRule.create({
      data: { dayOfWeek: day, startTime: "10:00", endTime: "17:00" },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
