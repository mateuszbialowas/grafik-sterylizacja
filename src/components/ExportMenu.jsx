import { useState, useRef, useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { MONTHS_PL } from "../constants";
import { IconMoreVertical, IconDownload, IconUpload, IconCode, IconTrash } from "./Icons";

export default function ExportMenu({ showJson, setShowJson }) {
  const { year, month, exportJson, importJson, clearAllData, showToast, setConfirmModal } = useSchedule();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const downloadJson = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grafik-${MONTHS_PL[month]}-${year}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
    showToast("Plik JSON został pobrany");
  };

  const handleImportFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { importJson(ev.target.result); };
      reader.readAsText(file);
    };
    input.click();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="size-[32px] bg-white border border-black/10 rounded-[8px] flex items-center justify-center hover:bg-gray-50">
        <IconMoreVertical />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-[10px] border border-gray-200 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px] z-50">
          <button onClick={downloadJson} className="w-full text-left px-3 py-2 text-[14px] text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-100 flex items-center gap-2.5">
            <IconDownload />
            Eksportuj JSON
          </button>
          <button onClick={handleImportFile} className="w-full text-left px-3 py-2 text-[14px] text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-100 flex items-center gap-2.5">
            <IconUpload />
            Importuj JSON
          </button>
          <div className="mx-2 my-1 h-px bg-gray-200" />
          <button onClick={() => { setShowJson(!showJson); setOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-100 flex items-center gap-2.5">
            <IconCode />
            {showJson ? "Ukryj JSON" : "Zobacz JSON"}
          </button>
          <div className="mx-2 my-1 h-px bg-gray-200" />
          <button onClick={() => {
            setOpen(false);
            setConfirmModal({
              title: "Wyczyścić wszystkie dane?",
              message: "Ta operacja usunie wszystkich pracowników, zmiany, nadgodziny i notatki ze wszystkich miesięcy. Tej operacji nie można cofnąć.",
              confirmLabel: "Wyczyść dane",
              onConfirm: () => { clearAllData(); setConfirmModal(null); },
            });
          }} className="w-full text-left px-3 py-2 text-[14px] text-red-600 tracking-[-0.15px] leading-5 hover:bg-red-50 flex items-center gap-2.5">
            <IconTrash />
            Wyczyść wszystkie dane
          </button>
        </div>
      )}
    </div>
  );
}
