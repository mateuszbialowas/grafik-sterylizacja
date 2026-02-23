import { useState, useCallback } from "react";
import { TIMEOUTS } from "../constants";

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), TIMEOUTS.toast);
  }, []);

  return { toasts, showToast };
}
