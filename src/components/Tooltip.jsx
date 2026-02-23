export default function Tooltip({ text, children }) {
  return (
    <span className="relative group/tip">
      {children}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50">{text}</span>
    </span>
  );
}
