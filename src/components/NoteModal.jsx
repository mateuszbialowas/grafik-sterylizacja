import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function NoteModal({ onSave, onClose, empName, day, current }) {
  const [note, setNote] = useState(current);
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[18px] font-semibold text-gray-900 tracking-[-0.44px] leading-7 mb-1">Notatka</h3>
      <p className="text-[14px] text-gray-600 tracking-[-0.15px] leading-5 mb-5">{empName} — dzień {day}</p>
      <div className="mb-5">
        <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-[0.3px] leading-4 block mb-2">Treść notatki</label>
        <textarea
          ref={ref}
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(note); } }}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[16px] text-gray-900 outline-none focus:border-[#a3b3ff] resize-none placeholder:text-gray-400"
          placeholder="Wpisz notatkę..."
        />
        <p className="text-[12px] text-gray-400 mt-1.5">Enter aby zapisać, Shift+Enter nowa linia</p>
      </div>
      <div className="flex gap-3 justify-end">
        {current && <Button variant="danger-outline" onClick={() => onSave("")}>Usuń notatkę</Button>}
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="primary" onClick={() => onSave(note)}>Zapisz</Button>
      </div>
    </Modal>
  );
}
