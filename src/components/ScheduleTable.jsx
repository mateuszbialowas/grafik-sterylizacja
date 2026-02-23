import { useCallback } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { isWeekend } from "../utils";
import { DAY_NAMES_PL, COL_WIDTH, ROW_HEIGHT } from "../constants";
import { DEFAULT_EMPLOYEES, DEFAULT_MONTH_DATA } from "../defaultData";
import EmployeeRow from "./EmployeeRow";
import AddEmployeeRow from "./AddEmployeeRow";
import OvertimeSection from "./OvertimeSection";

export default function ScheduleTable() {
  const { year, month, employees, daysInMonth, importJson } = useSchedule();

  const loadSampleData = useCallback(() => {
    importJson(JSON.stringify({
      year: 2026,
      month: 1,
      employees: DEFAULT_EMPLOYEES,
      ...DEFAULT_MONTH_DATA,
    }));
  }, [importJson]);

  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-x-auto overflow-y-hidden">
      <table className="border-collapse w-auto">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100" style={{ height: ROW_HEIGHT.header }}>
            <th className="border border-gray-200 px-1.5 py-0.5 text-left sticky left-0 bg-gray-50 z-30 text-[15px] font-semibold text-gray-900 tracking-[-0.25px] leading-5" style={{ width: COL_WIDTH.name, minWidth: COL_WIDTH.name }}>
              Pracownik
            </th>
            <th className="border border-gray-200 px-0.5 py-0.5 text-center bg-gray-50 text-[13px] font-normal text-gray-600 tracking-[-0.15px] leading-4" style={{ width: COL_WIDTH.norm, minWidth: COL_WIDTH.norm }}>
              Norma
            </th>
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isWeekendDay = isWeekend(year, month, day);
              return (
                <th key={day} className={"border border-gray-200 text-center " + (isWeekendDay ? "bg-red-50" : "")} style={{ width: COL_WIDTH.day, minWidth: COL_WIDTH.day, maxWidth: COL_WIDTH.day, padding: 0 }}>
                  <div className={"text-[11px] font-normal leading-3 " + (isWeekendDay ? "text-red-600" : "text-gray-500")}>
                    {DAY_NAMES_PL[new Date(year, month, day).getDay()]}
                  </div>
                  <div className={"text-[14px] font-bold leading-5 tracking-[-0.15px] " + (isWeekendDay ? "text-red-700" : "text-gray-900")}>
                    {day}
                  </div>
                </th>
              );
            })}
            <th className="border border-gray-200 px-0.5 py-0.5 text-center bg-gray-50 text-[13px] font-normal text-gray-600 tracking-[-0.15px] leading-4" style={{ width: COL_WIDTH.summary, minWidth: COL_WIDTH.summary }}>
              Godz.<br/>wypr.
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <EmployeeRow key={emp.id} employee={emp} />
          ))}
          {employees.length === 0 && (
            <tr>
              <td className="border border-gray-200" colSpan={daysInMonth + 3}>
                <div className="sticky left-0 flex flex-col items-center justify-center py-10 gap-3" style={{ width: "min(100%, calc(100vw - 1rem))" }}>
                  <p className="text-[15px] text-gray-500 tracking-[-0.15px]">
                    Brak pracowników. Dodaj pierwszego poniżej lub załaduj przykładowe dane.
                  </p>
                  <button
                    onClick={loadSampleData}
                    className="h-8 px-4 bg-gray-950 text-white text-[13px] font-medium tracking-[-0.15px] rounded-lg hover:bg-gray-900"
                  >
                    Załaduj przykładowe dane
                  </button>
                </div>
              </td>
            </tr>
          )}
          <AddEmployeeRow />
          <OvertimeSection />
        </tbody>
      </table>
    </div>
  );
}
