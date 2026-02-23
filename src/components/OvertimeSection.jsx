import { useSchedule } from "../hooks/useSchedule";
import { isWeekend, formatHours, parseOvertimeVal } from "../utils";
import { COL_WIDTH, ROW_HEIGHT } from "../constants";
import OvertimeCell from "./OvertimeCell";
import { IconPlus } from "./Icons";

export default function OvertimeSection() {
  const {
    year, month, employees, overtime, overtimeEmployeeIds, daysInMonth, calcOT,
    setOvertimeModal, openOtMenu,
  } = useSchedule();

  return (
    <>
      <tr>
        <td colSpan={daysInMonth + 3} className="p-0 border-0 bg-gradient-to-r from-[#fff7ed] to-[#fffbeb] border-t border-b border-[#ffedd4]" style={{ height: ROW_HEIGHT.overtimeHeader }}>
          <div className="sticky left-0 flex items-center justify-between px-3 h-full" style={{ width: 'min(100%, calc(100vw - 1rem))' }}>
            <h3 className="text-[15px] font-semibold text-gray-900 tracking-[-0.3px] leading-6">Nadgodziny</h3>
            <button onClick={() => setOvertimeModal({ empId: employees[0]?.id, day: 1, startH: 15, startM: 0, endH: 19, endM: 0 })} className="h-8 px-2.5 bg-[#f54900] text-white rounded-lg text-[13px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#dc4100] flex items-center gap-1.5 shrink-0">
              <IconPlus />
              Dodaj nadgodziny
            </button>
          </div>
        </td>
      </tr>
      {overtimeEmployeeIds.length > 0 && <>
        <tr className="bg-gradient-to-r from-[#fff7ed] to-[#fffbeb]" style={{ height: ROW_HEIGHT.overtimeSubHeader }}>
          <td className="border border-gray-200 px-1.5 py-0.5 text-left sticky left-0 bg-[#fff7ed] z-30 text-[13px] font-normal text-gray-600 tracking-[-0.15px]">Pracownik</td>
          <td className="border border-gray-200 px-1 py-0.5 text-center bg-[#fff7ed]"></td>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isWeekendDay = isWeekend(year, month, day);
            return <td key={day} className={"border border-gray-200 text-center font-bold " + (isWeekendDay ? "bg-red-50 text-red-700" : "text-gray-900")} style={{ padding: 0 }}>
              <div className="text-[13px] font-bold leading-4 tracking-[-0.15px]">{day}</div>
            </td>;
          })}
          <td className="border border-gray-200 px-1 py-0.5 text-center bg-[#fff7ed] text-[12px] font-normal text-gray-600 tracking-[-0.15px] leading-4">Nadg.</td>
        </tr>
        {employees.filter(emp => overtimeEmployeeIds.includes(emp.id)).map(emp => {
          const overtimeHours = calcOT(emp.id);
          return (
            <tr key={"ot-" + emp.id}>
              <td className="border border-gray-200 px-1.5 py-0 sticky left-0 bg-white z-20 text-[14px] font-semibold text-gray-900 tracking-[-0.2px] leading-5 overflow-hidden text-ellipsis whitespace-nowrap" style={{ height: ROW_HEIGHT.employee, maxWidth: COL_WIDTH.name }}>{emp.name}</td>
              <td className="border border-gray-200 bg-white"></td>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const existing = overtime[emp.id]?.[day];
                return <OvertimeCell key={day} value={existing || ""} isWeekendDay={isWeekend(year, month, day)} onClick={() => {
                  if (!existing) setOvertimeModal({ empId: emp.id, day, startH: 15, startM: 0, endH: 19, endM: 0 });
                }} onContextMenu={e => {
                  if (!existing) return;
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const parsed = parseOvertimeVal(existing);
                  openOtMenu({ empId: emp.id, empName: emp.name, day, x: rect.left, y: rect.bottom, value: existing, parsed });
                }} />;
              })}
              <td className="border border-gray-200 px-1 py-0 text-center font-bold text-[#c2410c] bg-[#fff7ed] text-[13px]">{overtimeHours > 0 ? formatHours(overtimeHours) : "–"}</td>
            </tr>
          );
        })}
      </>}
    </>
  );
}
