import { useSchedule } from "../hooks/useSchedule";
import { MONTHS_PL } from "../constants";
import { IconChevronLeft, IconChevronRight, IconCalendar } from "./Icons";

export default function MonthNavigator() {
  const { year, month, changeMonth } = useSchedule();

  return (
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
  );
}
