import { parseOvertimeVal, formatHours, formatTime } from "../utils";

export default function OvertimeCell({ value, isWeekendDay, onClick, onContextMenu }) {
  if (!value) return <td className={"border border-[#e5e7eb] text-center cursor-pointer select-none hover:bg-orange-50 " + (isWeekendDay ? "bg-gray-100" : "")} style={{ width: 38, minWidth: 38, maxWidth: 38, height: 40, padding: 0 }} onClick={onClick} />;
  const parsed = parseOvertimeVal(value);
  const startLabel = parsed ? formatTime(parsed.startH, parsed.startM) : "";
  const endLabel = parsed ? formatTime(parsed.endH, parsed.endM) : value;
  const tip = parsed ? startLabel + "–" + endLabel + " (" + formatHours(parsed.hours) + "h)" : value;
  return (
    <td className="border border-[#e5e7eb] text-center cursor-pointer select-none bg-[#ffedd5] text-[#9a3412] text-[10px] font-bold leading-tight hover:bg-[#fed7aa] relative group/ot" style={{ width: 38, minWidth: 38, maxWidth: 38, height: 40, padding: 0 }} onClick={onClick} onContextMenu={onContextMenu}>
      {startLabel}<br/>{endLabel}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/ot:opacity-100 transition-opacity duration-100 z-50">{tip}</span>
    </td>
  );
}
