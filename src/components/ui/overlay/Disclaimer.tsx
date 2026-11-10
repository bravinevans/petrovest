"use client";

import React from "react";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { Divider } from "@heroui/react";
import { useDisclosure } from "@mantine/hooks";

export default function Disclaimer() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
      >
        Disclaimer
      </button>

      <VaulDrawer open={opened} onClose={close} backdrop="blur" title="Disclaimer">
        <div className="space-y-4 px-6 text-sm font-mono text-zinc-400 leading-relaxed">
          <p>
            Petrovest Streaming operates strictly as a 3rd-party media directory indexing public, 
            keyless embed networks across the web layer. We do not host, store, stream, or modify 
            any video files directly on our platform infrastructure.
          </p>
          <p>
            All content queries pass through dynamic routing structures to isolated endpoints. 
            For compliance, intellectual property matters, or content inquiries, please contact 
            the respective media hosting and embed infrastructure networks directly.
          </p>
        </div>
        <Divider className="my-4 border-zinc-800" />
        <div className="px-6 pb-4 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="h-10 border border-zinc-700 bg-zinc-950 px-4 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            Close Window
          </button>
        </div>
      </VaulDrawer>
    </>
  );
}
