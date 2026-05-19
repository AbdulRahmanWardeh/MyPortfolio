"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus } from "@/actions/admin";
import type { BookingStatus } from "@prisma/client";
import { toast } from "sonner";

const OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
];

export function BookingStatusControl({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [value, setValue] = React.useState<BookingStatus>(status);
  const [busy, setBusy] = React.useState(false);

  const onChange = async (v: string) => {
    setValue(v as BookingStatus);
    setBusy(true);
    try {
      await updateBookingStatus(id, v as BookingStatus);
      toast.success("Status updated");
    } catch {
      toast.error("Could not update");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Select value={value} onValueChange={onChange} disabled={busy}>
      <SelectTrigger className="h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
