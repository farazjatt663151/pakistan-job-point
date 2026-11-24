interface AdSenseSlotProps {
  slotName: string;
  format: 'leaderboard' | 'infeed' | 'rectangle';
}

export function AdSenseSlot({ slotName, format }: AdSenseSlotProps) {
  const dimensions =
    format === 'leaderboard'
      ? 'min-h-[96px]'
      : format === 'rectangle'
      ? 'min-h-[250px]'
      : 'min-h-[120px]';

  const sizeHint =
    format === 'leaderboard'
      ? 'Responsive Leaderboard (728 × 90 desktop / 320 × 100 mobile)'
      : format === 'rectangle'
      ? 'Display Rectangle (300 × 250)'
      : 'In-Feed Native Ad Unit (Responsive)';

  return (
    <aside
      aria-label={`Advertisement slot: ${slotName}`}
      className="my-6 rounded-xl border border-dashed border-emerald-950/15 bg-white/70 p-4 text-center"
    >
      <div className="text-[11px] font-medium text-slate-500 mb-2">Advertisement</div>
      <div
        className={`flex flex-col items-center justify-center rounded-lg bg-[#F1F6F3] px-4 py-3 ${dimensions}`}
      >
        <p className="text-xs font-semibold text-slate-700">Google AdSense Placement — {slotName}</p>
        <p className="mt-1 text-[11px] text-slate-500">{sizeHint}</p>
        {/*
          Replace this placeholder container with your live AdSense <ins class="adsbygoogle"> unit
          after your domain is approved in Google AdSense.
        */}
      </div>
    </aside>
  );
}
