import { ScheduleContext } from "../hooks/useSchedule";
import useScheduleData from "../hooks/useScheduleData";
import useToasts from "../hooks/useToasts";
import useModals from "../hooks/useModals";
import useContextMenu from "../hooks/useContextMenu";

export function ScheduleProvider({ children }) {
  const { toasts, showToast } = useToasts();
  const schedule = useScheduleData(showToast);
  const modals = useModals();
  const [shiftMenu, openShiftMenu, closeShiftMenu] = useContextMenu();
  const [empMenu, openEmpMenu, closeEmpMenu] = useContextMenu();
  const [otMenu, openOtMenu, closeOtMenu] = useContextMenu();

  const value = {
    ...schedule,
    toasts, showToast,
    ...modals,
    shiftMenu, openShiftMenu, closeShiftMenu,
    empMenu, openEmpMenu, closeEmpMenu,
    otMenu, openOtMenu, closeOtMenu,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}
