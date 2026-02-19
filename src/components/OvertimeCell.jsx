import { parseOvertimeVal } from "../utils";

export default function OvertimeCell({ value, isWeekendDay, onClick }) {
  if (!value) return <td className={"border border-[#e5e7eb] text-center cursor-pointer select-none hover:bg-orange-50 " + (isWeekendDay ? "bg-gray-100" : "")} style={{ width: 42, minWidth: 42, maxWidth: 42, height: 45, padding: 0 }} onClick={onClick} />;
  const parsed = parseOvertimeVal(value);
  const l1 = parsed ? parsed.startH + ":" + String(parsed.startM).padStart(2,"0") : "";
  const l2 = parsed ? parsed.endH + ":" + String(parsed.endM).padStart(2,"0") : value;
  return <td className="border border-[#e5e7eb] text-center cursor-pointer select-none bg-[#ffedd5] text-[#9a3412] text-[11px] font-bold leading-tight hover:bg-[#fed7aa]" style={{ width: 42, minWidth: 42, maxWidth: 42, height: 45, padding: 0 }} onClick={onClick}>{l1}<br/>{l2}</td>;
}
