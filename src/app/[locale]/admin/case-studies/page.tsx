import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteCaseStudy } from "@/actions/admin";

export default async function AdminCaseStudiesPage() {
  const items = await prisma.caseStudy.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Case Studies"
        actions={
          <Button asChild variant="accent" size="sm">
            <Link href="/admin/case-studies/new">
              <Plus className="h-4 w-4" /> New case study
            </Link>
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-white/50">
                    No case studies yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.titleEn}</div>
                      <div className="text-xs text-white/40">/{c.slug}</div>
                    </TableCell>
                    <TableCell>{c._count.sections}</TableCell>
                    <TableCell>
                      {c.isFeatured ? <Badge variant="accent">Featured</Badge> : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.isPublished ? "success" : "default"}>
                        {c.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.order}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="text-white/60">
                          <Link href={`/admin/case-studies/${c.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton iconOnly action={deleteCaseStudy.bind(null, c.id)} />
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
