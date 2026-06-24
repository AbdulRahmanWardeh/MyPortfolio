"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-white/[0.08] bg-[#0f0f10] text-white shadow-2xl",
          description: "text-white/60",
          actionButton: "bg-white text-black",
        },
      }}
    />
  );
}
