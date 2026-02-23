import { useState, useRef, useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { MONTHS_PL, TIMEOUTS } from "../constants";
import { formatHours } from "../utils";
import printSchedule from "../utils/printSchedule";
import Tooltip from "./Tooltip";
import { IconPrinter, IconMoreVertical, IconDownload, IconUpload, IconCode, IconChevronLeft, IconChevronRight, IconCalendar, IconEditSmall } from "./Icons";

export default function ScheduleHeader() {
  const {
    year, month, workingDays, workingDaysOverride, autoWorkingDays,
    monthlyNorm, allNormsOk, employees, shifts, overtime, normOverrides,
    daysInMonth, overtimeEmployeeIds,
    changeMonth, setData, exportJson, importJson, showToast, getEmpNorm, calcOT,
  } = useSchedule();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [editingWorkingDays, setEditingWorkingDays] = useState(false);
  const [titleClicks, setTitleClicks] = useState(0);
  const [sunEasterEgg, setSunEasterEgg] = useState(false);
  const moreMenuRef = useRef(null);
  const titleClickTimer = useRef(null);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handler = (e) => { if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMoreMenu]);

  const handleTitleClick = () => {
    const next = titleClicks + 1;
    setTitleClicks(next);
    clearTimeout(titleClickTimer.current);
    if (next >= 5) {
      setSunEasterEgg(true);
      setTitleClicks(0);
      setTimeout(() => setSunEasterEgg(false), TIMEOUTS.easterEggDisplay);
    } else {
      titleClickTimer.current = setTimeout(() => setTitleClicks(0), TIMEOUTS.easterEggReset);
    }
  };

  const handlePrint = () => printSchedule({
    year, month, employees, shifts, overtime, normOverrides,
    daysInMonth, workingDays, monthlyNorm, overtimeEmployeeIds, getEmpNorm, calcOT,
  });

  const downloadJson = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grafik-${MONTHS_PL[month]}-${year}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
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
    setShowMoreMenu(false);
  };

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] px-[12px] pt-[10px] pb-[10px] mb-2 flex flex-col gap-[10px]">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <h1 className="text-[18px] tracking-[-0.4px] leading-[26px] cursor-default min-w-0 truncate" onClick={handleTitleClick}>
          <span className="font-bold text-gray-900">Rozkład pracy Techników Sterylizacji</span>
          <span className="font-normal text-gray-500"> — Centralna Sterylizacja</span>
        </h1>
        <div className="flex gap-[8px] shrink-0">
          <button onClick={handlePrint} className="h-[32px] px-[8px] bg-white border border-black/10 rounded-[8px] flex items-center justify-center gap-[6px] hover:bg-gray-50">
            <IconPrinter />
            <span className="text-[14px] font-medium text-neutral-950 tracking-[-0.15px] leading-[20px] hidden sm:inline">Drukuj</span>
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="size-[32px] bg-white border border-black/10 rounded-[8px] flex items-center justify-center hover:bg-gray-50">
              <IconMoreVertical />
            </button>
            {showMoreMenu && (
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
                <button onClick={() => { setShowJson(!showJson); setShowMoreMenu(false); }} className="w-full text-left px-3 py-2 text-[14px] text-gray-900 tracking-[-0.15px] leading-5 hover:bg-gray-100 flex items-center gap-2.5">
                  <IconCode />
                  {showJson ? "Ukryj JSON" : "Zobacz JSON"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[10px]">
        <div className="flex items-center gap-[6px] bg-gray-50 border border-gray-200 rounded-[8px] h-[42px] px-[10px]">
          <button onClick={() => changeMonth(-1)} className="size-[30px] bg-white rounded-[4px] flex items-center justify-center hover:bg-gray-100">
            <IconChevronLeft />
          </button>
          <div className="flex items-center gap-[6px] px-[10px]">
            <IconCalendar />
            <span className="text-[14px] font-semibold text-neutral-950 tracking-[-0.15px] leading-[20px]">{MONTHS_PL[month]} {year}</span>
          </div>
          <button onClick={() => changeMonth(1)} className="size-[30px] bg-white rounded-[4px] flex items-center justify-center hover:bg-gray-100">
            <IconChevronRight />
          </button>
        </div>
        <div className={"flex items-center gap-3 rounded-[8px] h-[42px] px-3.5 border " + (workingDaysOverride != null ? "bg-[#eef2ff] border-[#a3b3ff]" : "bg-gray-50 border-gray-200")}>
          <div className="flex items-center gap-1.5">
            <span className={"text-[11px] font-semibold uppercase tracking-[0.3px] leading-3 " + (workingDaysOverride != null ? "text-[#432dd7]" : "text-gray-600")}>Norma:</span>
            <span className={"text-[18px] font-bold tracking-[-0.4px] leading-6 " + (workingDaysOverride != null ? "text-[#312c85]" : "text-gray-900")}>{formatHours(monthlyNorm)}</span>
            <span className={"text-[11px] font-normal leading-3 " + (workingDaysOverride != null ? "text-[#4f39f6]" : "text-gray-600")}>h</span>
          </div>
          <div className={"w-px h-7 " + (workingDaysOverride != null ? "bg-[#a3b3ff]" : "bg-gray-300")} />
          <div className="flex items-center gap-1.5">
            <span className={"text-[11px] font-semibold uppercase tracking-[0.3px] leading-3 " + (workingDaysOverride != null ? "text-[#432dd7]" : "text-gray-600")}>Dni rob.:</span>
            {workingDaysOverride != null && <Tooltip text="Dni robocze zmienione ręcznie"><IconEditSmall /></Tooltip>}
            {editingWorkingDays ? (
              <input autoFocus defaultValue={workingDays} className={"w-8 text-[18px] font-bold tracking-[-0.4px] leading-6 bg-white border rounded px-0.5 text-center outline-none " + (workingDaysOverride != null ? "text-[#312c85] border-[#a3b3ff]" : "text-gray-900 border-gray-300")}
                onBlur={e => { const val = parseInt(e.target.value); if (!isNaN(val) && val > 0) { setData(prev => ({ ...prev, workingDaysOverride: val === autoWorkingDays ? null : val })); } setEditingWorkingDays(false); }}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingWorkingDays(false); }} />
            ) : (
              <Tooltip text={workingDaysOverride != null ? "Zmienione ręcznie \u2022 Prawy klik aby edytować" : "Prawy klik aby edytować"}><span className={"text-[18px] font-bold tracking-[-0.4px] leading-6 cursor-pointer " + (workingDaysOverride != null ? "text-[#312c85]" : "text-gray-900")} onContextMenu={e => { e.preventDefault(); setEditingWorkingDays(true); }}>{workingDays}</span></Tooltip>
            )}
            <span className={"text-[11px] font-normal leading-3 " + (workingDaysOverride != null ? "text-[#4f39f6]" : "text-gray-600")}>({"\u00d7"} 7:35h)</span>
          </div>
        </div>
        {(allNormsOk || sunEasterEgg) && (
          allNormsOk
            ? <Tooltip text="Wszystkie normy się zgadzają!"><span className="text-[42px] leading-none cursor-default" style={{ animation: "sunAppear 0.4s ease-out, sunFloat 3s ease-in-out infinite 0.4s" }}>&#x1F31E;</span></Tooltip>
            : <span className="text-[42px] leading-none cursor-default" style={{ animation: "sunAppear 0.4s ease-out, sunFloat 3s ease-in-out infinite 0.4s" }}>&#x1F31E;</span>
        )}
      </div>
      {showJson && (
        <div className="mt-3 p-3 bg-gray-50 rounded"><textarea className="w-full h-40 text-xs font-mono border rounded p-2" defaultValue={exportJson()} onBlur={e => importJson(e.target.value)} /><p className="text-xs text-gray-500 mt-1">Edytuj JSON i kliknij poza pole, aby zaimportować.</p></div>
      )}
    </div>
  );
}
