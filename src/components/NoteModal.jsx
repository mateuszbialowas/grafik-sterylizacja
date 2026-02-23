import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";

export default function NoteModal({ onSave, onClose, empName, day, current }) {
  const [note, setNote] = useState(current);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[18px] font-semibold text-[#101828] tracking-[-0.44px] leading-7 mb-1">Notatka</h3>
      <p className="text-[14px] text-[#4a5565] tracking-[-0.15px] leading-5 mb-5">{empName} — dzień {day}</p>
      <div className="mb-5">
        <label className="text-[12px] font-semibold text-[#4a5565] uppercase tracking-[0.3px] leading-4 block mb-2">Treść notatki</label>
        <textarea
          ref={ref}
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(note); } }}
          rows={3}
          className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-[16px] text-[#101828] outline-none focus:border-[#a3b3ff] resize-none placeholder:text-[#99a1af]"
          placeholder="Wpisz notatkę..."
        />
        <p className="text-[12px] text-[#99a1af] mt-1.5">Enter aby zapisać, Shift+Enter nowa linia</p>
      </div>
      <div className="flex gap-3 justify-end">
        {current && <button onClick={() => onSave("")} className="h-10 px-5 bg-white border border-[#e7000b] rounded-lg text-[14px] font-medium text-[#e7000b] tracking-[-0.15px] leading-5 hover:bg-[#fef2f2]">Usuń notatkę</button>}
        <button onClick={onClose} className="h-10 px-5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] font-medium text-[#101828] tracking-[-0.15px] leading-5 hover:bg-[#f9fafb]">Anuluj</button>
        <button onClick={() => onSave(note)} className="h-10 px-5 bg-[#030213] text-white rounded-lg text-[14px] font-medium tracking-[-0.15px] leading-5 hover:bg-[#1a1a2e]">Zapisz</button>
      </div>
    </Modal>
  );
}
