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
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { BookingStatusControl } from "./BookingStatusControl";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { format } from "date-fns";
import { deleteBooking } from "@/actions/admin";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { meetingType: true },
  });

  return (
    <div>
      <PageHeader title="Bookings" description="All booking requests from visitors." />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-white/50">
                    No bookings yet.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium">{b.name}</div>
                      {b.company ? <div className="text-xs text-white/40">{b.company}</div> : null}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{b.email}</div>
                      {b.phone ? <div className="text-xs text-white/40">{b.phone}</div> : null}
                    </TableCell>
                    <TableCell>
                      <div>{b.meetingType?.nameEn}</div>
                      <div className="text-xs text-white/40">{b.durationMinutes} min</div>
                    </TableCell>
                    <TableCell>
                      <div>{format(b.date, "EEE, MMM d")}</div>
                      <div className="text-xs text-white/40">{b.startTime}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <BookingStatusBadge status={b.status} />
                        <BookingStatusControl id={b.id} status={b.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-end">
                      <DeleteButton iconOnly action={deleteBooking.bind(null, b.id)} />
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
