import { useRef, useEffect } from "react";

export default function Modal({ onClose, onEnter, className, children }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        className={"bg-white rounded-[14px] shadow-[0px_8px_24px_rgba(0,0,0,0.15)] p-6 " + (className || "min-w-[420px]")}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && onEnter) onEnter();
        }}
      >
        {children}
      </div>
    </div>
  );
}
