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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { createTool, updateTool, deleteTool } from "@/actions/admin";

export default async function AdminToolsPage() {
  const items = await prisma.tool.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Tools"
        actions={
          <InlineForm title="New tool" buttonLabel="New tool">
            <ToolForm action={createTool} />
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
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-white/50">
                    No tools yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>{t.order}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <InlineForm title="Edit tool" variant="edit">
                          <ToolForm
                            action={updateTool.bind(null, t.id)}
                            defaults={t}
                          />
                        </InlineForm>
                        <DeleteButton iconOnly action={deleteTool.bind(null, t.id)} />
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

function ToolForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: { name: string; category: string; iconUrl: string | null; order: number };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input name="name" defaultValue={defaults?.name ?? ""} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Input name="category" defaultValue={defaults?.category ?? "Design"} />
        </div>
      </div>
      <ImageUploadField label="Icon" name="iconUrl" defaultValue={defaults?.iconUrl ?? ""} />
      <div className="flex flex-col gap-2">
        <Label>Order</Label>
        <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
      </div>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
