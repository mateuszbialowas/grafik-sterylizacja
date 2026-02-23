import { useState } from "react";
import Modal from "./Modal";
import TimeSelect from "./TimeSelect";
import { formatHours, formatTimeRange, calcHourSpan } from "../utils";

export default function CustomShiftModal({ onSave, onClose, initial, empName, day, remainingHours }) {
  const [startH, setStartH] = useState(initial.startH);
  const [startM, setStartM] = useState(initial.startM);
  const [endH, setEndH] = useState(initial.endH);
  const [endM, setEndM] = useState(initial.endM);

  const hours = calcHourSpan(startH, startM, endH, endM);
  const remainingAfter = remainingHours - hours;
  const save = () => { if (hours > 0) onSave("C:" + formatTimeRange(startH, startM, endH, endM)); };

  return (
    <Modal onClose={onClose} onEnter={save}>
      <h3 className="text-[18px] font-semibold text-gray-900 tracking-[-0.44px] leading-7 mb-1">Zmiana niestandardowa</h3>
      <p className="text-[14px] text-gray-600 tracking-[-0.15px] leading-5 mb-5">{empName} — dzień {day}</p>
      <div className="flex gap-6 mb-5">
        <div>
          <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-[0.3px] leading-4 block mb-2">Od</label>
          <TimeSelect h={startH} m={startM} onChangeH={setStartH} onChangeM={setStartM} />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-[0.3px] leading-4 block mb-2">Do</label>
          <TimeSelect h={endH} m={endM} onChangeH={setEndH} onChangeM={setEndM} />
        </div>
      </div>
      <div className="mb-6 flex items-center gap-4">
        <div className="text-[16px] text-gray-900">Czas: <span className={"font-bold " + (hours > 0 ? "text-[#a3004c]" : "text-red-600")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
        {hours > 0 && <div className={"text-[14px] font-semibold tracking-[-0.15px] " + (Math.abs(remainingAfter) < 0.01 ? "text-[#016630]" : remainingAfter > 0 ? "text-red-600" : "text-[#d08700]")}>
          {Math.abs(remainingAfter) < 0.01 ? "Norma osiągnięta!" : remainingAfter > 0 ? "Brakuje " + formatHours(remainingAfter) + "h" : "Nadwyżka " + formatHours(Math.abs(remainingAfter)) + "h"}
        </div>}
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={() => onSave("")} className="h-10 px-5 bg-white border border-gray-200 rounded-lg text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-50">Wyczyść</button>
        <button onClick={onClose} className="h-10 px-5 bg-white border border-gray-200 rounded-lg text-[14px] font-medium text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-50">Anuluj</button>
        <button onClick={save} disabled={hours <= 0} className="h-10 px-5 bg-[#030213] text-white rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#1a1a2e] disabled:opacity-40">Zapisz</button>
      </div>
    </Modal>
  );
}
