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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createFaq, updateFaq, deleteFaq } from "@/actions/admin";

export default async function AdminFaqPage() {
  const items = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Questions shown in the FAQ section on the home page."
        actions={
          <InlineForm title="New question" buttonLabel="New question">
            <FaqForm action={createFaq} />
          </InlineForm>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-sm text-white/50"
                  >
                    No questions yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="max-w-[420px] truncate font-medium">
                      {f.questionEn}
                    </TableCell>
                    <TableCell>
                      <Badge variant={f.isActive ? "success" : "default"}>
                        {f.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>{f.order}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <InlineForm title="Edit question" variant="edit">
                          <FaqForm
                            action={updateFaq.bind(null, f.id)}
                            defaults={f}
                          />
                        </InlineForm>
                        <DeleteButton
                          iconOnly
                          action={deleteFaq.bind(null, f.id)}
                        />
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

function FaqForm({
  action,
  defaults,
}: {
  action: (fd: FormData) => Promise<void>;
  defaults?: {
    questionEn: string;
    answerEn: string;
    isActive: boolean;
    order: number;
  };
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Question</Label>
        <Input
          name="questionEn"
          defaultValue={defaults?.questionEn ?? ""}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Answer</Label>
        <Textarea
          name="answerEn"
          defaultValue={defaults?.answerEn ?? ""}
          className="min-h-[140px]"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Order</Label>
        <Input
          name="order"
          type="number"
          defaultValue={defaults?.order ?? 0}
        />
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
