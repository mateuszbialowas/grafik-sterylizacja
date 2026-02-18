import { useState, useCallback } from "react";
import { SHIFT_TYPES, SHIFT_CYCLE, MONTHS_PL, DAILY_NORM } from "../constants";
import { getDaysInMonth, getDayName, isWeekend, getWorkingDays, formatHours, parseCustomShift, parseOvertimeVal, getShiftHours, getShiftDisplay, getDefaultTimes } from "../utils";
import ShiftCell from "./ShiftCell";
import OvertimeCell from "./OvertimeCell";
import CustomShiftModal from "./CustomShiftModal";
import OvertimeModal from "./OvertimeModal";

const mkInitial = () => {
  const now = new Date();
  return {
    year: now.getFullYear(), month: now.getMonth(),
    title: "Rozkład pracy Techników Sterylizacji - Centralna Sterylizacja",
    employees: [
      { id: 1, name: "Anna Nowak" }, { id: 2, name: "Beata Kowalska" },
      { id: 3, name: "Celina Wiśniewska" }, { id: 4, name: "Dorota Wójcik" },
      { id: 5, name: "Elżbieta Zielińska" }, { id: 6, name: "Franciszka Szymańska" },
      { id: 7, name: "Grażyna Lewandowska" }, { id: 8, name: "Halina Dąbrowska" },
      { id: 9, name: "Irena Kozłowska" },
    ],
    shifts: {}, overtime: {}, requests: {}, workingDaysOverride: null, normOverrides: {},
  };
};

export default function ScheduleApp() {
  const [data, setData] = useState(mkInitial);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingNorm, setEditingNorm] = useState(null);
  const [newName, setNewName] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [customModal, setCustomModal] = useState(null);
  const [overtimeModal, setOvertimeModal] = useState(null);

  const { year, month, employees, shifts, overtime, requests, workingDaysOverride, normOverrides } = data;
  const daysInMonth = getDaysInMonth(year, month);
  const autoWorkingDays = getWorkingDays(year, month);
  const workingDays = workingDaysOverride != null ? workingDaysOverride : autoWorkingDays;
  const monthlyNorm = workingDays * DAILY_NORM;
  const getEmpNorm = useCallback((eid) => normOverrides[eid] != null ? normOverrides[eid] : monthlyNorm, [normOverrides, monthlyNorm]);
  const overtimeEmployeeIds = [...new Set(Object.keys(overtime).filter(k => overtime[k]).map(k => +k.split("-")[0]))];

  const setShift = useCallback((eid, day, val) => { setData(p => ({ ...p, shifts: { ...p.shifts, [eid + "-" + day]: val } })); }, []);

  const cycleShift = useCallback((eid, day) => {
    const cur = shifts[eid + "-" + day] || "";
    if (cur.startsWith("C:")) { setShift(eid, day, ""); return; }
    const idx = SHIFT_CYCLE.indexOf(cur);
    setShift(eid, day, SHIFT_CYCLE[(idx + 1) % SHIFT_CYCLE.length]);
  }, [shifts, setShift]);

  const calcEmpHours = useCallback((eid, excl) => {
    let h = 0; for (let d = 1; d <= daysInMonth; d++) { if (d === excl) continue; h += getShiftHours(shifts[eid + "-" + d]); } return h;
  }, [shifts, daysInMonth]);

  const openCustomModal = useCallback((e, eid, day) => {
    e.preventDefault();
    const cur = shifts[eid + "-" + day] || "";
    const emp = employees.find(x => x.id === eid);
    const defs = getDefaultTimes(cur);
    setCustomModal({ empId: eid, day, empName: emp?.name || "", initial: defs, remainingHours: getEmpNorm(eid) - calcEmpHours(eid, day) });
  }, [shifts, employees, calcEmpHours, getEmpNorm]);

  const handleRequestClick = useCallback((eid, day) => {
    const key = eid + "-" + day;
    const current = requests[key] || "";
    const note = window.prompt("Notatka / prośba pracownika:", current);
    if (note === null) return;
    setData(p => {
      const r = { ...p.requests };
      if (note.trim()) r[key] = note.trim(); else delete r[key];
      return { ...p, requests: r };
    });
  }, [requests]);

  const setOT = useCallback(({ empId, day, value }) => { setData(p => ({ ...p, overtime: { ...p.overtime, [empId + "-" + day]: value } })); }, []);
  const removeOT = useCallback((eid, day) => { setData(p => { const o = { ...p.overtime }; delete o[eid + "-" + day]; return { ...p, overtime: o }; }); }, []);

  const calcOT = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) { const v = overtime[eid + "-" + d]; if (v) { const p = parseOvertimeVal(v); if (p) h += p.hours; } } return h; };
  const calcHours = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) h += getShiftHours(shifts[eid + "-" + d]); return h; };
  const addEmployee = () => { if (!newName.trim()) return; const mx = employees.reduce((m, e) => Math.max(m, e.id), 0); setData(p => ({ ...p, employees: [...p.employees, { id: mx + 1, name: newName.trim() }] })); setNewName(""); };
  const changeMonth = (delta) => { setData(p => { let m = p.month + delta, y = p.year; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } return { ...p, month: m, year: y, shifts: {}, overtime: {}, requests: {}, normOverrides: {}, workingDaysOverride: null }; }); };

  const exportJson = () => JSON.stringify(data, null, 2);
  const importJson = (s) => { try { const p = JSON.parse(s); if (p.employees) setData({ ...p, overtime: p.overtime || {}, requests: p.requests || {}, workingDaysOverride: p.workingDaysOverride ?? null, normOverrides: p.normOverrides || {} }); } catch { alert("Nieprawidłowy JSON"); } };

  const doPrint = () => {
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const norm = formatHours(monthlyNorm);

    const hdrCells = days.map(d => {
      const we = isWeekend(year, month, d);
      return '<th style="border:1px solid #999;padding:0;text-align:center;width:26px;min-width:26px;max-width:26px;' + (we ? "background:#fef2f2;color:#b91c1c;" : "") + '"><div style="font-size:8px;line-height:1">' + getDayName(year, month, d) + '</div><div style="font-size:12px;font-weight:bold">' + d + '</div></th>';
    }).join("");

    const rows = employees.map(emp => {
      const empNorm = getEmpNorm(emp.id);
      const empNormStr = formatHours(empNorm);
      const hrs = calcHours(emp.id);
      const diff = hrs - empNorm;
      const diffStr = (diff > 0 ? "+" : "") + formatHours(diff);
      const cells = days.map(d => {
        const v = shifts[emp.id + "-" + d] || "";
        const disp = getShiftDisplay(v);
        const we = isWeekend(year, month, d);
        const bg = v.startsWith("C:") ? "#fce7f3" : v === "D" ? "#dbeafe" : v === "D*" ? "#fef3c7" : v === "R" ? "#dcfce7" : we ? "#f3f4f6" : "#fff";
        const cs = parseCustomShift(v);
        const cellLabel = cs ? cs.startH + ":" + String(cs.startM).padStart(2,"0") + "<br/>" + cs.endH + ":" + String(cs.endM).padStart(2,"0") : disp.label;
        const cellSize = cs ? "font-size:10px;line-height:1.1" : "font-size:17px";
        return '<td style="border:1px solid #999;text-align:center;vertical-align:middle;padding:0;font-weight:bold;width:26px;min-width:26px;max-width:26px;height:28px;' + cellSize + ';background:' + bg + '">' + cellLabel + '</td>';
      }).join("");
      return '<tr>'
        + '<td style="border:1px solid #999;padding:1px 4px;font-size:13px;font-weight:bold;width:110px;max-width:110px;height:28px;word-wrap:break-word;overflow-wrap:break-word;line-height:1.2">' + emp.name + '</td>'
        + '<td style="border:1px solid #999;text-align:center;padding:1px;font-size:14px;color:' + (normOverrides[emp.id] != null ? '#ea580c' : '#4338ca') + ';font-weight:bold;height:28px">' + empNormStr + '</td>'
        + cells
        + '<td style="border:1px solid #999;text-align:center;vertical-align:middle;padding:1px 4px;height:28px;background:#f9fafb">' + (Math.abs(diff) < 0.01 ? '<div style="font-size:15px;font-weight:bold">' + formatHours(hrs) + '</div>' : '<div style="font-size:15px;font-weight:bold;line-height:1">' + formatHours(hrs) + '</div><div style="font-size:12px;line-height:1;color:' + (diff > 0 ? "orange" : "red") + '">' + diffStr + '</div>') + '</td>'
        + '</tr>';
    }).join("");

    let otHtml = "";
    if (overtimeEmployeeIds.length > 0) {
      const otHdr = days.map(d => '<th style="border:1px solid #999;padding:0;text-align:center;width:26px;min-width:26px;max-width:26px;font-size:12px;font-weight:bold">' + d + '</th>').join("");
      const otRows = employees.filter(emp => overtimeEmployeeIds.includes(emp.id)).map(emp => {
        const otH = calcOT(emp.id);
        const cells = days.map(d => {
          const v = overtime[emp.id + "-" + d] || "";
          if (!v) return '<td style="border:1px solid #999;padding:0;width:26px;min-width:26px;max-width:26px"></td>';
          const p = parseOvertimeVal(v);
          const top = p ? p.startH + ":" + String(p.startM).padStart(2,"0") : "";
          const bot = p ? p.endH + ":" + String(p.endM).padStart(2,"0") : v;
          return '<td style="border:1px solid #999;text-align:center;padding:0;width:26px;min-width:26px;max-width:26px;font-size:8px;line-height:1;font-weight:bold;background:#ffedd5;color:#9a3412">' + top + '<br/>' + bot + '</td>';
        }).join("");
        return '<tr><td style="border:1px solid #999;padding:1px 4px;font-size:13px;font-weight:bold;width:110px;max-width:110px;word-wrap:break-word;overflow-wrap:break-word;line-height:1.2">' + emp.name + '</td><td style="border:1px solid #999;width:50px;min-width:50px;max-width:50px"></td>' + cells + '<td style="border:1px solid #999;text-align:center;font-weight:bold;color:#c2410c;font-size:14px;width:60px;min-width:60px;max-width:60px">' + (otH > 0 ? formatHours(otH) : "–") + '</td></tr>';
      }).join("");
      otHtml = '<div style="margin-top:20px"><h3 style="font-size:15px;font-weight:bold;color:#c2410c;margin-bottom:6px">Nadgodziny</h3><table style="border-collapse:collapse;table-layout:fixed"><thead><tr style="background:#fff7ed"><th style="border:1px solid #999;padding:1px 4px;text-align:left;font-size:12px;width:110px">Pracownik</th><th style="border:1px solid #999;width:50px"></th>' + otHdr + '<th style="border:1px solid #999;padding:0;text-align:center;font-size:12px;width:60px">Nadg.</th></tr></thead><tbody>' + otRows + '</tbody></table></div>';
    }

    const html = '<!DOCTYPE html><html><head><title>Grafik - ' + MONTHS_PL[month] + ' ' + year + '</title><style>@page{size:landscape;margin:8mm}body{font-family:Arial,sans-serif;margin:0;padding:10px}table{border-collapse:collapse;width:100%}@media print{.no-print{display:none!important}}</style></head><body>'
      + '<h2 style="font-size:18px;margin:0 0 4px">' + data.title + '</h2>'
      + '<div style="font-size:14px;margin-bottom:8px;color:#3730a3"><b>Norma ' + MONTHS_PL[month] + ' ' + year + ': ' + norm + 'h</b> (' + workingDays + ' dni rob. x 7:35)</div>'
      + '<table style="border-collapse:collapse;table-layout:fixed"><thead><tr style="background:#f3f4f6"><th style="border:1px solid #999;padding:1px 4px;text-align:left;font-size:13px;width:110px">Pracownik</th><th style="border:1px solid #999;padding:0;text-align:center;font-size:12px;width:50px">Godz. do<br/>wyprac.</th>' + hdrCells + '<th style="border:1px solid #999;padding:0;text-align:center;font-size:12px;width:60px">Godz.<br/>wyprac.</th></tr></thead><tbody>' + rows + '</tbody></table>'
      + otHtml
      + '<div style="display:flex;justify-content:space-between;margin-top:60px;padding:0 40px"><div style="text-align:center"><div style="border-top:1px solid black;width:280px;padding-top:6px;font-size:14px">Podpis pielęgniarki/położnej sporządzającej</div></div><div style="text-align:center"><div style="border-top:1px solid black;width:280px;padding-top:6px;font-size:14px">Akceptacja przełożonej</div></div></div>'
      + '<div style="margin-top:30px;font-size:13px;border-top:1px solid #ccc;padding-top:10px"><b>Legenda:</b> <span style="background:#dbeafe;padding:2px 6px;margin:0 4px;font-weight:bold">D</span> = 7:00–19:00 (12h) <span style="background:#fef3c7;padding:2px 6px;margin:0 4px;font-weight:bold">D*</span> = 8:00–20:00 (12h) <span style="background:#dcfce7;padding:2px 6px;margin:0 4px;font-weight:bold">R</span> = 7:00–14:35 (7:35h) <span style="background:#fce7f3;padding:2px 6px;margin:0 4px;font-weight:bold">np. 7:00-11:30</span> = zmiana niestandardowa &nbsp; puste = wolne</div>'
      + '</body></html>';

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3" style={{ userSelect: "none" }}>
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">{data.title}</h1>
            <div className="flex gap-2">
              <button onClick={doPrint} className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Drukuj</button>
              <button onClick={() => setShowJson(!showJson)} className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">JSON</button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <button onClick={() => changeMonth(-1)} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium">←</button>
              <span className="text-base font-semibold min-w-[160px] text-center">{MONTHS_PL[month]} {year}</span>
              <button onClick={() => changeMonth(1)} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium">→</button>
            </div>
            <div className="px-3 py-1.5 bg-indigo-50 rounded inline-flex items-center gap-2">
              <span className="text-sm font-semibold text-indigo-800">{formatHours(monthlyNorm)}h</span>
              <span className="text-xs text-indigo-500">(</span>
              <button onClick={() => setData(p => ({ ...p, workingDaysOverride: (p.workingDaysOverride ?? autoWorkingDays) - 1 }))} className="w-5 h-5 rounded bg-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-300 leading-none" title="Odejmij dzień roboczy (np. święto)">−</button>
              <span className="text-sm font-bold text-indigo-800">{workingDays}</span>
              <button onClick={() => setData(p => ({ ...p, workingDaysOverride: (p.workingDaysOverride ?? autoWorkingDays) + 1 }))} className="w-5 h-5 rounded bg-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-300 leading-none" title="Dodaj dzień roboczy">+</button>
              <span className="text-xs text-indigo-500">dni rob. x 7:35)</span>
              {workingDaysOverride != null && <button onClick={() => setData(p => ({ ...p, workingDaysOverride: null }))} className="text-xs text-indigo-400 hover:text-indigo-600 underline" title="Przywróć automatyczne obliczanie">reset</button>}
            </div>
          </div>
          {showJson && (
            <div className="mt-3 p-3 bg-gray-50 rounded"><textarea className="w-full h-40 text-xs font-mono border rounded p-2" defaultValue={exportJson()} onBlur={e => importJson(e.target.value)} /><p className="text-xs text-gray-500 mt-1">Edytuj JSON i kliknij poza pole, aby zaimportować.</p></div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="border-collapse text-xs w-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-1 py-1 text-left sticky left-0 bg-gray-100 z-20 min-w-[130px] text-xs">Pracownik</th>
                <th className="border border-gray-300 px-0 py-1 text-center sticky left-[130px] bg-gray-100 z-20 min-w-[60px] text-[9px] leading-tight">Godz. do<br/>wyprac.</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <th key={d} className={"border border-gray-300 text-center " + (isWeekend(year, month, d) ? "bg-red-50 text-red-700" : "")}
                    style={{ width: 36, minWidth: 36, maxWidth: 36, padding: 0 }}>
                    <div className="text-[9px] leading-none">{getDayName(year, month, d)}</div><div className="text-sm font-bold leading-tight">{d}</div>
                  </th>
                ))}
                <th className="border border-gray-300 px-1 py-1 text-center min-w-[70px] text-[9px] leading-tight">Godz.<br/>wyprac.</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const empNorm = getEmpNorm(emp.id);
                const hours = calcHours(emp.id);
                const diff = hours - empNorm;
                return (
                  <tr key={emp.id} className="hover:bg-blue-50/30">
                    <td className="border border-gray-300 px-1 py-0 sticky left-0 bg-white z-10 min-w-[130px]">
                      {editingEmployee === emp.id ? (
                        <input autoFocus defaultValue={emp.name} className="border rounded px-1 py-0.5 text-xs w-full"
                          onBlur={e => { const val = e.target.value.trim(); if (!val) { if (window.confirm("Czy na pewno chcesz usunąć pracownika " + emp.name + "?")) { setData(p => ({ ...p, employees: p.employees.filter(x => x.id !== emp.id) })); } } else { setData(p => ({ ...p, employees: p.employees.map(x => x.id === emp.id ? { ...x, name: val } : x) })); } setEditingEmployee(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} />
                      ) : (
                        <div onDoubleClick={() => setEditingEmployee(emp.id)}>
                          <div className="font-semibold text-xs">{emp.name}</div>
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-0 py-0 text-center sticky left-[130px] bg-white z-10 min-w-[60px] cursor-pointer" onDoubleClick={() => setEditingNorm(emp.id)}>
                      {editingNorm === emp.id ? (
                        <input autoFocus defaultValue={formatHours(empNorm)} className="border rounded px-1 py-0.5 text-xs w-14 text-center"
                          onBlur={e => { const raw = e.target.value.trim(); let v; if (raw.includes(":")) { const [h, m] = raw.split(":"); v = parseInt(h) + parseInt(m) / 60; } else { v = parseFloat(raw.replace(",", ".")); } if (!isNaN(v) && v > 0) { setData(p => { const no = { ...p.normOverrides }; if (Math.abs(v - monthlyNorm) < 0.01) { delete no[emp.id]; } else { no[emp.id] = v; } return { ...p, normOverrides: no }; }); } setEditingNorm(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingNorm(null); }} />
                      ) : (
                        <span className={"text-sm font-bold " + (normOverrides[emp.id] != null ? "text-orange-600" : "text-indigo-700")} title={normOverrides[emp.id] != null ? "Norma indywidualna (podwójne kliknięcie aby edytować)" : "Podwójne kliknięcie aby edytować"}>{formatHours(empNorm)}</span>
                      )}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                      <ShiftCell key={d} value={shifts[emp.id + "-" + d] || ""} isWeekendDay={isWeekend(year, month, d)} request={requests[emp.id + "-" + d] || ""} onClick={() => cycleShift(emp.id, d)} onContextMenu={e => openCustomModal(e, emp.id, d)} onShiftClick={() => handleRequestClick(emp.id, d)} />
                    ))}
                    <td className="border border-gray-300 px-1 py-0 text-center bg-gray-50 min-w-[70px]">
                      <div className="text-sm font-bold">{formatHours(hours)}</div>
                      <div className={"text-xs font-semibold " + (Math.abs(diff) < 0.01 ? "text-green-600" : diff > 0 ? "text-amber-600" : "text-red-600")}>
                        {Math.abs(diff) < 0.01 ? "OK" : (diff > 0 ? "+" : "") + formatHours(diff)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="border border-gray-300 px-1 py-0 sticky left-0 bg-white z-10 min-w-[130px]" colSpan={2}>
                  <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addEmployee(); }} className="w-full px-1 py-0.5 text-xs outline-none bg-transparent" placeholder="+ Dodaj pracownika..." />
                </td>
                <td className="border border-gray-300" colSpan={daysInMonth + 1}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-white rounded-lg shadow-sm overflow-x-auto">
          <div className="p-3 flex items-center">
            <button onClick={() => setOvertimeModal({ empId: employees[0]?.id, day: 1, startH: 15, startM: 0, endH: 19, endM: 0 })} className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">+ Dodaj nadgodziny</button>
          </div>
          {overtimeEmployeeIds.length > 0 && (
            <>
              <div className="px-3 pb-2 text-sm font-bold text-orange-700">Nadgodziny</div>
              <table className="border-collapse text-xs w-auto">
              <thead><tr className="bg-orange-50">
                <th className="border border-gray-300 px-2 py-2 text-left sticky left-0 bg-orange-50 z-20 min-w-[130px]">Pracownik</th>
                <th className="border border-gray-300 px-1 py-2 text-center sticky left-[130px] bg-orange-50 z-20 min-w-[60px]"></th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => <th key={d} className={"border border-gray-300 px-0 py-1 text-center " + (isWeekend(year, month, d) ? "bg-red-50 text-red-700" : "")} style={{ width: 36, minWidth: 36, maxWidth: 36 }}><div className="font-bold">{d}</div></th>)}
                <th className="border border-gray-300 px-2 py-2 text-center min-w-[60px]">Nadg.</th>
              </tr></thead>
              <tbody>
                {employees.filter(emp => overtimeEmployeeIds.includes(emp.id)).map(emp => {
                  const otH = calcOT(emp.id);
                  return (
                    <tr key={emp.id} className="hover:bg-orange-50/30">
                      <td className="border border-gray-300 px-2 py-1 sticky left-0 bg-white z-10 text-xs font-semibold min-w-[130px]">{emp.name}</td>
                      <td className="border border-gray-300 sticky left-[130px] bg-white z-10 min-w-[60px]"></td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                        const ex = overtime[emp.id + "-" + d];
                        return <OvertimeCell key={d} value={ex || ""} isWeekendDay={isWeekend(year, month, d)} onClick={() => {
                          if (ex) { if (window.confirm("Czy na pewno chcesz usunąć nadgodziny?")) removeOT(emp.id, d); }
                          else setOvertimeModal({ empId: emp.id, day: d, startH: 15, startM: 0, endH: 19, endM: 0 });
                        }} />;
                      })}
                      <td className="border border-gray-300 px-1 py-0 text-center font-bold text-orange-700 bg-orange-50 text-sm">{otH > 0 ? formatHours(otH) : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 items-center flex-wrap">
            {Object.entries(SHIFT_TYPES).map(([k, v]) => <span key={k} className={"px-2 py-0.5 rounded text-xs font-bold " + v.color}>{v.label} = {v.name}</span>)}
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-pink-100 text-pink-800">PPM = niestandardowa</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-500">puste = wolne</span>
          </div>
          <div className="flex gap-4 text-[10px] text-gray-400 flex-wrap">
            <span>Klik: D / D* / R / wolne</span>
            <span>Prawy klik: zmiana niestandardowa</span>
            <span>Shift+klik: notatka</span>
            <span>2x klik na nazwisku/normie: edytuj</span>
          </div>
        </div>
      </div>

      {customModal && <CustomShiftModal empName={customModal.empName} day={customModal.day} initial={customModal.initial} remainingHours={customModal.remainingHours} onSave={val => { setShift(customModal.empId, customModal.day, val); setCustomModal(null); }} onClose={() => setCustomModal(null)} />}
      {overtimeModal && <OvertimeModal employees={employees} initial={overtimeModal} onSave={({ empId, day, value }) => { setOT({ empId, day, value }); setOvertimeModal(null); }} onClose={() => setOvertimeModal(null)} />}
    </div>
  );
}
