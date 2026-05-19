"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BilingualFieldProps {
  label: string;
  nameEn: string;
  nameAr: string;
  defaultEn?: string;
  defaultAr?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}

export function BilingualField({
  label,
  nameEn,
  nameAr,
  defaultEn = "",
  defaultAr = "",
  textarea,
  required,
  placeholder,
}: BilingualFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{label}{required ? <span className="text-accent"> *</span> : null}</Label>
      <Tabs defaultValue="en">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>
        <TabsContent value="en">
          {textarea ? (
            <Textarea
              name={nameEn}
              defaultValue={defaultEn}
              required={required}
              placeholder={placeholder}
              dir="ltr"
            />
          ) : (
            <Input
              name={nameEn}
              defaultValue={defaultEn}
              required={required}
              placeholder={placeholder}
              dir="ltr"
            />
          )}
        </TabsContent>
        <TabsContent value="ar">
          {textarea ? (
            <Textarea
              name={nameAr}
              defaultValue={defaultAr}
              required={required}
              placeholder={placeholder}
              dir="rtl"
            />
          ) : (
            <Input
              name={nameAr}
              defaultValue={defaultAr}
              required={required}
              placeholder={placeholder}
              dir="rtl"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
