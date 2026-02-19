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
    <td className={"border border-[#e5e7eb] text-center cursor-pointer select-none transition-colors duration-75 hover:brightness-95 relative " + bg + " " + (isCustom ? "text-[11px] font-bold leading-tight" : "text-[18px] font-bold leading-7 tracking-[-0.44px]")}
      style={{ width: 42, minWidth: 42, maxWidth: 42, height: 45, padding: 0 }}
      onClick={handleClick} onContextMenu={onContextMenu} title={tooltip}>
      {isCustom ? <>{disp.label.split("|")[0]}<br/>{disp.label.split("|")[1]}</> : disp.label}
      {request && <svg className="absolute top-0 right-0" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1h5l3 3v5H1V1z" fill="#f59e0b"/><path d="M6 1v3h3" fill="#d97706"/></svg>}
    </td>
  );
}
