import { useCallback } from "react";
import { getDefaultTimes, getShiftHours } from "../utils";
import { migrateFlat } from "./useMonthNavigation";

const MAX_NAME_LENGTH = 100;
const MAX_EMPLOYEES = 50;

function sanitizeEmployees(employees) {
  if (!Array.isArray(employees)) return null;
  if (employees.length > MAX_EMPLOYEES) return null;
  const sanitized = [];
  const seenIds = new Set();
  for (const emp of employees) {
    if (typeof emp !== "object" || emp === null || Array.isArray(emp)) return null;
    const id = Number(emp.id);
    if (!Number.isInteger(id) || id <= 0 || seenIds.has(id)) return null;
    const name = typeof emp.name === "string" ? emp.name.trim().slice(0, MAX_NAME_LENGTH) : "";
    if (!name) return null;
    seenIds.add(id);
    sanitized.push({ id, name });
  }
  return sanitized;
}

function sanitizeWorkingDaysOverride(value) {
  if (value == null) return null;
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1 || num > 31) return null;
  return num;
}

function sanitizeNormOverrides(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  const safe = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    const num = Number(val);
    if (typeof val === "number" && isFinite(num) && num > 0 && num < 744) {
      safe[key] = num;
    }
  }
  return safe;
}

export default function useImportExport({ dataRef, setShared, setYear, setMonth, setMonthData, showToast }) {

  const exportJson = useCallback(() => {
    return JSON.stringify(dataRef.current, null, 2);
  }, [dataRef]);

  const importJson = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        showToast("Nieprawidłowy format danych", "error");
        return;
      }

      const employees = sanitizeEmployees(parsed.employees);
      if (!employees) {
        showToast("Nieprawidłowa lista pracowników", "error");
        return;
      }

      setShared({ employees });

      if (parsed.year != null) {
        const year = Number(parsed.year);
        if (Number.isInteger(year) && year >= 2000 && year <= 2100) setYear(year);
      }
      if (parsed.month != null) {
        const month = Number(parsed.month);
        if (Number.isInteger(month) && month >= 0 && month <= 11) setMonth(month);
      }

      setMonthData({
        shifts: migrateFlat(parsed.shifts || {}),
        overtime: migrateFlat(parsed.overtime || {}),
        requests: migrateFlat(parsed.requests || {}),
        workingDaysOverride: sanitizeWorkingDaysOverride(parsed.workingDaysOverride),
        normOverrides: sanitizeNormOverrides(parsed.normOverrides || {}),
      });
      showToast("Dane zaimportowane pomyślnie");
    } catch {
      showToast("Nieprawidłowy plik JSON", "error");
    }
  }, [setShared, setYear, setMonth, setMonthData, showToast]);

  const getCustomModalData = useCallback((employeeId, day) => {
    const data = dataRef.current;
    const currentShift = data.shifts[employeeId]?.[day] || "";
    const emp = data.employees.find(emp => emp.id === employeeId);
    const defaults = getDefaultTimes(currentShift);
    const empNorm = data.normOverrides[employeeId] != null
      ? data.normOverrides[employeeId]
      : data.workingDays * (7 + 35 / 60);
    let totalHours = 0;
    for (let dayNum = 1; dayNum <= data.daysInMonth; dayNum++) {
      if (dayNum === day) continue;
      totalHours += getShiftHours(data.shifts[employeeId]?.[dayNum]);
    }
    return {
      empId: employeeId,
      day,
      empName: emp?.name || "",
      initial: defaults,
      remainingHours: empNorm - totalHours,
    };
  }, [dataRef]);

  return { exportJson, importJson, getCustomModalData };
}
