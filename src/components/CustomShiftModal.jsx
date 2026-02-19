import { useState, useRef, useEffect } from "react";
import TimeSelect from "./TimeSelect";
import { formatHours } from "../utils";

export default function CustomShiftModal({ onSave, onClose, initial, empName, day, remainingHours }) {
  const [startH, setStartH] = useState(initial.startH);
  const [startM, setStartM] = useState(initial.startM);
  const [endH, setEndH] = useState(initial.endH);
  const [endM, setEndM] = useState(initial.endM);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const start = startH + startM / 60;
  const end = endH + endM / 60;
  const hours = start === end ? 0 : end > start ? end - start : 24 - start + end;
  const remainingAfter = remainingHours - hours;
  const save = () => { if (hours > 0) onSave("C:" + startH + ":" + String(startM).padStart(2,"0") + "-" + endH + ":" + String(endM).padStart(2,"0")); };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div ref={ref} tabIndex={-1} className="bg-white rounded-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.15)] p-6 min-w-[420px]" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter") save(); }}>
        <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.44px] leading-7 mb-1">Zmiana niestandardowa</h3>
        <p className="text-[14px] text-[#4a5565] tracking-[-0.15px] leading-5 mb-5">{empName} — dzień {day}</p>
        <div className="flex gap-6 mb-5">
          <div>
            <label className="text-[12px] font-semibold text-[#4a5565] uppercase tracking-[0.3px] leading-4 block mb-2">Od</label>
            <TimeSelect h={startH} m={startM} onChangeH={setStartH} onChangeM={setStartM} />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#4a5565] uppercase tracking-[0.3px] leading-4 block mb-2">Do</label>
            <TimeSelect h={endH} m={endM} onChangeH={setEndH} onChangeM={setEndM} />
          </div>
        </div>
        <div className="mb-6 flex items-center gap-4">
          <div className="text-[16px] text-[#101828]">Czas: <span className={"font-bold " + (hours > 0 ? "text-[#a3004c]" : "text-[#e7000b]")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
          {hours > 0 && <div className={"text-[14px] font-semibold tracking-[-0.15px] " + (Math.abs(remainingAfter) < 0.01 ? "text-[#016630]" : remainingAfter > 0 ? "text-[#e7000b]" : "text-[#d08700]")}>
            {Math.abs(remainingAfter) < 0.01 ? "Norma osiągnięta!" : remainingAfter > 0 ? "Brakuje " + formatHours(remainingAfter) + "h" : "Nadwyżka " + formatHours(Math.abs(remainingAfter)) + "h"}
          </div>}
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => onSave("")} className="h-10 px-5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f9fafb]">Wyczyść</button>
          <button onClick={onClose} className="h-10 px-5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f9fafb]">Anuluj</button>
          <button onClick={save} disabled={hours <= 0} className="h-10 px-5 bg-[#030213] text-white rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#1a1a2e] disabled:opacity-40">Zapisz</button>
        </div>
      </div>
    </div>
  );
}
