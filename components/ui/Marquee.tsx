export default function Marquee({ items }: { items: readonly string[] }) {
  // Rendered twice back-to-back so the CSS translateX(-50%) loop is seamless.
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-5">
      <div className="flex w-max animate-marquee gap-[50px] whitespace-nowrap motion-reduce:animate-none">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-[50px] font-mono text-[12.5px] text-text-faint">
            <b className="font-medium text-text-dim">{item}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
