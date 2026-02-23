import { SHIFT_TYPES } from "../constants";
import { ContextMenuOverlay, MenuItem, MenuDivider } from "./ContextMenu";
import { IconClock, IconEdit, IconTrash } from "./Icons";

const SHIFT_MENU_ITEMS = Object.entries(SHIFT_TYPES).map(([key, shift]) => ({
  key,
  label: shift.menuLabel,
  badge: shift.label,
  badgeClass: shift.menuColor,
  fontSize: key === "." ? "text-[14px]" : "text-[11px]",
}));

export default function ShiftContextMenu({ menu, onClose, onSelect, onNoteClick, onDeleteNote }) {
  return (
    <ContextMenuOverlay menu={menu} onClose={onClose}>
      {SHIFT_MENU_ITEMS.map(({ key, label, badge, badgeClass, fontSize }) => (
        <MenuItem key={key} onClick={() => onSelect(key)}>
          <span className={"size-5 rounded font-bold flex items-center justify-center " + fontSize + " " + badgeClass}>{badge}</span>
          {label}
        </MenuItem>
      ))}
      <MenuDivider />
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
