import { useState } from "react";
import { useSchedule } from "../context/ScheduleContext";

export default function AddEmployeeRow() {
  const { daysInMonth, addEmployee } = useSchedule();
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addEmployee(newName);
    setNewName("");
  };

  return (
    <tr>
      <td className="border border-[#e5e7eb]" colSpan={daysInMonth + 3} style={{ height: 44, padding: 0 }}>
        <div className="sticky left-0 px-2 py-1.5" style={{ width: 'min(100%, calc(100vw - 1rem))' }}>
          <div className="flex gap-2 items-center">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
              className="flex-1 h-8 px-2.5 py-0.5 text-[14px] tracking-[-0.15px] bg-[#f3f3f5] rounded-lg border border-transparent outline-none placeholder:text-[#717182]"
              placeholder="+ Dodaj pracownika..."
            />
            <button onClick={handleAdd} className="h-8 px-3 bg-[#030213] text-white text-[13px] font-medium tracking-[-0.15px] leading-5 rounded-lg hover:bg-[#1a1a2e] shrink-0">
              Dodaj
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
