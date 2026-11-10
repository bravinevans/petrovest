"use client";

import Link from "next/link";
import { Saira } from "@/utils/fonts";
import { cn } from "@/utils/helpers";

export interface BrandLogoProps {
  animate?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className }) => (
  <Link href="/" aria-label="Petrovest home" className="group">
    <span
      className={cn(
        "text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl",
        Saira.className,
        className,
      )}
    >
      Petrovest
    </span>
  </Link>
);

export default BrandLogo;
