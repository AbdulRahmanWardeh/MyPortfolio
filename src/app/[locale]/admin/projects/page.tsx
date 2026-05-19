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
import { deleteProject } from "@/actions/admin";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        actions={
          <Button asChild variant="accent" size="sm">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4" /> New project
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
                <TableHead>Category</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-white/50">
                    No projects yet.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.titleEn}</div>
                      <div className="text-xs text-white/40">/{p.slug}</div>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>
                      {p.isFeatured ? <Badge variant="accent">Featured</Badge> : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isPublished ? "success" : "default"}>
                        {p.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.order}</TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="text-white/60">
                          <Link href={`/admin/projects/${p.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteButton iconOnly action={deleteProject.bind(null, p.id)} />
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
