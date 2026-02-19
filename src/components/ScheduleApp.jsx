import { useState, useCallback, useEffect, useRef } from "react";
import { SHIFT_TYPES, SHIFT_CYCLE, MONTHS_PL, DAILY_NORM } from "../constants";
import { getDaysInMonth, getDayName, isWeekend, getWorkingDays, formatHours, parseCustomShift, parseOvertimeVal, getShiftHours, getShiftDisplay, getDefaultTimes } from "../utils";
import ShiftCell from "./ShiftCell";
import OvertimeCell from "./OvertimeCell";
import CustomShiftModal from "./CustomShiftModal";
import OvertimeModal from "./OvertimeModal";
import NoteModal from "./NoteModal";
import useLocalStorage from "../hooks/useLocalStorage";

function Tooltip({ text, children }) {
  return (
    <span className="relative group/tip">
      {children}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50">{text}</span>
    </span>
  );
}

const DEFAULT_EMPLOYEES = [
  { id: 1, name: "Anna Nowak" }, { id: 2, name: "Beata Kowalska" },
  { id: 3, name: "Celina Wiśniewska" }, { id: 4, name: "Dorota Wójcik" },
  { id: 5, name: "Elżbieta Zielińska" }, { id: 6, name: "Franciszka Szymańska" },
  { id: 7, name: "Grażyna Lewandowska" }, { id: 8, name: "Halina Dąbrowska" },
  { id: 9, name: "Irena Kozłowska" },
];

const DEFAULT_TITLE = "Rozkład pracy Techników Sterylizacji - Centralna Sterylizacja";

const monthKey = (y, m) => `grafik-${y}-${String(m).padStart(2, "0")}`;

const emptyMonthData = () => ({ shifts: {}, overtime: {}, requests: {}, workingDaysOverride: null, normOverrides: {} });

const loadMonthData = (y, m) => {
  try {
    const stored = localStorage.getItem(monthKey(y, m));
    return stored ? JSON.parse(stored) : emptyMonthData();
  } catch { return emptyMonthData(); }
};

export default function ScheduleApp() {
  const now = new Date();
  const [shared, setShared] = useLocalStorage("grafik-shared", { employees: DEFAULT_EMPLOYEES, title: DEFAULT_TITLE });
  const [year, setYear] = useState(() => {
    try { const s = localStorage.getItem("grafik-current"); return s ? JSON.parse(s).year : now.getFullYear(); } catch { return now.getFullYear(); }
  });
  const [month, setMonth] = useState(() => {
    try { const s = localStorage.getItem("grafik-current"); return s ? JSON.parse(s).month : now.getMonth(); } catch { return now.getMonth(); }
  });
  const [monthData, setMonthData] = useState(() => loadMonthData(year, month));

  // Save current year/month selection
  useEffect(() => { localStorage.setItem("grafik-current", JSON.stringify({ year, month })); }, [year, month]);

  // Auto-save month data
  useEffect(() => { localStorage.setItem(monthKey(year, month), JSON.stringify(monthData)); }, [year, month, monthData]);

  // Build combined data object for backwards-compat with JSON export/import and rest of component
  const data = { year, month, title: shared.title, employees: shared.employees, ...monthData };
  const dataRef = useRef(data);
  dataRef.current = data;

  const setData = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(dataRef.current) : updater;
    setShared({ employees: next.employees, title: next.title });
    setMonthData({ shifts: next.shifts, overtime: next.overtime, requests: next.requests, workingDaysOverride: next.workingDaysOverride ?? null, normOverrides: next.normOverrides || {} });
  }, [setShared]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingNorm, setEditingNorm] = useState(null);
  const [editingWorkingDays, setEditingWorkingDays] = useState(false);
  const [newName, setNewName] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const moreMenuRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [customModal, setCustomModal] = useState(null);
  const [overtimeModal, setOvertimeModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e) => { if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  const { employees, shifts, overtime, requests, workingDaysOverride, normOverrides } = data;
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

  const openContextMenu = useCallback((e, eid, day) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({ empId: eid, day, x: rect.left, y: rect.bottom });
  }, []);

  const handleContextMenuSelect = useCallback((action) => {
    if (!contextMenu) return;
    const { empId, day } = contextMenu;
    if (action === "custom") {
      const cur = shifts[empId + "-" + day] || "";
      const emp = employees.find(x => x.id === empId);
      const defs = getDefaultTimes(cur);
      setCustomModal({ empId, day, empName: emp?.name || "", initial: defs, remainingHours: getEmpNorm(empId) - calcEmpHours(empId, day) });
    } else {
      setShift(empId, day, action);
    }
    setContextMenu(null);
  }, [contextMenu, shifts, employees, calcEmpHours, getEmpNorm, setShift]);

  const handleRequestClick = useCallback((eid, day) => {
    const emp = employees.find(x => x.id === eid);
    const key = eid + "-" + day;
    setNoteModal({ empId: eid, day, empName: emp?.name || "", current: requests[key] || "" });
  }, [requests, employees]);

  const saveNote = useCallback((note) => {
    if (!noteModal) return;
    const key = noteModal.empId + "-" + noteModal.day;
    setData(p => {
      const r = { ...p.requests };
      if (note.trim()) r[key] = note.trim(); else delete r[key];
      return { ...p, requests: r };
    });
    setNoteModal(null);
  }, [noteModal]);

  const setOT = useCallback(({ empId, day, value }) => { setData(p => ({ ...p, overtime: { ...p.overtime, [empId + "-" + day]: value } })); }, []);
  const removeOT = useCallback((eid, day) => { setData(p => { const o = { ...p.overtime }; delete o[eid + "-" + day]; return { ...p, overtime: o }; }); }, []);

  const calcOT = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) { const v = overtime[eid + "-" + d]; if (v) { const p = parseOvertimeVal(v); if (p) h += p.hours; } } return h; };
  const calcHours = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) h += getShiftHours(shifts[eid + "-" + d]); return h; };
  const addEmployee = () => { if (!newName.trim()) return; const mx = employees.reduce((m, e) => Math.max(m, e.id), 0); setData(p => ({ ...p, employees: [...p.employees, { id: mx + 1, name: newName.trim() }] })); setNewName(""); };
  const changeMonth = (delta) => {
    let newM = month + delta, newY = year;
    if (newM < 0) { newM = 11; newY--; }
    if (newM > 11) { newM = 0; newY++; }
    setYear(newY);
    setMonth(newM);
    setMonthData(loadMonthData(newY, newM));
  };

  const exportJson = () => JSON.stringify(data, null, 2);
  const importJson = (s) => {
    try {
      const p = JSON.parse(s);
      if (p.employees) {
        setShared({ employees: p.employees, title: p.title || shared.title });
        if (p.year != null) setYear(p.year);
        if (p.month != null) setMonth(p.month);
        setMonthData({ shifts: p.shifts || {}, overtime: p.overtime || {}, requests: p.requests || {}, workingDaysOverride: p.workingDaysOverride ?? null, normOverrides: p.normOverrides || {} });
      }
    } catch { alert("Nieprawidłowy JSON"); }
  };

  const downloadJson = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grafik-${MONTHS_PL[month]}-${year}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
  };

  const handleImportFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { importJson(ev.target.result); };
      reader.readAsText(file);
    };
    input.click();
    setShowMoreMenu(false);
  };

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
    <div className="min-h-screen bg-gray-100 p-3 flex flex-col items-center" style={{ userSelect: "none" }}>
      <div className="w-fit">
        <div className="bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] px-[13px] pt-[13px] pb-[13px] mb-3 flex flex-col gap-[12px]">
          <div className="flex items-center justify-between h-[32px]">
            <h1 className="text-[16px] tracking-[-0.3125px] leading-[24px]">
              <span className="font-bold text-[#101828]">Rozkład pracy Techników Sterylizacji</span>
              <span className="font-normal text-[#6a7282]">- Centralna Sterylizacja</span>
            </h1>
            <div className="flex gap-[8px]">
              <button onClick={doPrint} className="h-[32px] px-[8px] bg-white border border-black/10 rounded-[8px] flex items-center justify-center gap-[6px] hover:bg-gray-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                <span className="text-[14px] font-medium text-[#0a0a0a] tracking-[-0.15px] leading-[20px]">Drukuj</span>
              </button>
              <div className="relative" ref={moreMenuRef}>
                <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="size-[32px] bg-white border border-black/10 rounded-[8px] flex items-center justify-center hover:bg-gray-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px] z-50">
                    <button onClick={downloadJson} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Eksportuj JSON
                    </button>
                    <button onClick={handleImportFile} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Importuj JSON
                    </button>
                    <div className="mx-2 my-1 h-px bg-[#e5e7eb]" />
                    <button onClick={() => { setShowJson(!showJson); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      {showJson ? "Ukryj JSON" : "Zobacz JSON"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[12px] h-[50px]">
            <div className="flex items-center gap-[8px] bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] h-[50px] px-[13px]">
              <button onClick={() => changeMonth(-1)} className="size-[32px] bg-white rounded-[4px] flex items-center justify-center hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div className="flex items-center gap-[8px] px-[12px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-[14px] font-semibold text-[#0a0a0a] tracking-[-0.15px] leading-[20px]">{MONTHS_PL[month]} {year}</span>
              </div>
              <button onClick={() => changeMonth(1)} className="size-[32px] bg-white rounded-[4px] flex items-center justify-center hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className={"flex items-center gap-4 rounded-[10px] h-12.5 px-4.25 border " + (workingDaysOverride != null ? "bg-[#eef2ff] border-[#a3b3ff]" : "bg-[#f9fafb] border-[#e5e7eb]")}>
              <div className="flex items-center gap-2">
                <span className={"text-[12px] font-semibold uppercase tracking-[0.3px] leading-4 " + (workingDaysOverride != null ? "text-[#432dd7]" : "text-[#4a5565]")}>Norma:</span>
                <span className={"text-[20px] font-bold tracking-[-0.45px] leading-7 " + (workingDaysOverride != null ? "text-[#312c85]" : "text-[#101828]")}>{formatHours(monthlyNorm)}</span>
                <span className={"text-[12px] font-normal leading-4 " + (workingDaysOverride != null ? "text-[#4f39f6]" : "text-[#4a5565]")}>h</span>
              </div>
              <div className={"w-px h-8 " + (workingDaysOverride != null ? "bg-[#a3b3ff]" : "bg-[#d1d5dc]")} />
              <div className="flex items-center gap-2">
                <span className={"text-[12px] font-semibold uppercase tracking-[0.3px] leading-4 " + (workingDaysOverride != null ? "text-[#432dd7]" : "text-[#4a5565]")}>Dni robocze:</span>
                {workingDaysOverride != null && <Tooltip text="Dni robocze zmienione ręcznie"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#432dd7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></Tooltip>}
                {editingWorkingDays ? (
                  <input autoFocus defaultValue={workingDays} className={"w-10 text-[20px] font-bold tracking-[-0.45px] leading-7 bg-white border rounded px-1 text-center outline-none " + (workingDaysOverride != null ? "text-[#312c85] border-[#a3b3ff]" : "text-[#101828] border-[#d1d5dc]")}
                    onBlur={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) { setData(p => ({ ...p, workingDaysOverride: v === autoWorkingDays ? null : v })); } setEditingWorkingDays(false); }}
                    onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingWorkingDays(false); }} />
                ) : (
                  <Tooltip text={workingDaysOverride != null ? "Zmienione ręcznie \u2022 Kliknij 2x aby edytować" : "Kliknij 2x aby edytować"}><span className={"text-[20px] font-bold tracking-[-0.45px] leading-7 cursor-pointer " + (workingDaysOverride != null ? "text-[#312c85]" : "text-[#101828]")} onDoubleClick={() => setEditingWorkingDays(true)}>{workingDays}</span></Tooltip>
                )}
                <span className={"text-[12px] font-normal leading-4 " + (workingDaysOverride != null ? "text-[#4f39f6]" : "text-[#4a5565]")}>({"\u00d7"} 7:35h)</span>
              </div>
            </div>
          </div>
          {showJson && (
            <div className="mt-3 p-3 bg-gray-50 rounded"><textarea className="w-full h-40 text-xs font-mono border rounded p-2" defaultValue={exportJson()} onBlur={e => importJson(e.target.value)} /><p className="text-xs text-gray-500 mt-1">Edytuj JSON i kliknij poza pole, aby zaimportować.</p></div>
          )}
        </div>

        <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-x-auto overflow-clip">
          <table className="border-collapse w-auto">
            <thead>
              <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6]" style={{ height: 48 }}>
                <th className="border border-[#e5e7eb] px-1.5 py-1 text-left sticky left-0 bg-[#f9fafb] z-20 text-[16px] font-semibold text-[#101828] tracking-[-0.31px] leading-6" style={{ width: 160, minWidth: 160 }}>Pracownik</th>
                <th className="border border-[#e5e7eb] px-1 py-1 text-center sticky left-[160px] bg-[#f9fafb] z-20 text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-[17.5px]" style={{ width: 100, minWidth: 100 }}>Godz. do<br/>wyprac.</th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                  const we = isWeekend(year, month, d);
                  return (
                    <th key={d} className={"border border-[#e5e7eb] text-center " + (we ? "bg-[#fef2f2]" : "")}
                      style={{ width: 42, minWidth: 42, maxWidth: 42, padding: 0 }}>
                      <div className={"text-[12px] font-normal leading-4 " + (we ? "text-[#e7000b]" : "text-[#6a7282]")}>{getDayName(year, month, d)}</div>
                      <div className={"text-[14px] font-bold leading-5 tracking-[-0.15px] " + (we ? "text-[#c10007]" : "text-[#101828]")}>{d}</div>
                    </th>
                  );
                })}
                <th className="border border-[#e5e7eb] px-1 py-1 text-center bg-[#f9fafb] text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-[17.5px]" style={{ width: 90, minWidth: 90 }}>Godz.<br/>wyprac.</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const empNorm = getEmpNorm(emp.id);
                const hours = calcHours(emp.id);
                const diff = hours - empNorm;
                return (
                  <tr key={emp.id}>
                    <td className="border border-[#e5e7eb] px-1.5 py-0 sticky left-0 bg-white z-10" style={{ width: 160, minWidth: 160, height: 45 }}>
                      {editingEmployee === emp.id ? (
                        <input autoFocus defaultValue={emp.name} className="border border-[#e5e7eb] rounded-lg px-2 py-1 text-[14px] w-full outline-none"
                          onBlur={e => { const val = e.target.value.trim(); if (!val) { if (window.confirm("Czy na pewno chcesz usunąć pracownika " + emp.name + "?")) { setData(p => ({ ...p, employees: p.employees.filter(x => x.id !== emp.id) })); } } else { setData(p => ({ ...p, employees: p.employees.map(x => x.id === emp.id ? { ...x, name: val } : x) })); } setEditingEmployee(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }} />
                      ) : (
                        <Tooltip text="Kliknij 2x aby edytować">
                          <div onDoubleClick={() => setEditingEmployee(emp.id)} className="cursor-pointer">
                            <div className="text-[16px] font-semibold text-[#101828] tracking-[-0.31px] leading-6">{emp.name}</div>
                          </div>
                        </Tooltip>
                      )}
                    </td>
                    <td className="border border-[#e5e7eb] px-0 py-0 text-center sticky left-[160px] bg-white z-10 cursor-pointer" style={{ width: 100, minWidth: 100 }} onDoubleClick={() => setEditingNorm(emp.id)}>
                      {editingNorm === emp.id ? (
                        <input autoFocus defaultValue={formatHours(empNorm)} className="border border-[#e5e7eb] rounded-lg px-1 py-0.5 text-[14px] w-16 text-center outline-none"
                          onBlur={e => { const raw = e.target.value.trim(); let v; if (raw.includes(":")) { const [h, m] = raw.split(":"); v = parseInt(h) + parseInt(m) / 60; } else { v = parseFloat(raw.replace(",", ".")); } if (!isNaN(v) && v > 0) { setData(p => { const no = { ...p.normOverrides }; if (Math.abs(v - monthlyNorm) < 0.01) { delete no[emp.id]; } else { no[emp.id] = v; } return { ...p, normOverrides: no }; }); } setEditingNorm(null); }}
                          onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingNorm(null); }} />
                      ) : (
                        <Tooltip text={normOverrides[emp.id] != null ? "Norma indywidualna \u2022 Kliknij 2x aby edytować" : "Kliknij 2x aby edytować"}><span className={"text-[16px] font-bold tracking-[-0.31px] leading-6 cursor-pointer " + (normOverrides[emp.id] != null ? "text-orange-600" : "text-[#432dd7]")}>{formatHours(empNorm)}</span></Tooltip>
                      )}
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                      <ShiftCell key={d} value={shifts[emp.id + "-" + d] || ""} isWeekendDay={isWeekend(year, month, d)} request={requests[emp.id + "-" + d] || ""} onClick={() => cycleShift(emp.id, d)} onContextMenu={e => openContextMenu(e, emp.id, d)} onShiftClick={() => handleRequestClick(emp.id, d)} />
                    ))}
                    <td className="border border-[#e5e7eb] px-1 py-0 text-center bg-[#f9fafb]" style={{ width: 90, minWidth: 90 }}>
                      <div className="text-[16px] font-bold text-[#101828] tracking-[-0.31px] leading-6">{formatHours(hours)}h</div>
                      <div className={"text-[14px] font-semibold tracking-[-0.15px] leading-5 " + (Math.abs(diff) < 0.01 ? "text-green-600" : diff > 0 ? "text-amber-600" : "text-[#e7000b]")}>
                        {Math.abs(diff) < 0.01 ? "OK" : (diff > 0 ? "+" : "") + formatHours(diff)}
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="border border-[#e5e7eb] px-3 py-2 sticky left-0 bg-white z-10" colSpan={2} style={{ height: 49 }}>
                  <div className="flex gap-2 items-center">
                    <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addEmployee(); }} className="flex-1 h-8 px-3 py-1 text-[14px] tracking-[-0.15px] bg-[#f3f3f5] rounded-lg border border-transparent outline-none placeholder:text-[#717182]" placeholder="+ Dodaj pracownika..." />
                    <button onClick={addEmployee} className="h-8 px-3 bg-[#030213] text-white text-[14px] font-medium tracking-[-0.15px] leading-5 rounded-lg hover:bg-[#1a1a2e]">Dodaj</button>
                  </div>
                </td>
                <td className="border border-[#e5e7eb]" colSpan={daysInMonth + 1}></td>
              </tr>
              <tr>
                <td colSpan={daysInMonth + 3} className="p-0 border-0" style={{ height: 48 }}>
                  <div className="flex items-center justify-between px-4 bg-gradient-to-r from-[#fff7ed] to-[#fffbeb] border-t border-b border-[#ffedd4] h-full">
                    <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.44px] leading-7">Nadgodziny</h3>
                    <button onClick={() => setOvertimeModal({ empId: employees[0]?.id, day: 1, startH: 15, startM: 0, endH: 19, endM: 0 })} className="h-9 px-3 bg-[#f54900] text-white rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#dc4100] flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Dodaj nadgodziny
                    </button>
                  </div>
                </td>
              </tr>
              {overtimeEmployeeIds.length > 0 && <>
                <tr className="bg-gradient-to-r from-[#fff7ed] to-[#fffbeb]" style={{ height: 36 }}>
                  <td className="border border-[#e5e7eb] px-1.5 py-1 text-left sticky left-0 bg-[#fff7ed] z-20 text-[14px] font-normal text-[#4a5565] tracking-[-0.15px]">Pracownik</td>
                  <td className="border border-[#e5e7eb] px-1 py-1 text-center sticky left-[160px] bg-[#fff7ed] z-20"></td>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const we = isWeekend(year, month, d);
                    return <td key={d} className={"border border-[#e5e7eb] text-center font-bold " + (we ? "bg-[#fef2f2] text-[#c10007]" : "text-[#101828]")} style={{ padding: 0 }}>
                      <div className="text-[14px] font-bold leading-5 tracking-[-0.15px]">{d}</div>
                    </td>;
                  })}
                  <td className="border border-[#e5e7eb] px-1 py-1 text-center bg-[#fff7ed] text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-[17.5px]">Nadg.</td>
                </tr>
                {employees.filter(emp => overtimeEmployeeIds.includes(emp.id)).map(emp => {
                  const otH = calcOT(emp.id);
                  return (
                    <tr key={"ot-" + emp.id}>
                      <td className="border border-[#e5e7eb] px-1.5 py-0 sticky left-0 bg-white z-10 text-[16px] font-semibold text-[#101828] tracking-[-0.31px] leading-6" style={{ height: 45 }}>{emp.name}</td>
                      <td className="border border-[#e5e7eb] sticky left-[160px] bg-white z-10"></td>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                        const ex = overtime[emp.id + "-" + d];
                        return <OvertimeCell key={d} value={ex || ""} isWeekendDay={isWeekend(year, month, d)} onClick={() => {
                          if (ex) { if (window.confirm("Czy na pewno chcesz usunąć nadgodziny?")) removeOT(emp.id, d); }
                          else setOvertimeModal({ empId: emp.id, day: d, startH: 15, startM: 0, endH: 19, endM: 0 });
                        }} />;
                      })}
                      <td className="border border-[#e5e7eb] px-1 py-0 text-center font-bold text-[#c2410c] bg-[#fff7ed] text-[14px]">{otH > 0 ? formatHours(otH) : "–"}</td>
                    </tr>
                  );
                })}
              </>}
            </tbody>
          </table>
        </div>

        <div className="mt-3 bg-white rounded-[14px] border border-[#e5e7eb] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-clip">
          <button onClick={() => setShowLegend(!showLegend)} className="w-full h-9 flex items-center justify-between px-3 rounded-lg hover:bg-[#f9fafb] transition-colors">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Legenda i skróty klawiszowe</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform duration-200 " + (showLegend ? "rotate-180" : "")}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {showLegend && (
            <div className="bg-[#f9fafb] border-t border-[#e5e7eb] px-4 pt-4 pb-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <h4 className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Rodzaje zmian</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#dbeafe] border-2 border-[#bedbff] flex items-center justify-center"><span className="text-[16px] font-bold text-[#193cb8] tracking-[-0.31px] leading-6">D</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Dyżur</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">7:00–19:00 (12 godzin)</div></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#fef3c6] border-2 border-[#fee685] flex items-center justify-center"><span className="text-[16px] font-bold text-[#973c00] tracking-[-0.31px] leading-6">D*</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Dyżur alternatywny</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">8:00–20:00 (12 godzin)</div></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#dcfce7] border-2 border-[#b9f8cf] flex items-center justify-center"><span className="text-[16px] font-bold text-[#016630] tracking-[-0.31px] leading-6">R</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Ranna zmiana</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">7:00–14:35 (7:35h)</div></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#f3e8ff] border-2 border-[#e9d5ff] flex items-center justify-center"><span className="text-[20px] font-bold text-[#6b21a8] leading-6">•</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Pod telefonem</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Niedziela — dyżur telefoniczny</div></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#fce7f3] border-2 border-[#fccee8] flex items-center justify-center"><span className="text-[12px] font-bold text-[#a3004c] leading-4">NS</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Godziny niestandardowe</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Zmiana z custom godzinami</div></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-[#f3f4f6] border-2 border-[#e5e7eb] flex items-center justify-center"><span className="text-[16px] font-normal text-[#99a1af] tracking-[-0.31px] leading-6">—</span></div>
                      <div><div className="text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5">Wolne</div><div className="text-[12px] font-normal text-[#4a5565] leading-4">Dzień wolny od pracy</div></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-[14px] font-semibold text-[#101828] tracking-[-0.15px] leading-5">Skróty klawiszowe i akcje</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">Klik na komórkę</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Zmień zmianę (cykl: wolne → D → D* → R)</span></div>
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">Prawy klik na komórkę</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Menu z wszystkimi opcjami zmian (D, D*, R, pod tel., NS, wolne)</span></div>
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">Shift + klik na komórkę</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Dodaj notatkę</span></div>
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">2x klik na nazwisko</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Edytuj nazwisko pracownika</span></div>
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">2x klik na normę</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Edytuj indywidualną normę godzinową</span></div>
                    <div className="flex items-center gap-2"><kbd className="h-6.5 px-2 py-1 bg-white border border-[#d1d5dc] rounded text-[12px] font-mono text-[#0a0a0a] leading-4 whitespace-nowrap">2x klik na dni robocze</kbd><span className="text-[14px] font-normal text-[#4a5565] tracking-[-0.15px] leading-5">Zmień liczbę dni roboczych w miesiącu</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} onContextMenu={e => { e.preventDefault(); setContextMenu(null); }}>
          <div className="absolute bg-white rounded-[10px] border border-[#e5e7eb] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={e => e.stopPropagation()}>
            <button onClick={() => handleContextMenuSelect("D")} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <span className="size-5 rounded bg-[#dbeafe] text-[#193cb8] text-[11px] font-bold flex items-center justify-center">D</span>
              Dyżur (D)
            </button>
            <button onClick={() => handleContextMenuSelect("D*")} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <span className="size-5 rounded bg-[#fef3c6] text-[#973c00] text-[11px] font-bold flex items-center justify-center">D*</span>
              Dyżur* (D*)
            </button>
            <button onClick={() => handleContextMenuSelect("R")} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <span className="size-5 rounded bg-[#dcfce7] text-[#016630] text-[11px] font-bold flex items-center justify-center">R</span>
              Ranna (R)
            </button>
            <div className="mx-2 my-1 h-px bg-[#e5e7eb]" />
            <button onClick={() => handleContextMenuSelect(".")} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <span className="size-5 rounded bg-[#f3e8ff] text-[#6b21a8] text-[12px] font-bold flex items-center justify-center">●</span>
              Pod telefonem (.)
            </button>
            <button onClick={() => handleContextMenuSelect("custom")} className="w-full text-left px-3 py-2 text-[14px] text-[#4a5565] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Niestandardowa (NS)...
            </button>
            <button onClick={() => handleContextMenuSelect("")} className="w-full text-left px-3 py-2 text-[14px] text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f3f4f6] flex items-center gap-2.5">
              <span className="size-5 rounded bg-[#f3f4f6] border border-[#e5e7eb] text-[#99a1af] text-[11px] font-normal flex items-center justify-center">—</span>
              Wolne
            </button>
          </div>
        </div>
      )}
      {customModal && <CustomShiftModal empName={customModal.empName} day={customModal.day} initial={customModal.initial} remainingHours={customModal.remainingHours} onSave={val => { setShift(customModal.empId, customModal.day, val); setCustomModal(null); }} onClose={() => setCustomModal(null)} />}
      {overtimeModal && <OvertimeModal employees={employees} initial={overtimeModal} onSave={({ empId, day, value }) => { setOT({ empId, day, value }); setOvertimeModal(null); }} onClose={() => setOvertimeModal(null)} />}
      {noteModal && <NoteModal empName={noteModal.empName} day={noteModal.day} current={noteModal.current} onSave={saveNote} onClose={() => setNoteModal(null)} />}
    </div>
  );
}
