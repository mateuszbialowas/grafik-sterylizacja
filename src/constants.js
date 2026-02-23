export const SHIFT_TYPES = {
  D: { label: "D", menuLabel: "Dyżur (D)", color: "bg-[#dbeafe] text-[#193cb8]", menuColor: "bg-[#dbeafe] text-[#193cb8]", printBg: "#dbeafe", name: "7:00–19:00", hours: 12, startH: 7, startM: 0, endH: 19, endM: 0 },
  "D*": { label: "D*", menuLabel: "Dyżur* (D*)", color: "bg-[#fef3c6] text-[#973c00]", menuColor: "bg-[#fef3c6] text-[#973c00]", printBg: "#fef3c7", name: "8:00–20:00", hours: 12, startH: 8, startM: 0, endH: 20, endM: 0 },
  R: { label: "R", menuLabel: "Ranna (R)", color: "bg-[#dcfce7] text-[#016630] border-[#b9f8cf]", menuColor: "bg-[#dcfce7] text-[#016630]", printBg: "#dcfce7", name: "7:00–14:35", hours: 7 + 35 / 60, startH: 7, startM: 0, endH: 14, endM: 35 },
  ".": { label: "•", menuLabel: "Pod telefonem (.)", color: "bg-[#f3e8ff] text-[#6b21a8]", menuColor: "bg-[#f3e8ff] text-[#6b21a8]", printBg: "#f3e8ff", name: "Pod telefonem", hours: 0 },
};

export const CUSTOM_SHIFT_PRINT_BG = "#fce7f3";

export const SHIFT_CYCLE = ["", "D", "D*", "R"];

export const MONTHS_PL = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];

export const DAILY_NORM = 7 + 35 / 60;

export const DAY_NAMES_PL = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

export const COL_WIDTH = { name: 140, norm: 65, day: 38, summary: 70 };

export const ROW_HEIGHT = { header: 42, employee: 40, addRow: 44, overtimeHeader: 42, overtimeSubHeader: 32 };

export const TIMEOUTS = { easterEggReset: 1500, easterEggDisplay: 5000, toast: 3000, printCleanup: 1000 };

export const CELL_STYLE = { width: COL_WIDTH.day, minWidth: COL_WIDTH.day, maxWidth: COL_WIDTH.day, height: ROW_HEIGHT.employee, padding: 0 };
