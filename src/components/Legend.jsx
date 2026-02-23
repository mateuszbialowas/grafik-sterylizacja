import { useState } from "react";
import { IconInfo, IconChevronDown } from "./Icons";

export default function Legend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-3 bg-white rounded-[14px] border border-gray-200 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-clip">
      <button onClick={() => setOpen(!open)} className="w-full h-9 flex items-center justify-between px-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <IconInfo />
          <span className="text-[14px] font-semibold text-gray-900 tracking-[-0.15px] leading-5">Legenda i skróty klawiszowe</span>
        </div>
        <IconChevronDown className={"transition-transform duration-200 " + (open ? "rotate-180" : "")} />
      </button>
      {open && (
        <div className="bg-gray-50 border-t border-gray-200 px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-semibold text-gray-900 tracking-[-0.15px] leading-5">Rodzaje zmian</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#dbeafe] border-2 border-[#bedbff] flex items-center justify-center"><span className="text-[16px] font-bold text-[#193cb8] tracking-[-0.31px] leading-6">D</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Dyżur</div><div className="text-[12px] font-normal text-gray-600 leading-4">7:00–19:00 (12 godzin)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#fef3c6] border-2 border-[#fee685] flex items-center justify-center"><span className="text-[16px] font-bold text-[#973c00] tracking-[-0.31px] leading-6">D*</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Dyżur alternatywny</div><div className="text-[12px] font-normal text-gray-600 leading-4">8:00–20:00 (12 godzin)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#dcfce7] border-2 border-[#b9f8cf] flex items-center justify-center"><span className="text-[16px] font-bold text-[#016630] tracking-[-0.31px] leading-6">R</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Ranna zmiana</div><div className="text-[12px] font-normal text-gray-600 leading-4">7:00–14:35 (7:35h)</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#f3e8ff] border-2 border-[#e9d5ff] flex items-center justify-center"><span className="text-[20px] font-bold text-[#6b21a8] leading-6">•</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Pod telefonem</div><div className="text-[12px] font-normal text-gray-600 leading-4">Niedziela — dyżur telefoniczny</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-[#fce7f3] border-2 border-[#fccee8] flex items-center justify-center"><span className="text-[12px] font-bold text-[#a3004c] leading-4">NS</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Godziny niestandardowe</div><div className="text-[12px] font-normal text-gray-600 leading-4">Zmiana z custom godzinami</div></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded bg-gray-100 border-2 border-gray-200 flex items-center justify-center"><span className="text-[16px] font-normal text-gray-400 tracking-[-0.31px] leading-6">—</span></div>
                  <div><div className="text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5">Wolne</div><div className="text-[12px] font-normal text-gray-600 leading-4">Dzień wolny od pracy</div></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-semibold text-gray-900 tracking-[-0.15px] leading-5">Skróty klawiszowe i akcje</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Zmień zmianę (cykl: wolne → D → D* → R)</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Prawy klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Menu zmian + notatki</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Shift + klik na komórkę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Dodaj notatkę</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Prawy klik na nazwisko</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Edytuj lub usuń pracownika</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Prawy klik na normę</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Edytuj indywidualną normę godzinową</span></div>
                <div className="flex items-start sm:items-center gap-2 flex-wrap sm:flex-nowrap"><kbd className="h-6.5 px-2 py-1 bg-white border border-gray-300 rounded text-[12px] font-mono text-neutral-950 leading-4 whitespace-nowrap shrink-0">Prawy klik na dni robocze</kbd><span className="text-[13px] sm:text-[14px] font-normal text-gray-600 tracking-[-0.15px] leading-5">Zmień liczbę dni roboczych w miesiącu</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
