import { getShiftDisplay } from "../utils";

export default function ShiftCell({ value, isWeekendDay, request, onClick, onContextMenu, onShiftClick }) {
  const disp = getShiftDisplay(value);
  const bg = value ? disp.color : isWeekendDay ? "bg-gray-100" : "";
  const isCustom = value?.startsWith("C:");
  const handleClick = (e) => {
    if (e.shiftKey) { onShiftClick(); return; }
    onClick();
  };
  return (
    <td className={"border border-[#e5e7eb] text-center cursor-pointer select-none transition-colors duration-75 hover:brightness-95 relative " + bg + " " + (isCustom ? "text-[10px] font-bold leading-tight" : "text-[16px] font-bold leading-6 tracking-[-0.3px]")}
      style={{ width: 38, minWidth: 38, maxWidth: 38, height: 40, padding: 0 }}
      onClick={handleClick} onContextMenu={onContextMenu}>
      {isCustom ? <>{disp.label.split("|")[0]}<br/>{disp.label.split("|")[1]}</> : disp.label}
      {request && (
        <span className="absolute -top-1 -right-1 group/note">
          <svg className="drop-shadow-sm" width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 1h7l4 4v7H2V1z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5"/><path d="M9 1v4h4" fill="#d97706"/><line x1="4.5" y1="6.5" x2="10" y2="6.5" stroke="#92400e" strokeWidth="0.8"/><line x1="4.5" y1="8.5" x2="10" y2="8.5" stroke="#92400e" strokeWidth="0.8"/><line x1="4.5" y1="10.5" x2="8" y2="10.5" stroke="#92400e" strokeWidth="0.8"/></svg>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded bg-[#1e1e2e] text-white text-[11px] leading-tight whitespace-nowrap opacity-0 group-hover/note:opacity-100 transition-opacity duration-100 z-50 max-w-[200px] whitespace-normal">{request}</span>
        </span>
      )}
    </td>
  );
}
