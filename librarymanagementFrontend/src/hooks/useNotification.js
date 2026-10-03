import { useState, useRef, useCallback } from "react";

export default function useNotification(duration = 3500) {
  const [note, setNote] = useState(null);
  const timer = useRef(null);

  const notify = useCallback(
    (kind, text) => {
      setNote({ kind, text });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setNote(null), duration);
    },
    [duration]
  );

  const dismiss = useCallback(() => setNote(null), []);

  return { note, notify, dismiss };
}
