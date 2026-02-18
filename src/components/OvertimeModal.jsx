import { useState, useRef, useEffect } from "react";
import TimeSelect from "./TimeSelect";
import { formatHours } from "../utils";

export default function OvertimeModal({ onSave, onClose, employees, initial }) {
  const [empId, setEmpId] = useState(initial?.empId || employees[0]?.id || 0);
  const [day, setDay] = useState(initial?.day || 1);
  const [startH, setStartH] = useState(initial?.startH ?? 15);
  const [startM, setStartM] = useState(initial?.startM ?? 0);
  const [endH, setEndH] = useState(initial?.endH ?? 19);
  const [endM, setEndM] = useState(initial?.endM ?? 0);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const hours = (endH + endM / 60) - (startH + startM / 60);
  const save = () => { if (hours > 0 && empId) onSave({ empId, day, value: startH + ":" + String(startM).padStart(2,"0") + "-" + endH + ":" + String(endM).padStart(2,"0") }); };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div ref={ref} tabIndex={-1} className="bg-white rounded-lg shadow-xl p-5 min-w-[340px]" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter") save(); }}>
        <h3 className="font-bold text-sm mb-3 text-orange-700">Dodaj nadgodziny</h3>
        <div className="flex gap-3 mb-3">
          <div className="flex-1"><label className="text-xs text-gray-500 block mb-1">Pracownik</label>
            <select value={empId} onChange={e => setEmpId(+e.target.value)} className="border rounded px-2 py-1 text-sm w-full">{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}</select>
          </div>
          <div><label className="text-xs text-gray-500 block mb-1">Dzień</label><input type="number" min={1} max={31} value={day} onChange={e => setDay(+e.target.value)} className="border rounded px-2 py-1 text-sm w-16" /></div>
        </div>
        <div className="flex gap-4 mb-3">
          <div><label className="text-xs text-gray-500 block mb-1">Od</label><TimeSelect h={startH} m={startM} onChangeH={setStartH} onChangeM={setStartM} /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Do</label><TimeSelect h={endH} m={endM} onChangeH={setEndH} onChangeM={setEndM} /></div>
        </div>
        <div className="mb-4 text-sm">Czas: <span className={"font-bold " + (hours > 0 ? "text-orange-700" : "text-red-500")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
        <div className="flex gap-2">
          <button onClick={save} disabled={hours <= 0} className="px-4 py-1.5 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-40">Dodaj nadgodziny</button>
          <button onClick={onClose} className="px-4 py-1.5 bg-gray-100 rounded text-sm hover:bg-gray-200 ml-auto">Anuluj</button>
        </div>
      </div>
    </div>
  );
}
