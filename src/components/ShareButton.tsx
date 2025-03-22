"use client";

import { useRef, useState } from "react";
import { FiTwitter } from "react-icons/fi";
import { FaWeixin, FaWeibo } from "react-icons/fa";
import Popover from "./ui/Popover";
import QRCode from "./ui/QRCode";

interface ShareButtonProps {
  title: string;
  path: string;
}

export default function ShareButton({ title, path }: ShareButtonProps) {
  const shareUrl = `https://lispking.github.io/${path}`;
  const shareText = `${title} | King 的博客`;

  const handleTwitterShare = () => {
    const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterShareUrl, "_blank");
  };

  const handleWeiboShare = () => {
    const weiboShareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(shareText)}`;
    window.open(weiboShareUrl, "_blank");
  };

  const [isQRCodePopoverOpen, setIsQRCodePopoverOpen] = useState(false);
  const wechatButtonRef = useRef<HTMLButtonElement>(null);

  const handleWeChatShare = () => {
    setIsQRCodePopoverOpen(true);
  };

  return (
    <div className="inline-flex items-center gap-3">
      <button
        onClick={handleTwitterShare}
        className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
        title="分享到 Twitter"
      >
        <FiTwitter className="w-5 h-5" />
      </button>
      <button
        onClick={handleWeiboShare}
        className="text-red-500 hover:text-red-600 transition-colors duration-200"
        title="分享到微博"
      >
        <FaWeibo className="w-5 h-5" />
      </button>
      <button
        ref={wechatButtonRef}
        onClick={handleWeChatShare}
        className="text-green-600 hover:text-green-700 transition-colors duration-200"
        title="分享到微信"
      >
        <FaWeixin className="w-5 h-5" />
      </button>

      <Popover
        isOpen={isQRCodePopoverOpen}
        onClose={() => setIsQRCodePopoverOpen(false)}
        triggerRef={wechatButtonRef as React.RefObject<HTMLElement>}
      >
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-2">微信扫码分享</h3>
          <QRCode url={shareUrl} size={150} />
          <p className="mt-2 text-xs text-gray-500">请使用微信扫描二维码分享</p>
        </div>
      </Popover>
    </div>
  );
}
