import { getShiftDisplay } from "../utils";
import { CELL_STYLE } from "../constants";
import { IconNote } from "./Icons";

export default function ShiftCell({ value, isWeekendDay, request, onClick, onContextMenu, onShiftClick }) {
  const disp = getShiftDisplay(value);
  const bg = value ? disp.color : isWeekendDay ? "bg-gray-100" : "";
  const isCustom = value?.startsWith("C:");
  const handleClick = (e) => {
    if (e.shiftKey) { onShiftClick(); return; }
    onClick();
  };
  return (
    <td className={"border border-gray-200 text-center cursor-pointer select-none transition-colors duration-75 hover:brightness-95 relative " + bg + " " + (isCustom ? "text-[10px] font-bold leading-tight" : "text-[16px] font-bold leading-6 tracking-[-0.3px]")}
      style={CELL_STYLE}
      onClick={handleClick} onContextMenu={onContextMenu}>
      {isCustom ? <>{disp.label.split("|")[0]}<br/>{disp.label.split("|")[1]}</> : disp.label}
      {request && (
        <span className="absolute -top-1 -right-1 group/note">
          <IconNote className="drop-shadow-sm" />
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/note:opacity-100 transition-opacity duration-100 z-50 max-w-[200px] whitespace-normal">{request}</span>
        </span>
      )}
    </td>
  );
}
