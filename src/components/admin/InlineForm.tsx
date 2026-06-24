"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";

interface Props {
  title: string;
  trigger?: React.ReactNode;
  buttonLabel?: string;
  variant?: "create" | "edit";
  children: React.ReactNode;
}

export function InlineForm({
  title,
  trigger,
  buttonLabel,
  variant = "create",
  children,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          variant === "create" ? (
            <Button variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              {buttonLabel ?? "Create new"}
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
