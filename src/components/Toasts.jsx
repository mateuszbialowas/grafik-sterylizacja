import { IconError, IconSuccess } from "./Icons";

export default function Toasts({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={"flex items-center gap-2.5 px-4 py-3 rounded-[10px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] border text-[14px] font-medium tracking-[-0.15px] leading-5 animate-[fadeIn_0.2s_ease-out] " + (t.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-gray-200 text-gray-900")}>
          {t.type === "error" ? <IconError /> : <IconSuccess />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
