import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`${title} – Pakistan Job Point`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const links = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 mr-1">
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
        Share:
      </span>
      {links.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[36px] items-center rounded-lg border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:border-emerald-700 hover:text-emerald-800"
        >
          {item.name}
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-emerald-950/15 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:border-emerald-700 hover:text-emerald-800"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}
