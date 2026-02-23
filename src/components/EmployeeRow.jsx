import { useState, useCallback } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { isWeekend, formatHours } from "../utils";
import { COL_WIDTH, ROW_HEIGHT } from "../constants";
import ShiftCell from "./ShiftCell";
import Tooltip from "./Tooltip";

export default function EmployeeRow({ employee }) {
  const {
    year, month, shifts, requests, normOverrides, daysInMonth, monthlyNorm,
    setData, cycleShift, getEmpNorm, calcHours,
    openShiftMenu, openEmpMenu, setNoteModal,
    editingEmployeeId, setEditingEmployeeId,
  } = useSchedule();

  const isEditingName = editingEmployeeId === employee.id;
  const [isEditingNorm, setIsEditingNorm] = useState(false);

  const empNorm = getEmpNorm(employee.id);
  const hours = calcHours(employee.id);
  const diff = hours - empNorm;

  const openCellContextMenu = useCallback((e, day) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    openShiftMenu({ empId: employee.id, day, x: rect.left, y: rect.bottom, hasNote: !!(requests[employee.id]?.[day]) });
  }, [employee.id, requests, openShiftMenu]);

  const handleRequestClick = useCallback((day) => {
    setNoteModal({ empId: employee.id, day, empName: employee.name, current: requests[employee.id]?.[day] || "" });
  }, [employee, requests, setNoteModal]);

  return (
    <tr>
      <td
        className="border border-gray-200 px-1.5 py-0 sticky left-0 bg-white z-20 overflow-hidden"
        style={{ width: COL_WIDTH.name, minWidth: COL_WIDTH.name, maxWidth: COL_WIDTH.name, height: ROW_HEIGHT.employee }}
        onContextMenu={e => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          openEmpMenu({ empId: employee.id, empName: employee.name, x: rect.left, y: rect.bottom });
        }}
      >
        {isEditingName ? (
          <input
            autoFocus
            defaultValue={employee.name}
            className="border border-gray-200 rounded px-1 py-0.5 text-[13px] w-full outline-none"
            onBlur={e => {
              const val = e.target.value.trim();
              if (val) setData(prev => ({ ...prev, employees: prev.employees.map(emp => emp.id === employee.id ? { ...emp, name: val } : emp) }));
              setEditingEmployeeId(null);
            }}
            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingEmployeeId(null); }}
          />
        ) : (
          <Tooltip text="Prawy klik: edytuj / usuń">
            <div className="text-[15px] font-semibold text-gray-900 tracking-[-0.25px] leading-5 truncate">{employee.name}</div>
          </Tooltip>
        )}
      </td>

      <td
        className="border border-gray-200 px-0 py-0 text-center bg-white cursor-pointer"
        style={{ width: COL_WIDTH.norm, minWidth: COL_WIDTH.norm }}
        onContextMenu={e => { e.preventDefault(); setIsEditingNorm(true); }}
      >
        {isEditingNorm ? (
          <input
            autoFocus
            defaultValue={formatHours(empNorm)}
            className="border border-gray-200 rounded px-0.5 py-0.5 text-[13px] w-14 text-center outline-none"
            onBlur={e => {
              const raw = e.target.value.trim();
              let value;
              if (raw.includes(":")) { const [h, m] = raw.split(":"); value = parseInt(h) + parseInt(m) / 60; }
              else { value = parseFloat(raw.replace(",", ".")); }
              if (!isNaN(value) && value > 0) {
                setData(prev => {
                  const updatedNormOverrides = { ...prev.normOverrides };
                  if (Math.abs(value - monthlyNorm) < 0.01) delete updatedNormOverrides[employee.id];
                  else updatedNormOverrides[employee.id] = value;
                  return { ...prev, normOverrides: updatedNormOverrides };
                });
              }
              setIsEditingNorm(false);
            }}
            onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setIsEditingNorm(false); }}
          />
        ) : (
          <Tooltip text={normOverrides[employee.id] != null ? "Norma indywidualna \u2022 Prawy klik aby edytować" : "Prawy klik aby edytować"}>
            <span className={"text-[15px] font-bold tracking-[-0.25px] leading-5 cursor-pointer " + (normOverrides[employee.id] != null ? "text-orange-600" : "text-[#432dd7]")}>
              {formatHours(empNorm)}
            </span>
          </Tooltip>
        )}
      </td>

      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
        <ShiftCell
          key={day}
          value={shifts[employee.id]?.[day] || ""}
          isWeekendDay={isWeekend(year, month, day)}
          request={requests[employee.id]?.[day] || ""}
          onClick={() => cycleShift(employee.id, day)}
          onContextMenu={e => openCellContextMenu(e, day)}
          onShiftClick={() => handleRequestClick(day)}
        />
      ))}

      <td className="border border-gray-200 px-0.5 py-0 text-center bg-gray-50" style={{ width: COL_WIDTH.summary, minWidth: COL_WIDTH.summary }}>
        <div className="text-[14px] font-bold text-gray-900 tracking-[-0.2px] leading-5">{formatHours(hours)}h</div>
        <div className={"text-[13px] font-semibold tracking-[-0.15px] leading-4 " + (Math.abs(diff) < 0.01 ? "text-green-600" : diff > 0 ? "text-amber-600" : "text-red-600")}>
          {Math.abs(diff) < 0.01 ? "OK" : (diff > 0 ? "+" : "") + formatHours(diff)}
        </div>
      </td>
    </tr>
  );
}
