import { useState, useCallback, useRef } from "react";
import { isWeekend } from "../utils";
import { formatHours } from "../utils";
import useScheduleData from "../hooks/useScheduleData";
import useContextMenu from "../hooks/useContextMenu";
import useToasts from "../hooks/useToasts";
import printSchedule from "../utils/printSchedule";
import Tooltip from "./Tooltip";
import ShiftCell from "./ShiftCell";
import ShiftContextMenu from "./ShiftContextMenu";
import { ContextMenuOverlay, MenuItem } from "./ContextMenu";
import Toasts from "./Toasts";
import Legend from "./Legend";
import ScheduleHeader from "./ScheduleHeader";
import OvertimeSection from "./OvertimeSection";
import CustomShiftModal from "./CustomShiftModal";
import OvertimeModal from "./OvertimeModal";
import NoteModal from "./NoteModal";
import ConfirmModal from "./ConfirmModal";

export default function ScheduleApp() {
  const { toasts, showToast } = useToasts();
  const sd = useScheduleData(showToast);
  const { year, month, employees, shifts, overtime, requests, workingDaysOverride, normOverrides,
    daysInMonth, autoWorkingDays, workingDays, monthlyNorm, overtimeEmployeeIds, allNormsOk,
    setData, setShift, cycleShift, setOT, removeOT, saveNote, addEmployee, changeMonth,
    getEmpNorm, calcHours, calcOT, exportJson, importJson, getCustomModalData } = sd;

  const [shiftMenu, openShiftMenu, closeShiftMenu] = useContextMenu();
  const [empMenu, openEmpMenu, closeEmpMenu] = useContextMenu();
  const [otMenu, openOtMenu, closeOtMenu] = useContextMenu();

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingNorm, setEditingNorm] = useState(null);
  const [editingWorkingDays, setEditingWorkingDays] = useState(false);
  const [newName, setNewName] = useState("");
  const [customModal, setCustomModal] = useState(null);
  const [overtimeModal, setOvertimeModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [titleClicks, setTitleClicks] = useState(0);
  const [sunEasterEgg, setSunEasterEgg] = useState(false);
  const titleClickTimer = useRef(null);

  const handleTitleClick = () => {
    const next = titleClicks + 1;
    setTitleClicks(next);
    clearTimeout(titleClickTimer.current);
    if (next >= 5) { setSunEasterEgg(true); setTitleClicks(0); setTimeout(() => setSunEasterEgg(false), 5000); }
    else { titleClickTimer.current = setTimeout(() => setTitleClicks(0), 1500); }
  };

  const doPrint = () => printSchedule({ year, month, employees, shifts, overtime, normOverrides, daysInMonth, workingDays, monthlyNorm, overtimeEmployeeIds, getEmpNorm, calcOT });

  const openCellContextMenu = useCallback((e, eid, day) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    openShiftMenu({ empId: eid, day, x: rect.left, y: rect.bottom, hasNote: !!(requests[eid]?.[day]) });
  }, [requests, openShiftMenu]);

  const handleShiftMenuSelect = useCallback((action) => {
    if (!shiftMenu) return;
    const { empId, day } = shiftMenu;
    if (action === "custom") {
      setCustomModal(getCustomModalData(empId, day));
    } else {
      setShift(empId, day, action);
    }
    closeShiftMenu();
  }, [shiftMenu, getCustomModalData, setShift, closeShiftMenu]);

  const handleRequestClick = useCallback((eid, day) => {
    const emp = employees.find(x => x.id === eid);
    setNoteModal({ empId: eid, day, empName: emp?.name || "", current: requests[eid]?.[day] || "" });
  }, [requests, employees]);

  const handleAddEmployee = () => { if (!newName.trim()) return; addEmployee(newName); setNewName(""); };

  return (
    <div className="min-h-screen bg-gray-100 p-2 overflow-x-hidden" style={{ userSelect: "none" }}>
      <div className="max-w-full mx-auto">
        <ScheduleHeader
          year={year} month={month} workingDays={workingDays} workingDaysOverride={workingDaysOverride}
          autoWorkingDays={autoWorkingDays} monthlyNorm={monthlyNorm} allNormsOk={allNormsOk}
          sunEasterEgg={sunEasterEgg} onTitleClick={handleTitleClick} onPrint={doPrint}
          changeMonth={changeMonth} setData={setData} exportJson={exportJson} importJson={importJson}
          showToast={showToast} editingWorkingDays={editingWorkingDays} setEditingWorkingDays={setEditingWorkingDays}
        />

        <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-x-auto overflow-y-hidden">
          <table className="border-collapse w-auto">
            <thead>
              <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6]" style={{ height: 42 }}>
                <th className="border border-[#e5e7eb] px-1.5 py-0.5 text-left sticky left-0 bg-[#f9fafb] z-30 text-[15px] font-semibold text-[#101828] tracking-[-0.25px] leading-5" style={{ width: 140, minWidth: 140 }}>Pracownik</th>
                <th className="border border-[#e5e7eb] px-0.5 py-0.5 text-center bg-[#f9fafb] text-[13px] font-normal text-[#4a5565] tracking-[-0.15px] leading-4" style={{ width: 65, minWidth: 65 }}>Norma</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const we = isWeekend(year, month, d);
                  return (
                    <th key={d} className={"border border-[#e5e7eb] text-center " + (we ? "bg-[#fef2f2]" : "")} style={{ width: 38, minWidth: 38, maxWidth: 38, padding: 0 }}>
                      <div className={"text-[11px] font-normal leading-3 " + (we ? "text-[#e7000b]" : "text-[#6a7282]")}>{["Nd","Pn","Wt","Śr","Cz","Pt","So"][new Date(year, month, d).getDay()]}</div>
                      <div className={"text-[14px] font-bold leading-5 tracking-[-0.15px] " + (we ? "text-[#c10007]" : "text-[#101828]")}>{d}</div>
                    </th>
                  );
                })}
                <th className="border border-[#e5e7eb] px-0.5 py-0.5 text-center bg-[#f9fafb] text-[13px] font-normal text-[#4a5565] tracking-[-0.15px] leading-4" style={{ width: 70, minWidth: 70 }}>Godz.<br/>wypr.</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const empNorm = getEmpNorm(emp.id);
                const hours = calcHours(emp.id);
                const diff = hours - empNorm;
                return (
                  <tr key={emp.id}>
                    <td className="border border-[#e5e7eb] px-1.5 py-0 sticky left-0 bg-white z-20 overflow-hidden" style={{ width: 140, minWidth: 140, maxWidth: 140, height: 40 }}
                      onContextMenu={e => { e.preventDefault(); const rect = e.currentTarget.getBoundingClientRect(); openEmpMenu({ empId: emp.id, empName: emp.name, x: rect.left, y: rect.bottom }); }}>
                      {editingEmployee === emp.id ? (
                        <input autoFocus defaultValue={emp.name} className="border border-[#e5e7eb] rounded px-1 py-0.5 text-[13px] w-full outline-none"
                          onBlur={e => { const val = e.target.value.trim(); if (val) { setData(p => ({ ...p, employees: p.employees.map(x => x.id === emp.id ? { ...x, name: val } : x) })); } setEditingEmployee(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingEmployee(null); }} />
                      ) : (
                        <Tooltip text="Prawy klik: edytuj / usuń">
                          <div className="text-[15px] font-semibold text-[#101828] tracking-[-0.25px] leading-5 truncate">{emp.name}</div>
                        </Tooltip>
                      )}
                    </td>
                    <td className="border border-[#e5e7eb] px-0 py-0 text-center bg-white cursor-pointer" style={{ width: 65, minWidth: 65 }} onContextMenu={e => { e.preventDefault(); setEditingNorm(emp.id); }}>
                      {editingNorm === emp.id ? (
                        <input autoFocus defaultValue={formatHours(empNorm)} className="border border-[#e5e7eb] rounded px-0.5 py-0.5 text-[13px] w-14 text-center outline-none"
                          onBlur={e => { const raw = e.target.value.trim(); let v; if (raw.includes(":")) { const [h, m] = raw.split(":"); v = parseInt(h) + parseInt(m) / 60; } else { v = parseFloat(raw.replace(",", ".")); } if (!isNaN(v) && v > 0) { setData(p => { const no = { ...p.normOverrides }; if (Math.abs(v - monthlyNorm) < 0.01) { delete no[emp.id]; } else { no[emp.id] = v; } return { ...p, normOverrides: no }; }); } setEditingNorm(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingNorm(null); }} />
                      ) : (
                        <Tooltip text={normOverrides[emp.id] != null ? "Norma indywidualna \u2022 Prawy klik aby edytować" : "Prawy klik aby edytować"}><span className={"text-[15px] font-bold tracking-[-0.25px] leading-5 cursor-pointer " + (normOverrides[emp.id] != null ? "text-orange-600" : "text-[#432dd7]")}>{formatHours(empNorm)}</span></Tooltip>
                      )}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                      <ShiftCell key={d} value={shifts[emp.id]?.[d] || ""} isWeekendDay={isWeekend(year, month, d)} request={requests[emp.id]?.[d] || ""} onClick={() => cycleShift(emp.id, d)} onContextMenu={e => openCellContextMenu(e, emp.id, d)} onShiftClick={() => handleRequestClick(emp.id, d)} />
                    ))}
                    <td className="border border-[#e5e7eb] px-0.5 py-0 text-center bg-[#f9fafb]" style={{ width: 70, minWidth: 70 }}>
                      <div className="text-[14px] font-bold text-[#101828] tracking-[-0.2px] leading-5">{formatHours(hours)}h</div>
                      <div className={"text-[13px] font-semibold tracking-[-0.15px] leading-4 " + (Math.abs(diff) < 0.01 ? "text-green-600" : diff > 0 ? "text-amber-600" : "text-[#e7000b]")}>
                        {Math.abs(diff) < 0.01 ? "OK" : (diff > 0 ? "+" : "") + formatHours(diff)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="border border-[#e5e7eb]" colSpan={daysInMonth + 3} style={{ height: 44, padding: 0 }}>
                  <div className="sticky left-0 px-2 py-1.5" style={{ width: 'min(100%, calc(100vw - 1rem))' }}>
                    <div className="flex gap-2 items-center">
                      <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleAddEmployee(); }} className="flex-1 h-8 px-2.5 py-0.5 text-[14px] tracking-[-0.15px] bg-[#f3f3f5] rounded-lg border border-transparent outline-none placeholder:text-[#717182]" placeholder="+ Dodaj pracownika..." />
                      <button onClick={handleAddEmployee} className="h-8 px-3 bg-[#030213] text-white text-[13px] font-medium tracking-[-0.15px] leading-5 rounded-lg hover:bg-[#1a1a2e] shrink-0">Dodaj</button>
                    </div>
                  </div>
                </td>
              </tr>
              <OvertimeSection
                year={year} month={month} employees={employees} overtime={overtime}
                overtimeEmployeeIds={overtimeEmployeeIds} daysInMonth={daysInMonth} calcOT={calcOT}
                setOvertimeModal={setOvertimeModal} setOtContextMenu={openOtMenu}
              />
            </tbody>
          </table>
        </div>

        <Legend />
      </div>

      <ShiftContextMenu menu={shiftMenu} onClose={closeShiftMenu} onSelect={handleShiftMenuSelect}
        onNoteClick={() => { handleRequestClick(shiftMenu.empId, shiftMenu.day); closeShiftMenu(); }}
        onDeleteNote={() => { const { empId, day } = shiftMenu; setData(p => { const empReqs = { ...p.requests[empId] }; delete empReqs[day]; return { ...p, requests: { ...p.requests, [empId]: empReqs } }; }); closeShiftMenu(); }}
      />

      <ContextMenuOverlay menu={empMenu} onClose={closeEmpMenu}>
        <MenuItem onClick={() => { setEditingEmployee(empMenu.empId); closeEmpMenu(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edytuj nazwisko
        </MenuItem>
        <MenuItem onClick={() => { const { empId, empName } = empMenu; closeEmpMenu(); setConfirmModal({ title: "Usuń pracownika", message: "Czy na pewno chcesz usunąć pracownika " + empName + "? Wszystkie dane zmian zostaną utracone.", onConfirm: () => { setData(p => { const newShifts = { ...p.shifts }; delete newShifts[empId]; const newOvertime = { ...p.overtime }; delete newOvertime[empId]; const newRequests = { ...p.requests }; delete newRequests[empId]; const newNormOverrides = { ...p.normOverrides }; delete newNormOverrides[empId]; return { ...p, employees: p.employees.filter(x => x.id !== empId), shifts: newShifts, overtime: newOvertime, requests: newRequests, normOverrides: newNormOverrides }; }); setConfirmModal(null); } }); }} destructive>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Usuń pracownika
        </MenuItem>
      </ContextMenuOverlay>

      <ContextMenuOverlay menu={otMenu} onClose={closeOtMenu}>
        <MenuItem onClick={() => { const { empId, day, parsed } = otMenu; setOvertimeModal({ empId, day, startH: parsed?.startH ?? 15, startM: parsed?.startM ?? 0, endH: parsed?.endH ?? 19, endM: parsed?.endM ?? 0 }); closeOtMenu(); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Edytuj nadgodziny
        </MenuItem>
        <MenuItem onClick={() => { const { empId, empName, day } = otMenu; closeOtMenu(); setConfirmModal({ title: "Usuń nadgodziny", message: "Czy na pewno chcesz usunąć nadgodziny dla " + empName + " (dzień " + day + ")?", onConfirm: () => { removeOT(empId, day); setConfirmModal(null); } }); }} destructive>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Usuń nadgodziny
        </MenuItem>
      </ContextMenuOverlay>

      {customModal && <CustomShiftModal empName={customModal.empName} day={customModal.day} initial={customModal.initial} remainingHours={customModal.remainingHours} onSave={val => { setShift(customModal.empId, customModal.day, val); setCustomModal(null); }} onClose={() => setCustomModal(null)} />}
      {overtimeModal && <OvertimeModal employees={employees} initial={overtimeModal} onSave={({ empId, day, value }) => { setOT({ empId, day, value }); setOvertimeModal(null); }} onClose={() => setOvertimeModal(null)} />}
      {noteModal && <NoteModal empName={noteModal.empName} day={noteModal.day} current={noteModal.current} onSave={note => { saveNote(noteModal, note); setNoteModal(null); }} onClose={() => setNoteModal(null)} />}
      {confirmModal && <ConfirmModal title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onClose={() => setConfirmModal(null)} />}

      <Toasts toasts={toasts} />
    </div>
  );
}
