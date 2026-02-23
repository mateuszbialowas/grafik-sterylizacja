import { ContextMenuOverlay, MenuItem, MenuDivider } from "./ContextMenu";
import { IconClock, IconEdit, IconTrash } from "./Icons";

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
        <IconClock />
        Niestandardowa (NS)...
      </MenuItem>
      <MenuItem onClick={() => onSelect("")}>
        <span className="size-5 rounded bg-gray-100 border border-gray-200 text-gray-400 text-[11px] font-normal flex items-center justify-center">—</span>
        Wolne
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={onNoteClick}>
        <IconEdit />
        {menu?.hasNote ? "Edytuj notatkę" : "Dodaj notatkę"}
      </MenuItem>
      {menu?.hasNote && (
        <MenuItem onClick={onDeleteNote} destructive>
          <IconTrash />
          Usuń notatkę
        </MenuItem>
      )}
    </ContextMenuOverlay>
  );
}
