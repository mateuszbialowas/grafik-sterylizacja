import { useRef, useEffect } from "react";

export default function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div ref={ref} tabIndex={-1} className="bg-white rounded-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.15)] p-6 min-w-[380px] max-w-[440px]" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter") onConfirm(); }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="size-10 rounded-full bg-[#fef2f2] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.44px] leading-7 mb-1">{title}</h3>
            <p className="text-[14px] text-[#4a5565] tracking-[-0.15px] leading-5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="h-10 px-5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f9fafb]">Anuluj</button>
          <button onClick={onConfirm} className={"h-10 px-5 rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 text-white " + (confirmColor || "bg-[#e7000b] hover:bg-[#c10007]")}>{confirmLabel || "Usuń"}</button>
        </div>
      </div>
    </div>
  );
}
