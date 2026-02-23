import { useState, useCallback } from "react";

export default function useContextMenu() {
  const [menu, setMenu] = useState(null);

  const open = useCallback((data) => setMenu(data), []);
  const close = useCallback(() => setMenu(null), []);

  return [menu, open, close];
}
