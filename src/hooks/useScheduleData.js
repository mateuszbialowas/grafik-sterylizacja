import { useState, useCallback, useEffect, useRef } from "react";
import { SHIFT_CYCLE, MONTHS_PL, DAILY_NORM } from "../constants";
import { getDaysInMonth, getWorkingDays, formatHours, getShiftHours, getDefaultTimes, parseOvertimeVal } from "../utils";
import useLocalStorage from "./useLocalStorage";

const DEFAULT_EMPLOYEES = [
  { id: 1, name: "Anna Nowak" }, { id: 2, name: "Beata Kowalska" },
  { id: 3, name: "Celina Wiśniewska" }, { id: 4, name: "Dorota Wójcik" },
  { id: 5, name: "Elżbieta Zielińska" }, { id: 6, name: "Franciszka Szymańska" },
  { id: 7, name: "Grażyna Lewandowska" }, { id: 8, name: "Halina Dąbrowska" },
  { id: 9, name: "Irena Kozłowska" },
];

const monthKey = (y, m) => `grafik-${y}-${String(m).padStart(2, "0")}`;

const emptyMonthData = () => ({ shifts: {}, overtime: {}, requests: {}, workingDaysOverride: null, normOverrides: {} });

const migrateFlat = (obj) => {
  if (!obj || typeof obj !== "object") return {};
  const keys = Object.keys(obj);
  if (keys.length === 0) return {};
  if (!keys[0].includes("-")) return obj;
  const nested = {};
  for (const [key, val] of Object.entries(obj)) {
    const i = key.indexOf("-");
    const eid = key.slice(0, i);
    const day = key.slice(i + 1);
    if (!nested[eid]) nested[eid] = {};
    nested[eid][day] = val;
  }
  return nested;
};

const loadMonthData = (y, m) => {
  try {
    const stored = localStorage.getItem(monthKey(y, m));
    if (!stored) return emptyMonthData();
    const d = JSON.parse(stored);
    return { ...d, shifts: migrateFlat(d.shifts), overtime: migrateFlat(d.overtime), requests: migrateFlat(d.requests) };
  } catch { return emptyMonthData(); }
};

export default function useScheduleData(showToast) {
  const now = new Date();
  const [shared, setShared] = useLocalStorage("grafik-shared", { employees: DEFAULT_EMPLOYEES });
  const [year, setYear] = useState(() => {
    try { const s = localStorage.getItem("grafik-current"); return s ? JSON.parse(s).year : now.getFullYear(); } catch { return now.getFullYear(); }
  });
  const [month, setMonth] = useState(() => {
    try { const s = localStorage.getItem("grafik-current"); return s ? JSON.parse(s).month : now.getMonth(); } catch { return now.getMonth(); }
  });
  const [monthData, setMonthData] = useState(() => loadMonthData(year, month));

  useEffect(() => { localStorage.setItem("grafik-current", JSON.stringify({ year, month })); }, [year, month]);
  useEffect(() => { localStorage.setItem(monthKey(year, month), JSON.stringify(monthData)); }, [year, month, monthData]);

  const data = { year, month, employees: shared.employees, ...monthData };
  const dataRef = useRef(data);
  dataRef.current = data;

  const setData = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(dataRef.current) : updater;
    setShared({ employees: next.employees });
    setMonthData({ shifts: next.shifts, overtime: next.overtime, requests: next.requests, workingDaysOverride: next.workingDaysOverride ?? null, normOverrides: next.normOverrides || {} });
  }, [setShared]);

  const { employees, shifts, overtime, requests, workingDaysOverride, normOverrides } = data;
  const daysInMonth = getDaysInMonth(year, month);
  const autoWorkingDays = getWorkingDays(year, month);
  const workingDays = workingDaysOverride != null ? workingDaysOverride : autoWorkingDays;
  const monthlyNorm = workingDays * DAILY_NORM;
  const getEmpNorm = useCallback((eid) => normOverrides[eid] != null ? normOverrides[eid] : monthlyNorm, [normOverrides, monthlyNorm]);
  const overtimeEmployeeIds = Object.keys(overtime).filter(eid => Object.values(overtime[eid] || {}).some(v => v)).map(Number);

  const setShift = useCallback((eid, day, val) => { setData(p => ({ ...p, shifts: { ...p.shifts, [eid]: { ...p.shifts[eid], [day]: val } } })); }, [setData]);

  const cycleShift = useCallback((eid, day) => {
    const cur = shifts[eid]?.[day] || "";
    if (cur.startsWith("C:")) { setShift(eid, day, ""); return; }
    const idx = SHIFT_CYCLE.indexOf(cur);
    setShift(eid, day, SHIFT_CYCLE[(idx + 1) % SHIFT_CYCLE.length]);
  }, [shifts, setShift]);

  const calcEmpHours = useCallback((eid, excl) => {
    let h = 0; for (let d = 1; d <= daysInMonth; d++) { if (d === excl) continue; h += getShiftHours(shifts[eid]?.[d]); } return h;
  }, [shifts, daysInMonth]);

  const calcHours = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) h += getShiftHours(shifts[eid]?.[d]); return h; };

  const calcOT = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) { const v = overtime[eid]?.[d]; if (v) { const p = parseOvertimeVal(v); if (p) h += p.hours; } } return h; };

  const allNormsOk = employees.length > 0 && employees.every(emp => {
    const hrs = calcHours(emp.id);
    const hasAnyShift = Object.values(shifts[emp.id] || {}).some(v => v);
    return hasAnyShift && Math.abs(hrs - getEmpNorm(emp.id)) < 0.01;
  });

  const setOT = useCallback(({ empId, day, value }) => { setData(p => ({ ...p, overtime: { ...p.overtime, [empId]: { ...p.overtime[empId], [day]: value } } })); }, [setData]);
  const removeOT = useCallback((eid, day) => { setData(p => { const empOt = { ...p.overtime[eid] }; delete empOt[day]; return { ...p, overtime: { ...p.overtime, [eid]: empOt } }; }); }, [setData]);

  const saveNote = useCallback((noteModal, note) => {
    const { empId, day } = noteModal;
    setData(p => {
      const empReqs = { ...p.requests[empId] };
      if (note.trim()) empReqs[day] = note.trim(); else delete empReqs[day];
      return { ...p, requests: { ...p.requests, [empId]: empReqs } };
    });
  }, [setData]);

  const addEmployee = useCallback((name) => {
    if (!name.trim()) return;
    setData(p => {
      const mx = p.employees.reduce((m, e) => Math.max(m, e.id), 0);
      return { ...p, employees: [...p.employees, { id: mx + 1, name: name.trim() }] };
    });
  }, [setData]);

  const changeMonth = useCallback((delta) => {
    let newM = month + delta, newY = year;
    if (newM < 0) { newM = 11; newY--; }
    if (newM > 11) { newM = 0; newY++; }
    setYear(newY);
    setMonth(newM);
    setMonthData(loadMonthData(newY, newM));
  }, [month, year]);

  const exportJson = () => JSON.stringify(data, null, 2);

  const importJson = useCallback((s) => {
    try {
      const p = JSON.parse(s);
      if (p.employees) {
        setShared({ employees: p.employees });
        if (p.year != null) setYear(p.year);
        if (p.month != null) setMonth(p.month);
        setMonthData({ shifts: migrateFlat(p.shifts || {}), overtime: migrateFlat(p.overtime || {}), requests: migrateFlat(p.requests || {}), workingDaysOverride: p.workingDaysOverride ?? null, normOverrides: p.normOverrides || {} });
        showToast("Dane zaimportowane pomyślnie");
      }
    } catch { showToast("Nieprawidłowy plik JSON", "error"); }
  }, [setShared, showToast]);

  const getCustomModalData = useCallback((empId, day) => {
    const cur = shifts[empId]?.[day] || "";
    const emp = employees.find(x => x.id === empId);
    const defs = getDefaultTimes(cur);
    return { empId, day, empName: emp?.name || "", initial: defs, remainingHours: getEmpNorm(empId) - calcEmpHours(empId, day) };
  }, [shifts, employees, getEmpNorm, calcEmpHours]);

  return {
    year, month, employees, shifts, overtime, requests, workingDaysOverride, normOverrides,
    daysInMonth, autoWorkingDays, workingDays, monthlyNorm, overtimeEmployeeIds, allNormsOk,
    setData, setShift, cycleShift, setOT, removeOT, saveNote, addEmployee, changeMonth,
    getEmpNorm, calcHours, calcEmpHours, calcOT,
    exportJson, importJson, getCustomModalData,
  };
}
