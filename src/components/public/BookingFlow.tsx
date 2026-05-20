"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  ArrowLeft02Icon as ArrowLeft,
  ArrowRight02Icon as ArrowRight,
  Calendar03Icon as CalendarIcon,
  Tick02Icon as Check,
  Clock01Icon as Clock,
} from "hugeicons-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { pickField, type Locale } from "@/lib/i18n-helpers";

interface MeetingType {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  durationMinutes: number;
}

interface Props {
  locale: Locale;
  meetingTypes: MeetingType[];
  availableDaysOfWeek: number[];
  blockedDates: string[]; // YYYY-MM-DD
}

type Step = "type" | "date" | "time" | "details" | "done";

export function BookingFlow({
  locale,
  meetingTypes,
  availableDaysOfWeek,
  blockedDates,
}: Props) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const [step, setStep] = React.useState<Step>("type");
  const [meetingType, setMeetingType] = React.useState<MeetingType | null>(null);
  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<{ time: string; iso: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  React.useEffect(() => {
    if (step !== "time" || !date || !meetingType) return;
    setLoadingSlots(true);
    setSlots([]);
    fetch(
      `/api/availability?date=${format(date, "yyyy-MM-dd")}&meetingTypeId=${meetingType.id}`,
    )
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [step, date, meetingType]);

  const disabledFn = React.useCallback(
    (day: Date) => {
      if (day < new Date(new Date().setHours(0, 0, 0, 0))) return true;
      if (!availableDaysOfWeek.includes(day.getDay())) return true;
      if (blockedDates.includes(format(day, "yyyy-MM-dd"))) return true;
      return false;
    },
    [availableDaysOfWeek, blockedDates],
  );

  const submit = async () => {
    if (!meetingType || !date || !time) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingTypeId: meetingType.id,
          date: format(date, "yyyy-MM-dd"),
          startTime: time,
          ...form,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Failed");
      }
      setStep("done");
    } catch {
      setError(t("errors.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep("type");
    setMeetingType(null);
    setDate(undefined);
    setTime(null);
    setForm({ name: "", email: "", phone: "", company: "", message: "" });
    setError(null);
  };

  const steps: Step[] = ["type", "date", "time", "details", "done"];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="surface mx-auto w-full max-w-3xl p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between gap-4 text-xs uppercase tracking-wide text-white/40">
        {steps.slice(0, 4).map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full border text-[0.7rem]",
                i < stepIndex
                  ? "border-accent bg-accent text-accent-foreground"
                  : i === stepIndex
                  ? "border-white bg-white text-black"
                  : "border-white/[0.08] bg-white/[0.02] text-white/50",
              )}
            >
              {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={cn("hidden sm:inline", i === stepIndex && "text-white")}>
              {t(`steps.${s}`)}
            </span>
            {i < 3 ? (
              <div className="ms-2 hidden h-px flex-1 bg-white/10 md:block" />
            ) : null}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          {step === "type" && (
            <div className="grid gap-3">
              {meetingTypes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMeetingType(m);
                    setStep("date");
                  }}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-start transition hover:bg-white/[0.05]",
                  )}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] text-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-base font-medium">
                        {pickField(m, locale, "name")}
                      </div>
                      <div className="text-xs text-white/50">
                        {m.durationMinutes}m
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-white/55">
                      {pickField(m, locale, "description")}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-white/30 transition group-hover:text-white rtl:rotate-180" />
                </button>
              ))}
            </div>
          )}

          {step === "date" && meetingType && (
            <div className="flex flex-col gap-4">
              <BackButton onClick={() => setStep("type")} label={tCommon("back")} />
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    if (d) setStep("time");
                  }}
                  disabled={disabledFn}
                  weekStartsOn={locale === "ar" ? 6 : 1}
                />
              </div>
            </div>
          )}

          {step === "time" && meetingType && date && (
            <div className="flex flex-col gap-4">
              <BackButton onClick={() => setStep("date")} label={tCommon("back")} />
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "EEEE, MMMM d")}
              </div>
              {loadingSlots ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-xl bg-white/[0.03]"
                    />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="surface p-6 text-center text-sm text-white/60">
                  {t("noSlots")}
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => {
                        setTime(s.time);
                        setStep("details");
                      }}
                      className={cn(
                        "rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 text-sm transition hover:border-white/30 hover:bg-white/[0.05]",
                        time === s.time && "border-white bg-white text-black",
                      )}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "details" && meetingType && date && time && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.name || !form.email) return;
                submit();
              }}
            >
              <BackButton onClick={() => setStep("time")} label={tCommon("back")} />

              <div className="surface p-4 text-sm text-white/70">
                <div className="font-medium text-white">
                  {pickField(meetingType, locale, "name")} · {meetingType.durationMinutes}m
                </div>
                <div className="text-white/60">
                  {format(date, "EEEE, MMMM d")} · {time}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fields.name")} required>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Field>
                <Field label={t("fields.email")} required>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Field>
                <Field label={t("fields.phone")}>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </Field>
                <Field label={t("fields.company")}>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </Field>
              </div>
              <Field label={t("fields.message")}>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>

              {error ? (
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="mt-2 flex justify-end">
                <Button type="submit" variant="accent" size="lg" disabled={submitting}>
                  {submitting ? tCommon("loading") : t("confirm")}
                </Button>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="h-display text-2xl font-semibold">
                {t("confirmedTitle")}
              </h3>
              <p className="max-w-md text-sm text-white/60">{t("confirmedSubtitle")}</p>
              <Button variant="outline" onClick={reset}>
                {t("anotherBooking")}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-fit items-center gap-1.5 text-xs text-white/60 hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
      {label}
    </button>
  );
}
