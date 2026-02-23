import { useCallback, useRef } from "react";
import { SHIFT_CYCLE, DAILY_NORM } from "../constants";
import { getDaysInMonth, getWorkingDays, getShiftHours, parseOvertimeVal } from "../utils";
import useLocalStorage from "./useLocalStorage";
import useMonthNavigation from "./useMonthNavigation";
import useImportExport from "./useImportExport";

const DEFAULT_EMPLOYEES = [
  { id: 1, name: "Anna Nowak" }, { id: 2, name: "Beata Kowalska" },
  { id: 3, name: "Celina Wiśniewska" }, { id: 4, name: "Dorota Wójcik" },
  { id: 5, name: "Elżbieta Zielińska" }, { id: 6, name: "Franciszka Szymańska" },
  { id: 7, name: "Grażyna Lewandowska" }, { id: 8, name: "Halina Dąbrowska" },
  { id: 9, name: "Irena Kozłowska" },
];

export default function useScheduleData(showToast) {
  const [shared, setShared] = useLocalStorage("grafik-shared", { employees: DEFAULT_EMPLOYEES });
  const { year, setYear, month, setMonth, monthData, setMonthData, changeMonth } = useMonthNavigation();

  // Composed data object
  const data = { year, month, employees: shared.employees, ...monthData };
  const dataRef = useRef(data);
  dataRef.current = data;

  // Unified state setter
  const setData = useCallback((updater) => {
    const next = typeof updater === "function" ? updater(dataRef.current) : updater;
    setShared({ employees: next.employees });
    setMonthData({
      shifts: next.shifts,
      overtime: next.overtime,
      requests: next.requests,
      workingDaysOverride: next.workingDaysOverride ?? null,
      normOverrides: next.normOverrides || {},
    });
  }, [setShared, setMonthData]);

  // Derived values
  const { employees, shifts, overtime, requests, workingDaysOverride, normOverrides } = data;
  const daysInMonth = getDaysInMonth(year, month);
  const autoWorkingDays = getWorkingDays(year, month);
  const workingDays = workingDaysOverride != null ? workingDaysOverride : autoWorkingDays;
  const monthlyNorm = workingDays * DAILY_NORM;

  const getEmpNorm = useCallback(
    (employeeId) => normOverrides[employeeId] != null ? normOverrides[employeeId] : monthlyNorm,
    [normOverrides, monthlyNorm],
  );

  const overtimeEmployeeIds = Object.keys(overtime)
    .filter(employeeId => Object.values(overtime[employeeId] || {}).some(val => val))
    .map(Number);

  // Calculations
  const calcHours = (employeeId) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) total += getShiftHours(shifts[employeeId]?.[day]);
    return total;
  };

  const calcEmpHours = useCallback((employeeId, excludeDay) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === excludeDay) continue;
      total += getShiftHours(shifts[employeeId]?.[day]);
    }
    return total;
  }, [shifts, daysInMonth]);

  const calcOT = (employeeId) => {
    let total = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const value = overtime[employeeId]?.[day];
      if (value) {
        const parsed = parseOvertimeVal(value);
        if (parsed) total += parsed.hours;
      }
    }
    return total;
  };

  const allNormsOk = employees.length > 0 && employees.every(emp => {
    const hrs = calcHours(emp.id);
    const hasAnyShift = Object.values(shifts[emp.id] || {}).some(val => val);
    return hasAnyShift && Math.abs(hrs - getEmpNorm(emp.id)) < 0.01;
  });

  // CRUD operations
  const setShift = useCallback((employeeId, day, value) => {
    setData(prev => ({
      ...prev,
      shifts: { ...prev.shifts, [employeeId]: { ...prev.shifts[employeeId], [day]: value } },
    }));
  }, [setData]);

  const cycleShift = useCallback((employeeId, day) => {
    const current = shifts[employeeId]?.[day] || "";
    if (current.startsWith("C:")) { setShift(employeeId, day, ""); return; }
    const idx = SHIFT_CYCLE.indexOf(current);
    setShift(employeeId, day, SHIFT_CYCLE[(idx + 1) % SHIFT_CYCLE.length]);
  }, [shifts, setShift]);

  const setOT = useCallback(({ empId, day, value }) => {
    setData(prev => ({
      ...prev,
      overtime: { ...prev.overtime, [empId]: { ...prev.overtime[empId], [day]: value } },
    }));
  }, [setData]);

  const removeOT = useCallback((employeeId, day) => {
    setData(prev => {
      const empOvertime = { ...prev.overtime[employeeId] };
      delete empOvertime[day];
      return { ...prev, overtime: { ...prev.overtime, [employeeId]: empOvertime } };
    });
  }, [setData]);

  const saveNote = useCallback((noteModal, note) => {
    const { empId, day } = noteModal;
    setData(prev => {
      const empRequests = { ...prev.requests[empId] };
      if (note.trim()) empRequests[day] = note.trim();
      else delete empRequests[day];
      return { ...prev, requests: { ...prev.requests, [empId]: empRequests } };
    });
  }, [setData]);

  const addEmployee = useCallback((name) => {
    if (!name.trim()) return;
    setData(prev => {
      const maxId = prev.employees.reduce((max, emp) => Math.max(max, emp.id), 0);
      return { ...prev, employees: [...prev.employees, { id: maxId + 1, name: name.trim() }] };
    });
  }, [setData]);

  // Import/Export
  const { exportJson, importJson, getCustomModalData } = useImportExport({
    dataRef: { get current() { return { ...dataRef.current, daysInMonth, workingDays }; } },
    setShared,
    setYear,
    setMonth,
    setMonthData,
    showToast,
  });

  return {
    year, month, employees, shifts, overtime, requests, workingDaysOverride, normOverrides,
    daysInMonth, autoWorkingDays, workingDays, monthlyNorm, overtimeEmployeeIds, allNormsOk,
    setData, setShift, cycleShift, setOT, removeOT, saveNote, addEmployee, changeMonth,
    getEmpNorm, calcHours, calcEmpHours, calcOT,
    exportJson, importJson, getCustomModalData,
  };
}
