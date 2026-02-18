import { getShiftDisplay } from "../utils";

export default function ShiftCell({ value, isWeekendDay, onClick, onContextMenu }) {
  const disp = getShiftDisplay(value);
  const bg = value ? disp.color : isWeekendDay ? "bg-gray-100" : "";
  const isCustom = value?.startsWith("C:");
  return (
    <td className={"border border-gray-300 text-center cursor-pointer select-none transition-colors duration-75 hover:bg-gray-200 " + bg + " " + (isCustom ? "text-[7px] font-bold leading-none" : "text-lg font-bold")}
      style={{ width: 28, minWidth: 28, maxWidth: 28, height: 28, padding: 0 }}
      onClick={onClick} onContextMenu={onContextMenu} title={disp.tooltip}>{isCustom ? <>{disp.label.split("|")[0]}<br/>{disp.label.split("|")[1]}</> : disp.label}</td>
  );
}
