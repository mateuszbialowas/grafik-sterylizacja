import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import TimeSelect from "./TimeSelect";
import { formatHours, formatTimeRange, calcHourSpan } from "../utils";

export default function OvertimeModal({ onSave, onClose, employees, initial }) {
  const [empId, setEmpId] = useState(initial?.empId || employees[0]?.id || 0);
  const [day, setDay] = useState(initial?.day || 1);
  const [startH, setStartH] = useState(initial?.startH ?? 15);
  const [startM, setStartM] = useState(initial?.startM ?? 0);
  const [endH, setEndH] = useState(initial?.endH ?? 19);
  const [endM, setEndM] = useState(initial?.endM ?? 0);

  const hours = calcHourSpan(startH, startM, endH, endM);
  const save = () => { if (hours > 0 && empId) onSave({ empId, day, value: formatTimeRange(startH, startM, endH, endM) }); };

  return (
    <Modal onClose={onClose} onEnter={save}>
      <h3 className="text-[18px] font-semibold text-gray-900 tracking-[-0.44px] leading-7 mb-5">Dodaj nadgodziny</h3>
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-[0.3px] leading-4 block mb-2">Pracownik</label>
          <select value={empId} onChange={e => setEmpId(+e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[16px] text-gray-900 w-full outline-none focus:border-[#a3b3ff]">
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-[0.3px] leading-4 block mb-2">Dzień</label>
          <input type="number" min={1} max={31} value={day} onChange={e => setDay(+e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[16px] font-semibold text-gray-900 w-20 outline-none focus:border-[#a3b3ff]" />
        </div>
      </div>
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
      <div className="mb-6 text-[16px] text-gray-900">Czas: <span className={"font-bold " + (hours > 0 ? "text-[#f54900]" : "text-red-600")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
      <div className="flex gap-3 justify-end">
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="orange" onClick={save} disabled={hours <= 0}>Dodaj nadgodziny</Button>
      </div>
    </Modal>
  );
}
