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
      nameAr: "عبدالرحمن",
      titleEn: "UX/UI Designer · Product Design",
      titleAr: "مصمم تجربة وواجهة المستخدم · تصميم منتجات",
      introEn:
        "I craft calm, premium digital products — turning complex problems into elegant interfaces people love.",
      introAr:
        "أصمم منتجات رقمية هادئة وراقية، وأحوّل المشكلات المعقدة إلى واجهات أنيقة يحبها المستخدمون.",
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
      headlineAr: "تصميم بنيّة. وبناء بعناية.",
      biographyEn:
        "I'm a product designer focused on UX research, interaction, and visual systems. Over the past several years I've helped startups and established teams ship intuitive, high-conversion products across web and mobile.",
      biographyAr:
        "أنا مصمم منتجات أركّز على أبحاث تجربة المستخدم والتفاعل وأنظمة التصميم. خلال السنوات الماضية، ساعدت شركات ناشئة وفِرَقاً راسخة في إطلاق منتجات بديهية عالية التحويل على الويب والجوال.",
      philosophyEn:
        "Great design is invisible. It removes friction, respects the user's attention, and gets out of the way so the product can shine.",
      philosophyAr:
        "التصميم الجيد لا يُلاحَظ. يزيل الاحتكاك ويحترم انتباه المستخدم ويُفسح المجال لجوهر المنتج كي يتألق.",
      experienceSummaryEn:
        "6+ years designing across SaaS, fintech, and consumer apps. Led design systems used by teams of 20+ engineers.",
      experienceSummaryAr:
        "أكثر من ٦ سنوات في تصميم منتجات SaaS والتقنيات المالية وتطبيقات المستهلكين. قُدتُ أنظمة تصميم تستخدمها فرق من أكثر من ٢٠ مهندساً.",
      profileImage: "/about.png",
      highlights: JSON.stringify([
        {
          titleEn: "Design systems",
          titleAr: "أنظمة التصميم",
          descEn: "Scalable, token-based component libraries.",
          descAr: "مكتبات مكوّنات قابلة للتوسّع قائمة على الرموز.",
        },
        {
          titleEn: "Research-driven",
          titleAr: "مبني على البحث",
          descEn: "Interviews, journeys, and usability tests.",
          descAr: "مقابلات ورحلات مستخدم واختبارات قابلية الاستخدام.",
        },
        {
          titleEn: "End-to-end",
          titleAr: "شامل من البداية للنهاية",
          descEn: "From discovery to handoff and QA.",
          descAr: "من الاكتشاف وحتى التسليم وضمان الجودة.",
        },
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
        roleAr: "مصمم منتجات أول",
        company: "Northwind Studio",
        locationEn: "Remote",
        locationAr: "عن بُعد",
        descriptionEn: "Leading design for a B2B analytics platform serving 40k+ users.",
        descriptionAr: "أقود تصميم منصة تحليلات B2B تخدم أكثر من ٤٠ ألف مستخدم.",
        startDate: new Date("2023-03-01"),
        isCurrent: true,
        order: 0,
      },
      {
        roleEn: "UX/UI Designer",
        roleAr: "مصمم تجربة وواجهة المستخدم",
        company: "Bluebird Labs",
        locationEn: "Dubai, UAE",
        locationAr: "دبي، الإمارات",
        descriptionEn: "Designed fintech onboarding flows and a shared design system.",
        descriptionAr: "صمّمت تدفقات تأهيل لمنتجات مالية ونظام تصميم مشترك.",
        startDate: new Date("2020-08-01"),
        endDate: new Date("2023-02-28"),
        order: 1,
      },
      {
        roleEn: "Junior UI Designer",
        roleAr: "مصمم واجهة مبتدئ",
        company: "Pixel & Co.",
        locationEn: "Amman, Jordan",
        locationAr: "عمّان، الأردن",
        descriptionEn: "Shipped marketing sites and early product UI for consumer apps.",
        descriptionAr: "أطلقتُ مواقع تسويقية وواجهات منتجات أولى لتطبيقات المستهلكين.",
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
        roleAr: "رئيسة المنتج",
        company: "Northwind",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn:
          "One of the most thoughtful designers I've worked with. Calm, sharp, and product-minded.",
        quoteAr:
          "من أكثر المصممين تأمّلاً ممن عملت معهم. هادئ وحاد وذو ذهنية منتج.",
        rating: 5,
        isFeatured: true,
        order: 0,
      },
      {
        author: "Omar Haddad",
        roleEn: "CEO",
        roleAr: "الرئيس التنفيذي",
        company: "Bluebird",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn:
          "Transformed our onboarding from a leaky funnel into our best-converting flow.",
        quoteAr:
          "حوّل تدفق التأهيل لدينا من قناة متسرّبة إلى أفضل تدفق تحويل لدينا.",
        rating: 5,
        isFeatured: true,
        order: 1,
      },
      {
        author: "Laila Mansour",
        roleEn: "Product Manager",
        roleAr: "مديرة منتج",
        company: "Acme",
        avatarUrl: PLACEHOLDER_AVATAR,
        quoteEn:
          "Every detail considered. Every interaction felt intentional. Highly recommended.",
        quoteAr:
          "كل تفصيل مدروس وكل تفاعل مقصود. أنصح به بشدّة.",
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
    titleAr: string;
    descEn: string;
    descAr: string;
    deliverables: Array<{ en: string; ar: string }>;
    timelineEn: string;
    timelineAr: string;
  }> = [
    {
      icon: "Search",
      titleEn: "UX Research",
      titleAr: "أبحاث تجربة المستخدم",
      descEn: "Interviews, surveys, and synthesis that uncover real user needs.",
      descAr: "مقابلات واستبيانات وتحليل يكشف احتياجات المستخدمين الحقيقية.",
      deliverables: [
        { en: "Research plan", ar: "خطة بحث" },
        { en: "User interviews", ar: "مقابلات مع المستخدمين" },
        { en: "Insight report", ar: "تقرير الرؤى" },
      ],
      timelineEn: "2-3 weeks",
      timelineAr: "٢-٣ أسابيع",
    },
    {
      icon: "Layout",
      titleEn: "UI Design",
      titleAr: "تصميم واجهة المستخدم",
      descEn: "Premium, on-brand interfaces refined to pixel-level precision.",
      descAr: "واجهات راقية متوافقة مع الهوية ومضبوطة بدقة البكسل.",
      deliverables: [
        { en: "High-fidelity screens", ar: "شاشات عالية الدقة" },
        { en: "Component library", ar: "مكتبة المكوّنات" },
        { en: "Style guide", ar: "دليل الأسلوب" },
      ],
      timelineEn: "3-5 weeks",
      timelineAr: "٣-٥ أسابيع",
    },
    {
      icon: "Smartphone",
      titleEn: "Mobile App Design",
      titleAr: "تصميم تطبيقات الجوال",
      descEn: "iOS & Android product design that feels native and delightful.",
      descAr: "تصميم منتجات iOS و Android بإحساس أصلي ومُمتع.",
      deliverables: [
        { en: "User flows", ar: "تدفقات المستخدم" },
        { en: "Screen designs", ar: "تصاميم الشاشات" },
        { en: "Prototype", ar: "نموذج تفاعلي" },
      ],
      timelineEn: "4-6 weeks",
      timelineAr: "٤-٦ أسابيع",
    },
    {
      icon: "Globe",
      titleEn: "Website Design",
      titleAr: "تصميم المواقع",
      descEn: "Marketing sites and product surfaces that convert.",
      descAr: "مواقع تسويقية وواجهات منتجات تحقّق التحويل.",
      deliverables: [
        { en: "Sitemap", ar: "خريطة الموقع" },
        { en: "Wireframes", ar: "إطارات سلكية" },
        { en: "Final design", ar: "التصميم النهائي" },
      ],
      timelineEn: "3-5 weeks",
      timelineAr: "٣-٥ أسابيع",
    },
    {
      icon: "Component",
      titleEn: "Design Systems",
      titleAr: "أنظمة التصميم",
      descEn: "Tokens, primitives, and patterns engineered to scale.",
      descAr: "رموز ومكوّنات وأنماط مصمّمة للتوسّع.",
      deliverables: [
        { en: "Token architecture", ar: "بنية الرموز" },
        { en: "Component library", ar: "مكتبة المكوّنات" },
        { en: "Documentation", ar: "التوثيق" },
      ],
      timelineEn: "6-10 weeks",
      timelineAr: "٦-١٠ أسابيع",
    },
    {
      icon: "PenLine",
      titleEn: "Wireframing",
      titleAr: "الإطارات السلكية",
      descEn: "Low-fidelity structure that locks in flow before pixels.",
      descAr: "هيكل منخفض الدقة يُثبّت التدفق قبل البكسل.",
      deliverables: [
        { en: "Wireframes", ar: "إطارات سلكية" },
        { en: "Flow diagrams", ar: "مخططات التدفق" },
      ],
      timelineEn: "1-2 weeks",
      timelineAr: "١-٢ أسبوع",
    },
    {
      icon: "MousePointerClick",
      titleEn: "Prototyping",
      titleAr: "النمذجة التفاعلية",
      descEn: "Interactive prototypes for stakeholder review and user testing.",
      descAr: "نماذج تفاعلية لمراجعة أصحاب المصلحة واختبار المستخدم.",
      deliverables: [
        { en: "Clickable prototype", ar: "نموذج قابل للنقر" },
        { en: "Interaction notes", ar: "ملاحظات التفاعل" },
      ],
      timelineEn: "1-3 weeks",
      timelineAr: "١-٣ أسابيع",
    },
    {
      icon: "ClipboardCheck",
      titleEn: "Usability Testing",
      titleAr: "اختبار قابلية الاستخدام",
      descEn: "Moderated and unmoderated tests with actionable findings.",
      descAr: "اختبارات مُدارة وغير مُدارة مع نتائج قابلة للتنفيذ.",
      deliverables: [
        { en: "Test plan", ar: "خطة الاختبار" },
        { en: "Session recordings", ar: "تسجيلات الجلسات" },
        { en: "Findings report", ar: "تقرير النتائج" },
      ],
      timelineEn: "2-3 weeks",
      timelineAr: "٢-٣ أسابيع",
    },
    {
      icon: "ScanSearch",
      titleEn: "UX Audit",
      titleAr: "تدقيق تجربة المستخدم",
      descEn: "Heuristic and accessibility review of your existing product.",
      descAr: "مراجعة استكشافية وإمكانية وصول لمنتجك الحالي.",
      deliverables: [
        { en: "Audit report", ar: "تقرير التدقيق" },
        { en: "Prioritized fixes", ar: "إصلاحات بحسب الأولوية" },
      ],
      timelineEn: "1-2 weeks",
      timelineAr: "١-٢ أسبوع",
    },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.create({
      data: {
        icon: s.icon,
        titleEn: s.titleEn,
        titleAr: s.titleAr,
        descriptionEn: s.descEn,
        descriptionAr: s.descAr,
        deliverables: JSON.stringify(s.deliverables),
        timelineEn: s.timelineEn,
        timelineAr: s.timelineAr,
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
      titleAr: "نورث ويند للتحليلات",
      shortDescEn: "B2B analytics dashboard redesigned for clarity.",
      shortDescAr: "لوحة تحليلات B2B أُعيد تصميمها لتحقيق الوضوح.",
      fullDescEn:
        "A complete redesign of Northwind's analytics platform — from information architecture to a fresh component system. Resulted in a 38% lift in weekly active users.",
      fullDescAr:
        "إعادة تصميم كاملة لمنصة تحليلات Northwind — من هندسة المعلومات إلى نظام مكوّنات جديد. أدّت إلى زيادة بنسبة ٣٨٪ في المستخدمين النشطين أسبوعياً.",
      category: "Web App",
      client: "Northwind",
      tags: "Fintech,Product Design",
      isFeatured: true,
      toolNames: ["Figma", "Framer", "Notion"],
    },
    {
      slug: "bluebird-banking",
      titleEn: "Bluebird Banking",
      titleAr: "بلوبيرد للخدمات المصرفية",
      shortDescEn: "Mobile-first banking experience for the next generation.",
      shortDescAr: "تجربة مصرفية تركّز على الجوّال للجيل القادم.",
      fullDescEn:
        "End-to-end product design for a neobank — onboarding, accounts, transfers, and budgeting. Native iOS & Android.",
      fullDescAr:
        "تصميم منتج شامل لبنك رقمي — التأهيل والحسابات والتحويلات وإدارة الميزانية. أصلي على iOS و Android.",
      category: "Mobile App",
      client: "Bluebird",
      tags: "Mobile,Fintech",
      isFeatured: true,
      toolNames: ["Figma", "After Effects"],
    },
    {
      slug: "saffron-commerce",
      titleEn: "Saffron Commerce",
      titleAr: "زعفران للتجارة",
      shortDescEn: "Headless commerce storefront with editorial soul.",
      shortDescAr: "واجهة متجر تجارة بلا رأس بروح تحريرية.",
      fullDescEn:
        "Direct-to-consumer storefront for a premium home brand — product discovery, configurator, and checkout.",
      fullDescAr:
        "متجر مباشر للمستهلك لعلامة منزلية فاخرة — اكتشاف المنتجات والمُكوِّن وإتمام الشراء.",
      category: "E-commerce",
      client: "Saffron Home",
      tags: "E-commerce,Branding",
      isFeatured: true,
      toolNames: ["Figma", "Photoshop"],
    },
    {
      slug: "atlas-travel",
      titleEn: "Atlas Travel",
      titleAr: "أطلس للسفر",
      shortDescEn: "Booking experience inspired by editorial magazines.",
      shortDescAr: "تجربة حجز مستوحاة من المجلات التحريرية.",
      fullDescEn:
        "Reimagining travel booking — destinations as stories, search as exploration.",
      fullDescAr:
        "إعادة تخيّل حجوزات السفر — الوجهات بوصفها قصصاً، والبحث بوصفه استكشافاً.",
      category: "Web App",
      client: "Atlas",
      tags: "Travel,Editorial",
      isFeatured: false,
      toolNames: ["Figma", "Illustrator"],
    },
    {
      slug: "lumen-design-system",
      titleEn: "Lumen Design System",
      titleAr: "نظام تصميم لومين",
      shortDescEn: "Tokenized design system powering five products.",
      shortDescAr: "نظام تصميم برموز يدعم خمسة منتجات.",
      fullDescEn:
        "From audit to delivery — a multi-brand, multi-platform design system with tokens, primitives, and patterns.",
      fullDescAr:
        "من التدقيق إلى التسليم — نظام تصميم متعدّد العلامات والمنصّات مع رموز ومكوّنات وأنماط.",
      category: "Design System",
      client: "Lumen Co.",
      tags: "Design System,SaaS",
      isFeatured: false,
      toolNames: ["Figma", "Notion"],
    },
    {
      slug: "harbor-health",
      titleEn: "Harbor Health",
      titleAr: "هاربور للرعاية الصحية",
      shortDescEn: "Patient portal redesigned with empathy and clarity.",
      shortDescAr: "بوابة مرضى أُعيد تصميمها بتعاطف ووضوح.",
      fullDescEn:
        "Care plans, appointments, and messaging — designed to reduce anxiety and improve adherence.",
      fullDescAr:
        "خطط الرعاية والمواعيد والرسائل — مصمّمة لتقليل القلق وتحسين الالتزام.",
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
        titleAr: p.titleAr,
        shortDescEn: p.shortDescEn,
        shortDescAr: p.shortDescAr,
        fullDescEn: p.fullDescEn,
        fullDescAr: p.fullDescAr,
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
            altAr: `${p.titleAr} شاشة ${n}`,
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
    "OVERVIEW",
    "PROBLEM",
    "GOAL",
    "ROLE",
    "TIMELINE",
    "RESEARCH",
    "INTERVIEWS",
    "AFFINITY",
    "PERSONAS",
    "JOURNEY",
    "FLOW",
    "WIREFRAMES",
    "DESIGN_SYSTEM",
    "FINAL_UI",
    "USABILITY",
    "ITERATIONS",
    "RESULTS",
    "LEARNINGS",
  ];

  const sectionTitle = (t: CaseStudySectionType) => {
    const m: Record<CaseStudySectionType, [string, string]> = {
      OVERVIEW: ["Overview", "نظرة عامة"],
      PROBLEM: ["Problem", "المشكلة"],
      GOAL: ["Goal", "الهدف"],
      ROLE: ["My Role", "دوري"],
      TIMELINE: ["Timeline", "الجدول الزمني"],
      RESEARCH: ["Research", "البحث"],
      INTERVIEWS: ["User Interviews", "مقابلات المستخدمين"],
      AFFINITY: ["Affinity Mapping", "خريطة التقارب"],
      PERSONAS: ["User Personas", "شخصيات المستخدمين"],
      JOURNEY: ["User Journey", "رحلة المستخدم"],
      FLOW: ["Flow Chart", "مخطط التدفق"],
      WIREFRAMES: ["Wireframes", "الإطارات السلكية"],
      DESIGN_SYSTEM: ["Design System", "نظام التصميم"],
      FINAL_UI: ["Final UI", "الواجهة النهائية"],
      USABILITY: ["Usability Testing", "اختبار قابلية الاستخدام"],
      ITERATIONS: ["Iterations", "التكرارات"],
      RESULTS: ["Results", "النتائج"],
      LEARNINGS: ["Learnings", "الدروس المستفادة"],
      CUSTOM: ["Custom Section", "قسم مخصّص"],
    };
    return m[t];
  };

  const caseStudies = [
    {
      slug: "northwind-analytics-case",
      titleEn: "Redesigning Northwind Analytics",
      titleAr: "إعادة تصميم تحليلات نورث ويند",
      summaryEn:
        "How a deep IA rework and a fresh component system lifted Northwind's WAU by 38%.",
      summaryAr:
        "كيف رفعت إعادة هندسة المعلومات ونظام مكوّنات جديد المستخدمين الأسبوعيين بنسبة ٣٨٪.",
      isFeatured: true,
    },
    {
      slug: "bluebird-onboarding-case",
      titleEn: "A calmer onboarding for Bluebird",
      titleAr: "تأهيل أكثر هدوءاً مع بلوبيرد",
      summaryEn:
        "From a leaky 6-step flow to a guided 3-step path — and a measurable win.",
      summaryAr:
        "من تدفق ٦ خطوات متسرّب إلى مسار ٣ خطوات موجَّه — مع مكسب قابل للقياس.",
      isFeatured: true,
    },
  ];

  for (const [i, c] of caseStudies.entries()) {
    const cs = await prisma.caseStudy.create({
      data: {
        slug: c.slug,
        titleEn: c.titleEn,
        titleAr: c.titleAr,
        summaryEn: c.summaryEn,
        summaryAr: c.summaryAr,
        coverImage: `${PLACEHOLDER_COVER}&sig=case${i + 1}`,
        isFeatured: c.isFeatured,
        order: i,
      },
    });

    for (const [j, type] of defaultSectionTypes.entries()) {
      const [titleEn, titleAr] = sectionTitle(type);
      const isMetrics = type === "RESULTS";
      const isGallery = type === "WIREFRAMES" || type === "FINAL_UI";
      const isBullets =
        type === "LEARNINGS" || type === "ITERATIONS" || type === "GOAL";

      await prisma.caseStudySection.create({
        data: {
          caseStudyId: cs.id,
          type,
          order: j,
          titleEn,
          titleAr,
          bodyEn:
            "Context, decisions, and outcomes for this section of the case study.",
          bodyAr: "السياق والقرارات والنتائج لهذا القسم من دراسة الحالة.",
          blocks: JSON.stringify(
            isMetrics
              ? [
                  {
                    kind: "metrics",
                    data: {
                      items: [
                        { labelEn: "WAU lift", labelAr: "زيادة المستخدمين أسبوعياً", value: "+38%" },
                        { labelEn: "Time to insight", labelAr: "زمن الوصول للرؤية", value: "-46%" },
                        { labelEn: "NPS", labelAr: "صافي المروّجين", value: "62" },
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
                        altAr: `${titleAr} ${n}`,
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
                        { en: "Insight one drawn from research.", ar: "رؤية أولى مستخلصة من البحث." },
                        { en: "Decision two that shaped the flow.", ar: "قرار ثانٍ شكّل التدفق." },
                        { en: "Outcome three measured post-launch.", ar: "نتيجة ثالثة قيست بعد الإطلاق." },
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
        nameAr: "مكالمة تعارف",
        descriptionEn: "Quick intro to discuss your project at a high level.",
        descriptionAr: "تعارف سريع لمناقشة مشروعك على مستوى عام.",
        durationMinutes: 30,
        order: 0,
      },
      {
        slug: "ux-ui-consultation",
        nameEn: "UX/UI Consultation",
        nameAr: "استشارة تجربة وواجهة المستخدم",
        descriptionEn: "Deep dive into product design challenges and direction.",
        descriptionAr: "مناقشة معمّقة لتحدّيات وتوجّه تصميم المنتج.",
        durationMinutes: 45,
        order: 1,
      },
      {
        slug: "project-discussion",
        nameEn: "Project Discussion",
        nameAr: "مناقشة مشروع",
        descriptionEn: "Scope, timeline, and pricing for a new engagement.",
        descriptionAr: "النطاق والجدول الزمني والتسعير لارتباط جديد.",
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
