"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { BreadcrumbItem, Breadcrumbs, Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { FaGithub } from "react-icons/fa6";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const pathName = usePathname();

  return (
    <footer
      className={cn(
        "bottom-0 flex w-full flex-col items-center justify-center gap-3 border-t border-zinc-800 bg-zinc-950 px-4 py-6 text-center text-zinc-300 md:px-8",
        className,
      )}
    >
      <p className="text-sm font-medium text-zinc-100">Petrovest Streaming</p>
      <p className="max-w-2xl text-xs leading-relaxed text-zinc-400">{siteConfig.description}</p>
      <Link
        isExternal
        href={siteConfig.socials.github}
        aria-label="Petrovest on GitHub"
        className="text-zinc-300 transition-colors hover:text-white"
      >
        <FaGithub size={20} />
      </Link>
      <Breadcrumbs
        separator="/"
        itemClasses={{
          separator: "px-2 text-zinc-600",
        }}
        classNames={{ list: "text-xs text-zinc-400" }}
      >
        {siteConfig.navItems.map(({ label, href }) => (
          <BreadcrumbItem key={href} isCurrent={pathName === href} href={href}>
            {label}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
      <p className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
        © {new Date().getFullYear()} Petrovest Streaming
      </p>
    </footer>
  );
};

export default Footer;
