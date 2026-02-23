export function ContextMenuOverlay({ menu, onClose, children }) {
  if (!menu) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose} onContextMenu={e => { e.preventDefault(); onClose(); }}>
      <div className="absolute bg-white rounded-[10px] border border-gray-200 shadow-[0px_4px_16px_rgba(0,0,0,0.12)] py-1.5 min-w-[200px]" style={{ left: menu.x, top: menu.y }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function MenuItem({ onClick, destructive, children }) {
  return (
    <button onClick={onClick} className={"w-full text-left px-3 py-2 text-[14px] tracking-[-0.15px] leading-5 flex items-center gap-2.5 " + (destructive ? "text-red-600 hover:bg-red-50" : "text-gray-900 hover:bg-gray-100")}>
      {children}
    </button>
  );
}

export function MenuDivider() {
  return <div className="mx-2 my-1 h-px bg-gray-200" />;
}
