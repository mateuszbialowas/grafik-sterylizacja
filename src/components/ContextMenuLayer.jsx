import { useCallback } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { ContextMenuOverlay, MenuItem } from "./ContextMenu";
import ShiftContextMenu from "./ShiftContextMenu";
import { IconEdit, IconTrash } from "./Icons";

export default function ContextMenuLayer() {
  const {
    shiftMenu, closeShiftMenu,
    empMenu, closeEmpMenu,
    otMenu, closeOtMenu,
    setData, setShift, requests,
    setCustomModal, setNoteModal, setConfirmModal, setOvertimeModal, setEditingEmployeeId,
    removeOT, getCustomModalData, employees,
  } = useSchedule();

  const handleShiftMenuSelect = useCallback((action) => {
    if (!shiftMenu) return;
    const { empId, day } = shiftMenu;
    if (action === "custom") {
      setCustomModal(getCustomModalData(empId, day));
    } else {
      setShift(empId, day, action);
    }
    closeShiftMenu();
  }, [shiftMenu, getCustomModalData, setShift, closeShiftMenu, setCustomModal]);

  const handleRequestClick = useCallback(() => {
    if (!shiftMenu) return;
    const { empId, day } = shiftMenu;
    const emp = employees.find(emp => emp.id === empId);
    setNoteModal({ empId, day, empName: emp?.name || "", current: requests[empId]?.[day] || "" });
    closeShiftMenu();
  }, [shiftMenu, employees, requests, setNoteModal, closeShiftMenu]);

  return (
    <>
      <ShiftContextMenu
        menu={shiftMenu}
        onClose={closeShiftMenu}
        onSelect={handleShiftMenuSelect}
        onNoteClick={handleRequestClick}
        onDeleteNote={() => {
          const { empId, day } = shiftMenu;
          setData(prev => {
            const empRequests = { ...prev.requests[empId] };
            delete empRequests[day];
            return { ...prev, requests: { ...prev.requests, [empId]: empRequests } };
          });
          closeShiftMenu();
        }}
      />

      <ContextMenuOverlay menu={empMenu} onClose={closeEmpMenu}>
        <MenuItem onClick={() => {
          setEditingEmployeeId(empMenu.empId);
          closeEmpMenu();
        }}>
          <IconEdit />
          Edytuj nazwisko
        </MenuItem>
        <MenuItem onClick={() => {
          const { empId, empName } = empMenu;
          closeEmpMenu();
          setConfirmModal({
            title: "Usuń pracownika",
            message: "Czy na pewno chcesz usunąć pracownika " + empName + "? Wszystkie dane zmian zostaną utracone.",
            onConfirm: () => {
              setData(prev => {
                const newShifts = { ...prev.shifts }; delete newShifts[empId];
                const newOvertime = { ...prev.overtime }; delete newOvertime[empId];
                const newRequests = { ...prev.requests }; delete newRequests[empId];
                const newNormOverrides = { ...prev.normOverrides }; delete newNormOverrides[empId];
                return { ...prev, employees: prev.employees.filter(emp => emp.id !== empId), shifts: newShifts, overtime: newOvertime, requests: newRequests, normOverrides: newNormOverrides };
              });
              setConfirmModal(null);
            },
          });
        }} destructive>
          <IconTrash />
          Usuń pracownika
        </MenuItem>
      </ContextMenuOverlay>

      <ContextMenuOverlay menu={otMenu} onClose={closeOtMenu}>
        <MenuItem onClick={() => {
          const { empId, day, parsed } = otMenu;
          setOvertimeModal({ empId, day, startH: parsed?.startH ?? 15, startM: parsed?.startM ?? 0, endH: parsed?.endH ?? 19, endM: parsed?.endM ?? 0 });
          closeOtMenu();
        }}>
          <IconEdit />
          Edytuj nadgodziny
        </MenuItem>
        <MenuItem onClick={() => {
          const { empId, empName, day } = otMenu;
          closeOtMenu();
          setConfirmModal({
            title: "Usuń nadgodziny",
            message: "Czy na pewno chcesz usunąć nadgodziny dla " + empName + " (dzień " + day + ")?",
            onConfirm: () => { removeOT(empId, day); setConfirmModal(null); },
          });
        }} destructive>
          <IconTrash />
          Usuń nadgodziny
        </MenuItem>
      </ContextMenuOverlay>
    </>
  );
}
