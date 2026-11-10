"use client";

import React from "react";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { Divider } from "@heroui/react";
import { useDisclosure } from "@mantine/hooks";
import { Share } from "@/utils/icons";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  XIcon,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookIcon,
  FacebookShareButton,
  LineShareButton,
  LineIcon,
  RedditIcon,
  RedditShareButton,
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";

export interface ShareButtonProps {
  title: string;
  id: string | number;
  type?: string;
}

const HASTAGS = ["petrovest", "free", "movies", "streaming"];

const SHARE_BUTTONS = [
  { label: "Facebook", Icon: FacebookIcon, Component: FacebookShareButton },
  { label: "WhatsApp", Icon: WhatsappIcon, Component: WhatsappShareButton },
  { label: "X (Twitter)", Icon: XIcon, Component: TwitterShareButton },
  { label: "LinkedIn", Icon: LinkedinIcon, Component: LinkedinShareButton },
  { label: "Line", Icon: LineIcon, Component: LineShareButton },
  { label: "Telegram", Icon: TelegramIcon, Component: TelegramShareButton },
  { label: "Reddit", Icon: RedditIcon, Component: RedditShareButton },
  { label: "Email", Icon: EmailIcon, Component: EmailShareButton },
];

export const ShareButton: React.FC<ShareButtonProps> = ({ title, id, type = "movie" }) => {
  const [opened, { open, close }] = useDisclosure(false);
  
  // Safely check for execution inside a browser window context
  const shareUrl = typeof window !== "undefined" 
    ? `https://${window.location.hostname}/${type}/${id}`
    : `https://petrovest.co.ke{type}/${id}`;
    
  const description = `Check out and stream ${title} on Petrovest for FREE!!`;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-10 items-center justify-center gap-2 border border-zinc-800 bg-zinc-950 px-4 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:bg-zinc-900 transition-colors"
      >
        <Share size={16} />
        <span>Share</span>
      </button>

      <VaulDrawer open={opened} onClose={close} backdrop="blur" title="Share via">
        <div className="space-y-8 px-6 pt-4">
          <div className="grid grid-cols-4 gap-x-5 gap-y-3 md:gap-x-10 md:gap-y-5">
            {SHARE_BUTTONS.map(({ Component, Icon, label }) => (
              <Component
                key={label}
                title={description}
                hashtags={HASTAGS}
                url={shareUrl}
                subject={description}
                onClick={close}
                className="flex flex-col items-center justify-center gap-2 text-zinc-300 hover:text-zinc-100"
              >
                <Icon className="rounded-none" size={40} />
                <span className="text-[10px] font-mono tracking-tight">{label}</span>
              </Component>
            ))}
          </div>
        </div>
        <Divider className="my-4 border-zinc-800" />
        <div className="px-6 pb-6 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="h-10 border border-zinc-700 bg-zinc-950 px-4 text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
          >
            Close
          </button>
        </div>
      </VaulDrawer>
    </>
  );
};

export default ShareButton;
