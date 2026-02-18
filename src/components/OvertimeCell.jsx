import { parseOvertimeVal } from "../utils";

export default function OvertimeCell({ value, isWeekendDay, onClick }) {
  if (!value) return <td className={"border border-gray-300 text-center cursor-pointer select-none hover:bg-orange-50 " + (isWeekendDay ? "bg-gray-100" : "")} style={{ width: 28, minWidth: 28, maxWidth: 28, height: 28, padding: 0 }} onClick={onClick} />;
  const parsed = parseOvertimeVal(value);
  const l1 = parsed ? parsed.startH + ":" + String(parsed.startM).padStart(2,"0") : "";
  const l2 = parsed ? parsed.endH + ":" + String(parsed.endM).padStart(2,"0") : value;
  return <td className="border border-gray-300 text-center cursor-pointer select-none bg-orange-100 text-orange-800 text-[7px] font-bold leading-none hover:bg-orange-200" style={{ width: 28, minWidth: 28, maxWidth: 28, height: 28, padding: 0 }} onClick={onClick}>{l1}<br/>{l2}</td>;
}
