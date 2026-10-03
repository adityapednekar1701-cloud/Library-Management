import React from "react";

// children = optional actions shown on the right (buttons etc.)
export default function SectionHead({ title, children }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
