export const SHIFT_TYPES = {
  D: { label: "D", color: "bg-blue-100 text-blue-800", name: "7:00–19:00", hours: 12, startH: 7, startM: 0, endH: 19, endM: 0 },
  "D*": { label: "D*", color: "bg-amber-100 text-amber-800", name: "8:00–20:00", hours: 12, startH: 8, startM: 0, endH: 20, endM: 0 },
  R: { label: "R", color: "bg-green-100 text-green-800", name: "7:00–14:35", hours: 7 + 35 / 60, startH: 7, startM: 0, endH: 14, endM: 35 },
};

export const SHIFT_CYCLE = ["", "D", "D*", "R"];

export const MONTHS_PL = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];

export const DAILY_NORM = 7 + 35 / 60;
