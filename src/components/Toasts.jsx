export default function Toasts({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={"flex items-center gap-2.5 px-4 py-3 rounded-[10px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] border text-[14px] font-medium tracking-[-0.15px] leading-5 animate-[fadeIn_0.2s_ease-out] " + (t.type === "error" ? "bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]" : "bg-white border-[#e5e7eb] text-[#101828]")}>
          {t.type === "error"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
          {t.message}
        </div>
      ))}
    </div>
  );
}
