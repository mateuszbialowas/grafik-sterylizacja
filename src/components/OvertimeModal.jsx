import { useState } from "react";
import Modal from "./Modal";
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
      <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.44px] leading-7 mb-5">Dodaj nadgodziny</h3>
      <div className="flex gap-4 mb-5">
        <div className="flex-1">
          <label className="text-[12px] font-semibold text-[#4a5565] uppercase tracking-[0.3px] leading-4 block mb-2">Pracownik</label>
          <select value={empId} onChange={e => setEmpId(+e.target.value)} className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-[16px] text-[#101828] w-full outline-none focus:border-[#a3b3ff]">
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-semibold text-[#4a5565] uppercase tracking-[0.3px] leading-4 block mb-2">Dzień</label>
          <input type="number" min={1} max={31} value={day} onChange={e => setDay(+e.target.value)} className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-[16px] font-semibold text-[#101828] w-20 outline-none focus:border-[#a3b3ff]" />
        </div>
      </div>
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
      <div className="mb-6 text-[16px] text-[#101828]">Czas: <span className={"font-bold " + (hours > 0 ? "text-[#f54900]" : "text-[#e7000b]")}>{hours > 0 ? formatHours(hours) + "h" : "nieprawidłowy"}</span></div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="h-10 px-5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f9fafb]">Anuluj</button>
        <button onClick={save} disabled={hours <= 0} className="h-10 px-5 bg-[#f54900] text-white rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#dc4100] disabled:opacity-40">Dodaj nadgodziny</button>
      </div>
    </Modal>
  );
}
