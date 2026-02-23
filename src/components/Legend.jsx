import { useState } from "react";

export default function Legend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-3 bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-clip">
      <button onClick={() => setOpen(!open)} className="w-full h-9 flex items-center justify-between px-3 rounded-lg hover:bg-[#f9fafb] transition-colors">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <span className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Legenda i skróty klawiszowe</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform duration-200 " + (open ? "rotate-180" : "")}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div className="bg-[#f9fafb] border-t border-[#e5e7eb] px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Rodzaje zmian</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#dbeafe] border-2 border-[#bedbff] flex items-center justify-center"><span className="text-[16px] font-bold text-[#193cb8] tracking-[-0.31px] leading-6">D</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Dyżur</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">7:00–19:00 (12 godzin)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#fef3c6] border-2 border-[#fee685] flex items-center justify-center"><span className="text-[16px] font-bold text-[#973c00] tracking-[-0.31px] leading-6">D*</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Dyżur alternatywny</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">8:00–20:00 (12 godzin)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#dcfce7] border-2 border-[#b9f8cf] flex items-center justify-center"><span className="text-[16px] font-bold text-[#016630] tracking-[-0.31px] leading-6">R</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Ranna zmiana</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">7:00–14:35 (7:35h)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#f3e8ff] border-2 border-[#e9d5ff] flex items-center justify-center"><span className="text-[20px] font-bold text-[#6b21a8] leading-6">•</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Pod telefonem</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Niedziela — dyżur telefoniczny</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#fce7f3] border-2 border-[#fccee8] flex items-center justify-center"><span className="text-[12px] font-bold text-[#a3004c] leading-4">NS</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Godziny niestandardowe</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Zmiana z custom godzinami</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#f3f4f6] border-2 border-[#e5e7eb] flex items-center justify-center"><span className="text-[16px] font-normal text-[#99a1af] tracking-[-0.31px] leading-6">—</span></div>
                  <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Wolne</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Dzień wolny od pracy</div></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Skróty klawiszowe i akcje</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Zmień zmianę (cykl: wolne → D → D* → R)</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Prawy klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Menu zmian + notatki</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Shift + klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Dodaj notatkę</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Prawy klik na nazwisko</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Edytuj lub usuń pracownika</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Prawy klik na normę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Edytuj indywidualną normę godzinową</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap shrink-0">Prawy klik na dni robocze</kbd><span className="text-[13px] sm:text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Zmień liczbę dni roboczych w miesiącu</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
