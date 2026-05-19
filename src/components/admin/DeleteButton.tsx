"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";

export function DeleteButton({
  action,
  label = "Delete",
  iconOnly,
}: {
  action: () => Promise<void>;
  label?: string;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        type="button"
        variant={iconOnly ? "ghost" : "outline"}
        size={iconOnly ? "icon" : "sm"}
        onClick={() => setOpen(true)}
        className={iconOnly ? "text-white/60 hover:text-red-400" : ""}
      >
        <Trash2 className="h-4 w-4" />
        {!iconOnly ? <span className="ms-1">{label}</span> : null}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={async () => {
          try {
            await action();
            toast.success("Deleted");
          } catch {
            toast.error("Could not delete");
          }
        }}
      />
    </>
  );
}
