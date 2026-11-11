import { FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NextPage } from "next";
const FAQ = dynamic(() => import("@/components/sections/About/FAQ"));

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

const AboutPage: NextPage = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-5">
        <Suspense>
          <FAQ />
        </Suspense>
        <div className="mt-2 flex flex-col items-center gap-2 border-t border-zinc-800/80 pt-5 text-center">
          <p className="text-sm text-zinc-400">
            Developed by{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={siteConfig.socials.github}
              className="font-semibold text-zinc-100 underline underline-offset-4 transition-colors hover:text-white"
            >
              bravinevans
            </Link>
          </p>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.socials.github}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <FaGithub size={20} />
            <span>github.com/bravinevans/petrovest</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
