import { useSchedule } from "../hooks/useSchedule";
import CustomShiftModal from "./CustomShiftModal";
import OvertimeModal from "./OvertimeModal";
import NoteModal from "./NoteModal";
import ConfirmModal from "./ConfirmModal";

export default function ModalLayer() {
  const {
    customModal, setCustomModal,
    overtimeModal, setOvertimeModal,
    noteModal, setNoteModal,
    confirmModal, setConfirmModal,
    employees, setShift, setOT, saveNote,
  } = useSchedule();

  return (
    <>
      {customModal && (
        <CustomShiftModal
          empName={customModal.empName}
          day={customModal.day}
          initial={customModal.initial}
          remainingHours={customModal.remainingHours}
          onSave={val => { setShift(customModal.empId, customModal.day, val); setCustomModal(null); }}
          onClose={() => setCustomModal(null)}
        />
      )}
      {overtimeModal && (
        <OvertimeModal
          employees={employees}
          initial={overtimeModal}
          onSave={({ empId, day, value }) => { setOT({ empId, day, value }); setOvertimeModal(null); }}
          onClose={() => setOvertimeModal(null)}
        />
      )}
      {noteModal && (
        <NoteModal
          empName={noteModal.empName}
          day={noteModal.day}
          current={noteModal.current}
          onSave={note => { saveNote(noteModal, note); setNoteModal(null); }}
          onClose={() => setNoteModal(null)}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
