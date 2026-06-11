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
import { Badge } from "@/components/ui/badge";
import {
  createMeetingType,
  updateMeetingType,
  deleteMeetingType,
} from "@/actions/admin";

export default async function AdminMeetingTypesPage() {
  const items = await prisma.meetingType.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Meeting Types"
        description="Booking options visitors can choose from."
        actions={
          <InlineForm title="New meeting type" buttonLabel="New meeting type">
            {() => <MtForm action={createMeetingType} />}
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.nameEn}</div>
                  </TableCell>
                  <TableCell>{m.durationMinutes} min</TableCell>
                  <TableCell>
                    <Badge variant={m.isActive ? "success" : "default"}>
                      {m.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>{m.order}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <InlineForm title="Edit meeting type" variant="edit">
                        {() => <MtForm action={updateMeetingType.bind(null, m.id)} defaults={m} />}
                      </InlineForm>
                      <DeleteButton iconOnly action={deleteMeetingType.bind(null, m.id)} />
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

function MtForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    slug: string;
    nameEn: string;
    descriptionEn: string;
    durationMinutes: number;
    isActive: boolean;
    order: number;
  };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <BilingualField label="Name" nameEn="nameEn" defaultEn={defaults?.nameEn} required />
      <BilingualField label="Description" nameEn="descriptionEn" defaultEn={defaults?.descriptionEn} textarea />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Slug</Label>
          <Input name="slug" defaultValue={defaults?.slug ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Duration (min)</Label>
          <Input
            name="durationMinutes"
            type="number"
            defaultValue={defaults?.durationMinutes ?? 30}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Order</Label>
          <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
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
