import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InlineForm } from "@/components/admin/InlineForm";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  createAvailabilityRule,
  updateAvailabilityRule,
  deleteAvailabilityRule,
  addBlockedDate,
  deleteBlockedDate,
} from "@/actions/admin";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function AdminAvailabilityPage() {
  const [rules, blocked] = await Promise.all([
    prisma.availabilityRule.findMany({ orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Availability"
        description="Recurring weekly windows + one-off blocked dates."
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Weekly availability</CardTitle>
          <InlineForm title="New rule" buttonLabel="New rule">
            {() => <RuleForm action={createAvailabilityRule} />}
          </InlineForm>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-white/50">
                    No rules. Add at least one to allow bookings.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{DAYS[r.dayOfWeek]}</TableCell>
                    <TableCell>{r.startTime}</TableCell>
                    <TableCell>{r.endTime}</TableCell>
                    <TableCell>{r.isActive ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <InlineForm title="Edit rule" variant="edit">
                          {() => (
                            <RuleForm
                              action={updateAvailabilityRule.bind(null, r.id)}
                              defaults={r}
                            />
                          )}
                        </InlineForm>
                        <DeleteButton iconOnly action={deleteAvailabilityRule.bind(null, r.id)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Blocked dates</CardTitle>
          <InlineForm title="Block date" buttonLabel="Block date">
            {() => (
              <form action={addBlockedDate} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input name="date" type="date" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Reason</Label>
                  <Input name="reason" placeholder="e.g. Vacation" />
                </div>
                <div className="flex justify-end">
                  <SubmitButton variant="accent">Block</SubmitButton>
                </div>
              </form>
            )}
          </InlineForm>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocked.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center text-sm text-white/50">
                    No blocked dates.
                  </TableCell>
                </TableRow>
              ) : (
                blocked.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{format(b.date, "PPP")}</TableCell>
                    <TableCell className="text-white/60">{b.reason ?? "—"}</TableCell>
                    <TableCell className="text-end">
                      <DeleteButton iconOnly action={deleteBlockedDate.bind(null, b.id)} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RuleForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Day of week</Label>
        <Select name="dayOfWeek" defaultValue={String(defaults?.dayOfWeek ?? 1)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((d, i) => (
              <SelectItem key={i} value={String(i)}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Start time (24h)</Label>
          <Input name="startTime" defaultValue={defaults?.startTime ?? "10:00"} placeholder="HH:mm" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>End time (24h)</Label>
          <Input name="endTime" defaultValue={defaults?.endTime ?? "17:00"} placeholder="HH:mm" required />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={defaults?.isActive ?? true}
          className="h-4 w-4"
        />
        Active
      </label>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
