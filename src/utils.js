import { SHIFT_TYPES, DAILY_NORM } from "./constants";

export function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
export function getDayName(y, m, d) { return ["Nd","Pn","Wt","Śr","Cz","Pt","So"][new Date(y, m, d).getDay()]; }
export function isWeekend(y, m, d) { const dow = new Date(y, m, d).getDay(); return dow === 0 || dow === 6; }
export function getWorkingDays(y, m) { let c = 0; for (let d = 1; d <= getDaysInMonth(y, m); d++) { const dow = new Date(y, m, d).getDay(); if (dow !== 0 && dow !== 6) c++; } return c; }
export function getMonthlyNorm(y, m) { return getWorkingDays(y, m) * DAILY_NORM; }

export function formatHours(h) {
  const sign = h < 0 ? "-" : "";
  const abs = Math.abs(h);
  const hrs = Math.floor(abs);
  const mins = Math.round((abs - hrs) * 60);
  return mins > 0 ? sign + hrs + ":" + String(mins).padStart(2, "0") : sign + hrs;
}

function calcHourSpan(sh, sm, eh, em) {
  const start = sh + (sm || 0) / 60;
  const end = eh + (em || 0) / 60;
  return end > start ? end - start : 24 - start + end;
}

export function parseCustomShift(val) {
  if (!val || !val.startsWith("C:")) return null;
  const parts = val.slice(2).split("-");
  if (parts.length !== 2) return null;
  const [sh, sm] = parts[0].split(":").map(Number);
  const [eh, em] = parts[1].split(":").map(Number);
  return { startH: sh, startM: sm || 0, endH: eh, endM: em || 0, hours: calcHourSpan(sh, sm, eh, em) };
}

export function parseOvertimeVal(val) {
  if (!val) return null;
  const parts = val.split("-");
  if (parts.length !== 2) return null;
  const [sh, sm] = parts[0].split(":").map(Number);
  const [eh, em] = parts[1].split(":").map(Number);
  return { startH: sh, startM: sm || 0, endH: eh, endM: em || 0, hours: calcHourSpan(sh, sm, eh, em) };
}

export function getShiftHours(val) {
  if (!val) return 0;
  const custom = parseCustomShift(val);
  if (custom) return custom.hours;
  return SHIFT_TYPES[val]?.hours || 0;
}

export function getShiftDisplay(val) {
  if (!val) return { label: "", color: "", tooltip: "Wolne" };
  const custom = parseCustomShift(val);
  if (custom) {
    const sl = custom.startH + ":" + String(custom.startM).padStart(2, "0");
    const el = custom.endH + ":" + String(custom.endM).padStart(2, "0");
    return { label: custom.startH + ":" + String(custom.startM).padStart(2,"0") + "|" + custom.endH + ":" + String(custom.endM).padStart(2,"0"), color: "bg-pink-100 text-pink-800", tooltip: sl + "–" + el + " (" + formatHours(custom.hours) + "h)" };
  }
  const s = SHIFT_TYPES[val];
  return s ? { label: s.label, color: s.color, tooltip: s.name + " (" + formatHours(s.hours) + "h)" } : { label: "", color: "", tooltip: "" };
}

export function getDefaultTimes(val) {
  if (!val || val === "") return { startH: 7, startM: 0, endH: 14, endM: 35 };
  const custom = parseCustomShift(val);
  if (custom) return custom;
  const st = SHIFT_TYPES[val];
  if (st) return { startH: st.startH, startM: st.startM, endH: st.endH, endM: st.endM };
  return { startH: 7, startM: 0, endH: 14, endM: 35 };
}

