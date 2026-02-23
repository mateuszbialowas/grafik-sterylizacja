import { SHIFT_TYPES, DAILY_NORM } from "./constants";

// --- Date utilities ---

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getDayName(year, month, day) {
  return ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"][new Date(year, month, day).getDay()];
}

export function isWeekend(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 || dow === 6;
}

export function getWorkingDays(year, month) {
  let count = 0;
  for (let day = 1; day <= getDaysInMonth(year, month); day++) {
    const dow = new Date(year, month, day).getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

export function getMonthlyNorm(year, month) {
  return getWorkingDays(year, month) * DAILY_NORM;
}

// --- Sanitization ---

const HTML_ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

// --- Time formatting ---

export function formatHours(hours) {
  const sign = hours < 0 ? "-" : "";
  const abs = Math.abs(hours);
  const hrs = Math.floor(abs);
  const mins = Math.round((abs - hrs) * 60);
  return mins > 0 ? sign + hrs + ":" + String(mins).padStart(2, "0") : sign + hrs;
}

export function formatTime(h, m) {
  return h + ":" + String(m).padStart(2, "0");
}

export function formatTimeRange(startH, startM, endH, endM) {
  return formatTime(startH, startM) + "-" + formatTime(endH, endM);
}

// --- Time parsing ---

export function calcHourSpan(startH, startM, endH, endM) {
  const start = startH + (startM || 0) / 60;
  const end = endH + (endM || 0) / 60;
  if (start === end) return 0;
  return end > start ? end - start : 24 - start + end;
}

export function parseTimeRange(val) {
  if (!val) return null;
  const raw = val.startsWith("C:") ? val.slice(2) : val;
  const parts = raw.split("-");
  if (parts.length !== 2) return null;
  const [startH, startM] = parts[0].split(":").map(Number);
  const [endH, endM] = parts[1].split(":").map(Number);
  return {
    startH, startM: startM || 0,
    endH, endM: endM || 0,
    hours: calcHourSpan(startH, startM || 0, endH, endM || 0),
  };
}

export function parseCustomShift(val) {
  if (!val || !val.startsWith("C:")) return null;
  return parseTimeRange(val);
}

export function parseOvertimeVal(val) {
  if (!val) return null;
  return parseTimeRange(val);
}

// --- Shift data ---

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
    const sl = formatTime(custom.startH, custom.startM);
    const el = formatTime(custom.endH, custom.endM);
    return {
      label: sl + "|" + el,
      color: "bg-pink-100 text-pink-800",
      tooltip: sl + "–" + el + " (" + formatHours(custom.hours) + "h)",
    };
  }
  const shift = SHIFT_TYPES[val];
  return shift
    ? { label: shift.label, color: shift.color, tooltip: shift.name + " (" + formatHours(shift.hours) + "h)" }
    : { label: "", color: "", tooltip: "" };
}

export function getDefaultTimes(val) {
  if (!val || val === "") return { startH: 7, startM: 0, endH: 14, endM: 35 };
  const custom = parseCustomShift(val);
  if (custom) return custom;
  const shift = SHIFT_TYPES[val];
  if (shift) return { startH: shift.startH, startM: shift.startM, endH: shift.endH, endM: shift.endM };
  return { startH: 7, startM: 0, endH: 14, endM: 35 };
}
