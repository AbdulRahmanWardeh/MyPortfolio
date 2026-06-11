"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BilingualFieldProps {
  label: string;
  nameEn: string;
  defaultEn?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}

export function BilingualField({
  label,
  nameEn,
  defaultEn = "",
  textarea,
  required,
  placeholder,
}: BilingualFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </Label>
      {textarea ? (
        <Textarea
          name={nameEn}
          defaultValue={defaultEn}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <Input
          name={nameEn}
          defaultValue={defaultEn}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
