import React from "react";

export default function TopBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="topbar">
      <span className="brand">Library Management</span>
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={activeTab === t.id ? "active" : ""}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
