import { MONTHS_PL } from "../constants";
import { isWeekend, getDayName, formatHours, getShiftDisplay, parseCustomShift, parseOvertimeVal, getShiftHours } from "../utils";

export default function printSchedule({ year, month, employees, shifts, overtime, normOverrides, daysInMonth, workingDays, monthlyNorm, overtimeEmployeeIds, getEmpNorm, calcOT }) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const norm = formatHours(monthlyNorm);
  const colW = 30;
  const nameW = 130;
  const normW = 60;
  const sumW = 70;

  const calcHours = (eid) => { let h = 0; for (let d = 1; d <= daysInMonth; d++) h += getShiftHours(shifts[eid]?.[d]); return h; };

  const hdrCells = days.map(d => {
    const we = isWeekend(year, month, d);
    return '<th style="border:1px solid #999;padding:0;text-align:center;width:' + colW + 'px;min-width:' + colW + 'px;max-width:' + colW + 'px;' + (we ? "background:#fef2f2;color:#b91c1c;" : "") + '"><div style="font-size:9px;line-height:1.2">' + getDayName(year, month, d) + '</div><div style="font-size:14px;font-weight:bold">' + d + '</div></th>';
  }).join("");

  const rows = employees.map(emp => {
    const empNorm = getEmpNorm(emp.id);
    const empNormStr = formatHours(empNorm);
    const hrs = calcHours(emp.id);
    const diff = hrs - empNorm;
    const diffStr = (diff > 0 ? "+" : "") + formatHours(diff);
    const cells = days.map(d => {
      const v = shifts[emp.id]?.[d] || "";
      const disp = getShiftDisplay(v);
      const we = isWeekend(year, month, d);
      const bg = v === "." ? "#f3e8ff" : v.startsWith("C:") ? "#fce7f3" : v === "D" ? "#dbeafe" : v === "D*" ? "#fef3c7" : v === "R" ? "#dcfce7" : we ? "#f3f4f6" : "#fff";
      const cs = parseCustomShift(v);
      const cellLabel = cs ? cs.startH + ":" + String(cs.startM).padStart(2,"0") + "<br/>" + cs.endH + ":" + String(cs.endM).padStart(2,"0") : disp.label;
      const cellSize = cs ? "font-size:10px;line-height:1.1" : v === "." ? "font-size:20px" : "font-size:18px";
      const cellColor = v === "." ? "color:#6b21a8;" : "";
      return '<td style="border:1px solid #999;text-align:center;vertical-align:middle;padding:0;font-weight:bold;width:' + colW + 'px;min-width:' + colW + 'px;max-width:' + colW + 'px;height:32px;' + cellSize + ';' + cellColor + 'background:' + bg + '">' + cellLabel + '</td>';
    }).join("");
    return '<tr>'
      + '<td style="border:1px solid #999;padding:2px 5px;font-size:14px;font-weight:bold;width:' + nameW + 'px;max-width:' + nameW + 'px;height:32px;word-wrap:break-word;overflow-wrap:break-word;line-height:1.2">' + emp.name + '</td>'
      + '<td style="border:1px solid #999;text-align:center;padding:1px;font-size:15px;color:' + (normOverrides[emp.id] != null ? '#ea580c' : '#4338ca') + ';font-weight:bold;height:32px;width:' + normW + 'px">' + empNormStr + '</td>'
      + cells
      + '<td style="border:1px solid #999;text-align:center;vertical-align:middle;padding:1px 4px;height:32px;background:#f9fafb;width:' + sumW + 'px">' + (Math.abs(diff) < 0.01 ? '<div style="font-size:16px;font-weight:bold">' + formatHours(hrs) + '</div>' : '<div style="font-size:16px;font-weight:bold;line-height:1.1">' + formatHours(hrs) + '</div><div style="font-size:13px;line-height:1;color:' + (diff > 0 ? "orange" : "red") + '">' + diffStr + '</div>') + '</td>'
      + '</tr>';
  }).join("");

  let otRows = "";
  if (overtimeEmployeeIds.length > 0) {
    const otHdr = '<tr style="background:#fff7ed">'
      + '<td style="border:1px solid #999;padding:2px 5px;text-align:left;font-size:13px;font-weight:bold;color:#c2410c;width:' + nameW + 'px">Nadgodziny</td>'
      + '<td style="border:1px solid #999;width:' + normW + 'px"></td>'
      + days.map(d => '<td style="border:1px solid #999;text-align:center;font-size:13px;font-weight:bold;width:' + colW + 'px;min-width:' + colW + 'px;max-width:' + colW + 'px;padding:0">' + d + '</td>').join("")
      + '<td style="border:1px solid #999;text-align:center;font-size:12px;font-weight:bold;color:#c2410c;width:' + sumW + 'px">Nadg.</td>'
      + '</tr>';
    const empRows = employees.filter(emp => overtimeEmployeeIds.includes(emp.id)).map(emp => {
      const otH = calcOT(emp.id);
      const cells = days.map(d => {
        const v = overtime[emp.id]?.[d] || "";
        if (!v) return '<td style="border:1px solid #999;padding:0;width:' + colW + 'px;min-width:' + colW + 'px;max-width:' + colW + 'px"></td>';
        const p = parseOvertimeVal(v);
        const top = p ? p.startH + ":" + String(p.startM).padStart(2,"0") : "";
        const bot = p ? p.endH + ":" + String(p.endM).padStart(2,"0") : v;
        return '<td style="border:1px solid #999;text-align:center;padding:0;width:' + colW + 'px;min-width:' + colW + 'px;max-width:' + colW + 'px;font-size:11px;line-height:1.2;font-weight:bold;background:#ffedd5;color:#000">' + top + '<br/>' + bot + '</td>';
      }).join("");
      return '<tr>'
        + '<td style="border:1px solid #999;padding:2px 5px;font-size:14px;font-weight:bold;width:' + nameW + 'px;max-width:' + nameW + 'px;height:32px;word-wrap:break-word;overflow-wrap:break-word;line-height:1.2">' + emp.name + '</td>'
        + '<td style="border:1px solid #999;width:' + normW + 'px"></td>'
        + cells
        + '<td style="border:1px solid #999;text-align:center;font-weight:bold;color:#c2410c;font-size:15px;width:' + sumW + 'px">' + (otH > 0 ? formatHours(otH) : "–") + '</td>'
        + '</tr>';
    }).join("");
    otRows = '<tr><td colspan="' + (daysInMonth + 3) + '" style="border:0;height:10px"></td></tr>' + otHdr + empRows;
  }

  const html = '<!DOCTYPE html><html><head><title>Grafik - ' + MONTHS_PL[month] + ' ' + year + '</title><style>@page{size:landscape;margin:8mm}body{font-family:Arial,sans-serif;margin:0;padding:10px}table{border-collapse:collapse}@media print{.no-print{display:none!important}}</style></head><body>'
    + '<h2 style="font-size:20px;margin:0 0 6px">Rozkład pracy Techników Sterylizacji - Centralna Sterylizacja</h2>'
    + '<div style="font-size:15px;margin-bottom:10px;color:#3730a3"><b>Norma ' + MONTHS_PL[month] + ' ' + year + ': ' + norm + 'h</b> (' + workingDays + ' dni rob. × 7:35)</div>'
    + '<table style="border-collapse:collapse;table-layout:fixed"><thead><tr style="background:#f3f4f6">'
    + '<th style="border:1px solid #999;padding:2px 5px;text-align:left;font-size:14px;width:' + nameW + 'px">Pracownik</th>'
    + '<th style="border:1px solid #999;padding:0;text-align:center;font-size:13px;width:' + normW + 'px">Norma</th>'
    + hdrCells
    + '<th style="border:1px solid #999;padding:0;text-align:center;font-size:13px;width:' + sumW + 'px">Godz.<br/>wyprac.</th>'
    + '</tr></thead><tbody>' + rows + otRows + '</tbody></table>'
    + '<div style="display:flex;justify-content:space-between;margin-top:60px;padding:0 40px"><div style="text-align:center"><div style="border-top:1px solid black;width:280px;padding-top:6px;font-size:15px">Podpis pielęgniarki/położnej sporządzającej</div></div><div style="text-align:center"><div style="border-top:1px solid black;width:280px;padding-top:6px;font-size:15px">Akceptacja przełożonej</div></div></div>'
    + '<div style="margin-top:30px;font-size:14px;border-top:1px solid #ccc;padding-top:10px"><b>Legenda:</b> '
    + '<span style="background:#dbeafe;padding:2px 8px;margin:0 4px;font-weight:bold;font-size:15px">D</span> = 7:00–19:00 (12h) &nbsp; '
    + '<span style="background:#fef3c7;padding:2px 8px;margin:0 4px;font-weight:bold;font-size:15px">D*</span> = 8:00–20:00 (12h) &nbsp; '
    + '<span style="background:#dcfce7;padding:2px 8px;margin:0 4px;font-weight:bold;font-size:15px">R</span> = 7:00–14:35 (7:35h) &nbsp; '
    + '<span style="background:#f3e8ff;padding:2px 8px;margin:0 4px;font-weight:bold;font-size:15px;color:#6b21a8">•</span> = pod telefonem &nbsp; '
    + '<span style="background:#fce7f3;padding:2px 8px;margin:0 4px;font-weight:bold;font-size:13px">np. 7:00-11:30</span> = zmiana niestandardowa &nbsp; '
    + 'puste = wolne</div>'
    + '</body></html>';

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  document.body.appendChild(iframe);
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
}
