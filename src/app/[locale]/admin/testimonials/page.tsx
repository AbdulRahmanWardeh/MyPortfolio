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
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/actions/admin";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Testimonials"
        actions={
          <InlineForm title="New testimonial" buttonLabel="New testimonial">
            {() => <Form action={createTestimonial} />}
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="font-medium">{t.author}</div>
                    <div className="text-xs text-white/40">{t.roleEn}</div>
                  </TableCell>
                  <TableCell>{t.company}</TableCell>
                  <TableCell>
                    {t.isFeatured ? <Badge variant="accent">Featured</Badge> : "—"}
                  </TableCell>
                  <TableCell>{t.order}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <InlineForm title="Edit testimonial" variant="edit">
                        {() => <Form action={updateTestimonial.bind(null, t.id)} defaults={t} />}
                      </InlineForm>
                      <DeleteButton iconOnly action={deleteTestimonial.bind(null, t.id)} />
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

function Form({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    author: string;
    roleEn: string;
    roleAr: string;
    company: string;
    avatarUrl: string | null;
    quoteEn: string;
    quoteAr: string;
    rating: number;
    isFeatured: boolean;
    order: number;
  };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Author</Label>
          <Input name="author" defaultValue={defaults?.author ?? ""} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Company</Label>
          <Input name="company" defaultValue={defaults?.company ?? ""} />
        </div>
      </div>
      <BilingualField
        label="Role"
        nameEn="roleEn"
        nameAr="roleAr"
        defaultEn={defaults?.roleEn}
        defaultAr={defaults?.roleAr}
      />
      <ImageUploadField label="Avatar" name="avatarUrl" defaultValue={defaults?.avatarUrl ?? ""} />
      <BilingualField
        label="Quote"
        nameEn="quoteEn"
        nameAr="quoteAr"
        defaultEn={defaults?.quoteEn}
        defaultAr={defaults?.quoteAr}
        textarea
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Rating (1-5)</Label>
          <Input name="rating" type="number" min={1} max={5} defaultValue={defaults?.rating ?? 5} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Order</Label>
          <Input name="order" type="number" defaultValue={defaults?.order ?? 0} />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={defaults?.isFeatured ?? false}
          className="h-4 w-4"
        />
        Featured
      </label>
      <div className="flex justify-end">
        <SubmitButton variant="accent">Save</SubmitButton>
      </div>
    </form>
  );
}
