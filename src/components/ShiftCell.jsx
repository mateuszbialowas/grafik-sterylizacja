import { getShiftDisplay } from "../utils";

export default function ShiftCell({ value, isWeekendDay, request, onClick, onContextMenu, onShiftClick }) {
  const disp = getShiftDisplay(value);
  const bg = value ? disp.color : isWeekendDay ? "bg-gray-100" : "";
  const isCustom = value?.startsWith("C:");
  const tooltip = request ? disp.tooltip + " | Prośba: " + request : disp.tooltip;
  const handleClick = (e) => {
    if (e.shiftKey) { onShiftClick(); return; }
    onClick();
  };
  return (
    <td className={"border border-gray-300 text-center cursor-pointer select-none transition-colors duration-75 hover:bg-gray-200 relative " + bg + " " + (isCustom ? "text-[11px] font-bold leading-tight" : "text-xl font-bold")}
      style={{ width: 36, minWidth: 36, maxWidth: 36, height: 36, padding: 0 }}
      onClick={handleClick} onContextMenu={onContextMenu} title={tooltip}>
      {isCustom ? <>{disp.label.split("|")[0]}<br/>{disp.label.split("|")[1]}</> : disp.label}
      {request && <span className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full" style={{ fontSize: 0 }} />}
    </td>
  );
}
