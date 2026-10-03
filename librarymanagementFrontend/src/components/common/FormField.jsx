import React from "react";

export default function FormField({ label, value, onChange, ...inputProps }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...inputProps} />
    </div>
  );
}
