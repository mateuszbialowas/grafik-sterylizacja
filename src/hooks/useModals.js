import { useState } from "react";

export default function useModals() {
  const [customModal, setCustomModal] = useState(null);
  const [overtimeModal, setOvertimeModal] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  return {
    customModal, setCustomModal,
    overtimeModal, setOvertimeModal,
    noteModal, setNoteModal,
    confirmModal, setConfirmModal,
    editingEmployeeId, setEditingEmployeeId,
  };
}
