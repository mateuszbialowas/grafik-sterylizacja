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
  const hours = (endH + endM / 60) - (startH + startM / 60);
  const remainingAfter = remainingHours - hours;
  const save = () => { if (hours > 0) onSave("C:" + startH + ":" + String(startM).padStart(2,"0") + "-" + endH + ":" + String(endM).padStart(2,"0")); };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div ref={ref} tabIndex={-1} className="bg-white rounded-lg shadow-xl p-5 min-w-[300px]" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter") save(); }}>
        <h3 className="font-bold text-sm mb-1">Zmiana niestandardowa</h3>
        <p className="text-xs text-gray-500 mb-3">{empName} — dzień {day}</p>
        <div className="flex gap-4 mb-3">
          <div><label className="text-xs text-gray-500 block mb-1">Od</label><TimeSelect h={startH} m={startM} onChangeH={setStartH} onChangeM={setStartM} /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Do</label><TimeSelect h={endH} m={endM} onChangeH={setEndH} onChangeM={setEndM} /></div>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <div className="text-sm">Czas: <span className={"font-bold " + (hours > 0 ? "text-pink-700" : "text-red-500")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
          {hours > 0 && <div className={"text-xs font-semibold " + (Math.abs(remainingAfter) < 0.01 ? "text-green-600" : remainingAfter > 0 ? "text-red-500" : "text-amber-600")}>
            {Math.abs(remainingAfter) < 0.01 ? "✓ Norma osiągnięta!" : remainingAfter > 0 ? "Brakuje " + formatHours(remainingAfter) + "h" : "Nadwyżka " + formatHours(Math.abs(remainingAfter)) + "h"}
          </div>}
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={hours <= 0} className="px-4 py-1.5 bg-pink-600 text-white rounded text-sm hover:bg-pink-700 disabled:opacity-40">Zapisz</button>
          <button onClick={() => onSave("")} className="px-4 py-1.5 bg-gray-200 rounded text-sm hover:bg-gray-300">Wyczyść</button>
          <button onClick={onClose} className="px-4 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200 ml-auto">Anuluj</button>
        </div>
      </div>
    </div>
  );
}
