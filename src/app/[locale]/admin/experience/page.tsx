import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
import { BilingualField } from "@/components/admin/BilingualField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { createExperience, updateExperience, deleteExperience } from "@/actions/admin";

export default async function AdminExperiencePage() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Experience"
        actions={
          <InlineForm title="New experience" buttonLabel="New experience">
            {() => <ExpForm action={createExperience} />}
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="font-medium">{e.roleEn}</div>
                    <div className="text-xs text-white/40">{e.roleAr}</div>
                  </TableCell>
                  <TableCell>{e.company}</TableCell>
                  <TableCell className="text-white/60">
                    {format(e.startDate, "MMM yyyy")} —{" "}
                    {e.isCurrent ? "Present" : e.endDate ? format(e.endDate, "MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>{e.order}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <InlineForm title="Edit experience" variant="edit">
                        {() => (
                          <ExpForm
                            action={updateExperience.bind(null, e.id)}
                            defaults={{
                              ...e,
                              startDate: format(e.startDate, "yyyy-MM-dd"),
                              endDate: e.endDate ? format(e.endDate, "yyyy-MM-dd") : "",
                            }}
                          />
                        )}
                      </InlineForm>
                      <DeleteButton iconOnly action={deleteExperience.bind(null, e.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ExpForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    roleEn: string;
    roleAr: string;
    company: string;
    locationEn: string;
    locationAr: string;
    descriptionEn: string;
    descriptionAr: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    order: number;
  };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <BilingualField
        label="Role"
        nameEn="roleEn"
        nameAr="roleAr"
        defaultEn={defaults?.roleEn}
        defaultAr={defaults?.roleAr}
        required
      />
      <div className="flex flex-col gap-2">
        <Label>Company</Label>
        <Input name="company" defaultValue={defaults?.company ?? ""} required />
      </div>
      <BilingualField
        label="Location"
        nameEn="locationEn"
        nameAr="locationAr"
        defaultEn={defaults?.locationEn}
        defaultAr={defaults?.locationAr}
      />
      <BilingualField
        label="Description"
        nameEn="descriptionEn"
        nameAr="descriptionAr"
        defaultEn={defaults?.descriptionEn}
        defaultAr={defaults?.descriptionAr}
        textarea
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Start date</Label>
          <Input name="startDate" type="date" defaultValue={defaults?.startDate ?? ""} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>End date</Label>
          <Input name="endDate" type="date" defaultValue={defaults?.endDate ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Order</Label>
          <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          name="isCurrent"
          defaultChecked={defaults?.isCurrent ?? false}
          className="h-4 w-4"
        />
        Currently here
      </label>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
