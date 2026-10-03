import React from "react";

export default function Toast({ note, onClose }) {
  if (!note) return null;
  return (
    <div className={`toast ${note.kind === "error" ? "toast-error" : "toast-success"}`}>
      {note.text}
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
}
