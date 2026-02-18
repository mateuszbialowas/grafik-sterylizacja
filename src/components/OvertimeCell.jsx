import { parseOvertimeVal } from "../utils";

export default function OvertimeCell({ value, isWeekendDay, onClick }) {
  if (!value) return <td className={"border border-gray-300 text-center cursor-pointer select-none hover:bg-orange-50 " + (isWeekendDay ? "bg-gray-100" : "")} style={{ width: 36, minWidth: 36, maxWidth: 36, height: 36, padding: 0 }} onClick={onClick} />;
  const parsed = parseOvertimeVal(value);
  const l1 = parsed ? parsed.startH + ":" + String(parsed.startM).padStart(2,"0") : "";
  const l2 = parsed ? parsed.endH + ":" + String(parsed.endM).padStart(2,"0") : value;
  return <td className="border border-gray-300 text-center cursor-pointer select-none bg-orange-100 text-orange-800 text-[11px] font-bold leading-tight hover:bg-orange-200" style={{ width: 36, minWidth: 36, maxWidth: 36, height: 36, padding: 0 }} onClick={onClick}>{l1}<br/>{l2}</td>;
}
