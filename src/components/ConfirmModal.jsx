import Modal from "./Modal";
import Button from "./Button";
import { IconAlert } from "./Icons";

export default function ConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose} onEnter={onConfirm} className="min-w-[380px] max-w-[440px]">
      <div className="flex items-start gap-4 mb-5">
        <div className="size-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <IconAlert />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-gray-900 tracking-[-0.44px] leading-7 mb-1">{title}</h3>
          <p className="text-[14px] text-gray-600 tracking-[-0.15px] leading-5">{message}</p>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button onClick={onClose}>Anuluj</Button>
        <Button variant="danger" onClick={onConfirm} className={confirmColor}>{confirmLabel || "Usuń"}</Button>
      </div>
    </Modal>
  );
}
