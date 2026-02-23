import { useSchedule } from "../context/ScheduleContext";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleTable from "./ScheduleTable";
import Legend from "./Legend";
import ContextMenuLayer from "./ContextMenuLayer";
import ModalLayer from "./ModalLayer";
import Toasts from "./Toasts";

export default function ScheduleApp() {
  const { toasts } = useSchedule();

  return (
    <div className="min-h-screen bg-gray-100 p-2 overflow-x-hidden" style={{ userSelect: "none" }}>
      <div className="max-w-full mx-auto">
        <ScheduleHeader />
        <ScheduleTable />
        <Legend />
      </div>
      <ContextMenuLayer />
      <ModalLayer />
      <Toasts toasts={toasts} />
    </div>
  );
}
