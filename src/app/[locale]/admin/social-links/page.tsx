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
import { Badge } from "@/components/ui/badge";
import { createSocial, updateSocial, deleteSocial } from "@/actions/admin";

export default async function AdminSocialPage() {
  const items = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Social Links"
        actions={
          <InlineForm title="New link" buttonLabel="New link">
            <SocialForm action={createSocial} />
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.platform}</TableCell>
                  <TableCell className="max-w-[260px] truncate text-white/60">
                    {s.url}
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.isActive ? "success" : "default"}>
                      {s.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <InlineForm title="Edit link" variant="edit">
                        <SocialForm action={updateSocial.bind(null, s.id)} defaults={s} />
                      </InlineForm>
                      <DeleteButton iconOnly action={deleteSocial.bind(null, s.id)} />
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

function SocialForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: { platform: string; url: string; isActive: boolean; order: number };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Platform</Label>
          <Input name="platform" defaultValue={defaults?.platform ?? ""} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Order</Label>
          <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>URL</Label>
        <Input name="url" type="url" defaultValue={defaults?.url ?? ""} required />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={defaults?.isActive ?? true}
          className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-accent"
        />
        Active
      </label>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
