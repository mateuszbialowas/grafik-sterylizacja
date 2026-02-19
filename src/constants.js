export const SHIFT_TYPES = {
  D: { label: "D", color: "bg-[#dbeafe] text-[#193cb8]", name: "7:00–19:00", hours: 12, startH: 7, startM: 0, endH: 19, endM: 0 },
  "D*": { label: "D*", color: "bg-[#fef3c6] text-[#973c00]", name: "8:00–20:00", hours: 12, startH: 8, startM: 0, endH: 20, endM: 0 },
  R: { label: "R", color: "bg-[#dcfce7] text-[#016630] border-[#b9f8cf]", name: "7:00–14:35", hours: 7 + 35 / 60, startH: 7, startM: 0, endH: 14, endM: 35 },
  ".": { label: "•", color: "bg-[#f3e8ff] text-[#6b21a8]", name: "Pod telefonem", hours: 0 },
};

export const SHIFT_CYCLE = ["", "D", "D*", "R"];

export const MONTHS_PL = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];

export const DAILY_NORM = 7 + 35 / 60;
