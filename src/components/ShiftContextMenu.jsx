import { ContextMenuOverlay, MenuItem, MenuDivider } from "./ContextMenu";

export default function ShiftContextMenu({ menu, onClose, onSelect, onNoteClick, onDeleteNote }) {
  return (
    <ContextMenuOverlay menu={menu} onClose={onClose}>
      <MenuItem onClick={() => onSelect("D")}>
        <span className="size-5 rounded bg-[#dbeafe] text-[#193cb8] text-[11px] font-bold flex items-center justify-center">D</span>
        Dyżur (D)
      </MenuItem>
      <MenuItem onClick={() => onSelect("D*")}>
        <span className="size-5 rounded bg-[#fef3c6] text-[#973c00] text-[11px] font-bold flex items-center justify-center">D*</span>
        Dyżur* (D*)
      </MenuItem>
      <MenuItem onClick={() => onSelect("R")}>
        <span className="size-5 rounded bg-[#dcfce7] text-[#016630] text-[11px] font-bold flex items-center justify-center">R</span>
        Ranna (R)
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={() => onSelect(".")}>
        <span className="size-5 rounded bg-[#f3e8ff] text-[#6b21a8] text-[14px] font-bold flex items-center justify-center">•</span>
        Pod telefonem (.)
      </MenuItem>
      <MenuItem onClick={() => onSelect("custom")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Niestandardowa (NS)...
      </MenuItem>
      <MenuItem onClick={() => onSelect("")}>
        <span className="size-5 rounded bg-[#f3f4f6] border border-[#e5e7eb] text-[#99a1af] text-[11px] font-normal flex items-center justify-center">—</span>
        Wolne
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={onNoteClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5565" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        {menu?.hasNote ? "Edytuj notatkę" : "Dodaj notatkę"}
      </MenuItem>
      {menu?.hasNote && (
        <MenuItem onClick={onDeleteNote} destructive>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Usuń notatkę
        </MenuItem>
      )}
    </ContextMenuOverlay>
  );
}
