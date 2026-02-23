import { useState, useCallback, useEffect } from "react";

const monthKey = (year, month) => `grafik-${year}-${String(month).padStart(2, "0")}`;

const emptyMonthData = () => ({
  shifts: {},
  overtime: {},
  requests: {},
  workingDaysOverride: null,
  normOverrides: {},
});

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isSafeKey = (key) => !DANGEROUS_KEYS.has(key);

const migrateFlat = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  const keys = Object.keys(obj);
  if (keys.length === 0) return {};
  if (!keys[0].includes("-")) {
    const safe = Object.create(null);
    for (const [key, val] of Object.entries(obj)) {
      if (isSafeKey(key)) safe[key] = val;
    }
    return safe;
  }
  const nested = Object.create(null);
  for (const [key, val] of Object.entries(obj)) {
    const i = key.indexOf("-");
    const employeeId = key.slice(0, i);
    const day = key.slice(i + 1);
    if (!isSafeKey(employeeId) || !isSafeKey(day)) continue;
    if (!nested[employeeId]) nested[employeeId] = Object.create(null);
    nested[employeeId][day] = val;
  }
  return nested;
};

const loadMonthData = (year, month) => {
  try {
    const stored = localStorage.getItem(monthKey(year, month));
    if (!stored) return emptyMonthData();
    const data = JSON.parse(stored);
    return {
      ...data,
      shifts: migrateFlat(data.shifts),
      overtime: migrateFlat(data.overtime),
      requests: migrateFlat(data.requests),
    };
  } catch {
    return emptyMonthData();
  }
};

export { monthKey, migrateFlat, loadMonthData };

export default function useMonthNavigation() {
  const now = new Date();

  const [year, setYear] = useState(() => {
    try {
      const stored = localStorage.getItem("grafik-current");
      return stored ? JSON.parse(stored).year : now.getFullYear();
    } catch {
      return now.getFullYear();
    }
  });

  const [month, setMonth] = useState(() => {
    try {
      const stored = localStorage.getItem("grafik-current");
      return stored ? JSON.parse(stored).month : now.getMonth();
    } catch {
      return now.getMonth();
    }
  });

  const [monthData, setMonthData] = useState(() => loadMonthData(year, month));

  useEffect(() => {
    localStorage.setItem("grafik-current", JSON.stringify({ year, month }));
  }, [year, month]);

  useEffect(() => {
    localStorage.setItem(monthKey(year, month), JSON.stringify(monthData));
  }, [year, month, monthData]);

  const changeMonth = useCallback((delta) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setYear(newYear);
    setMonth(newMonth);
    setMonthData(loadMonthData(newYear, newMonth));
  }, [month, year]);

  return { year, setYear, month, setMonth, monthData, setMonthData, changeMonth };
}
