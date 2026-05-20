/**
 * String-literal unions that replace Prisma-generated enums (so the schema can
 * run on either SQLite or Postgres).
 */
export type UserRole = "ADMIN";

export type CaseStudySectionType =
  | "OVERVIEW"
  | "PROBLEM"
  | "GOAL"
  | "ROLE"
  | "TIMELINE"
  | "RESEARCH"
  | "INTERVIEWS"
  | "AFFINITY"
  | "PERSONAS"
  | "JOURNEY"
  | "FLOW"
  | "WIREFRAMES"
  | "DESIGN_SYSTEM"
  | "FINAL_UI"
  | "USABILITY"
  | "ITERATIONS"
  | "RESULTS"
  | "LEARNINGS"
  | "CUSTOM";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
