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
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/actions/admin";

export default async function AdminSkillsPage() {
  const items = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Skills"
        actions={
          <InlineForm title="New skill" buttonLabel="New skill">
            {() => <SkillForm action={createSkill} />}
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-white/50">
                    No skills yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.nameEn}</div>
                      <div className="text-xs text-white/40">{s.nameAr}</div>
                    </TableCell>
                    <TableCell>{s.category}</TableCell>
                    <TableCell>{s.level}%</TableCell>
                    <TableCell>{s.order}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <InlineForm title="Edit skill" variant="edit">
                          {() => (
                            <SkillForm
                              action={updateSkill.bind(null, s.id)}
                              defaults={s}
                            />
                          )}
                        </InlineForm>
                        <DeleteButton iconOnly action={deleteSkill.bind(null, s.id)} />
                      </div>
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

function SkillForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: { nameEn: string; nameAr: string; category: string; level: number; order: number };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <BilingualField
        label="Name"
        nameEn="nameEn"
        nameAr="nameAr"
        defaultEn={defaults?.nameEn}
        defaultAr={defaults?.nameAr}
        required
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Input name="category" defaultValue={defaults?.category ?? "Design"} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Level (0-100)</Label>
          <Input name="level" type="number" min={0} max={100} defaultValue={defaults?.level ?? 80} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Order</Label>
          <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
