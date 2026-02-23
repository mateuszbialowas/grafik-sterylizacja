import { parseOvertimeVal, formatHours, formatTime } from "../utils";
import { CELL_STYLE } from "../constants";

export default function OvertimeCell({ value, isWeekendDay, onClick, onContextMenu }) {
  if (!value) return <td className={"border border-gray-200 text-center cursor-pointer select-none hover:bg-orange-50 " + (isWeekendDay ? "bg-gray-100" : "")} style={CELL_STYLE} onClick={onClick} />;
  const parsed = parseOvertimeVal(value);
  const startLabel = parsed ? formatTime(parsed.startH, parsed.startM) : "";
  const endLabel = parsed ? formatTime(parsed.endH, parsed.endM) : value;
  const tip = parsed ? startLabel + "–" + endLabel + " (" + formatHours(parsed.hours) + "h)" : value;
  return (
    <td className="border border-gray-200 text-center cursor-pointer select-none bg-[#ffedd5] text-[#9a3412] text-[10px] font-bold leading-tight hover:bg-[#fed7aa] relative group/ot" style={CELL_STYLE} onClick={onClick} onContextMenu={onContextMenu}>
      {startLabel}<br/>{endLabel}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/ot:opacity-100 transition-opacity duration-100 z-50">{tip}</span>
    </td>
  );
}
