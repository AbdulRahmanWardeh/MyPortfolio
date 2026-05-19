import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@prisma/client";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { variant: "default" | "success" | "destructive" | "warning"; label: string }> = {
    PENDING: { variant: "warning", label: "Pending" },
    CONFIRMED: { variant: "success", label: "Confirmed" },
    CANCELLED: { variant: "destructive", label: "Cancelled" },
    COMPLETED: { variant: "default", label: "Completed" },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
