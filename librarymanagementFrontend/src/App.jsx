import React, { useState } from "react";
import "./App.css";
import Toast from "./components/Toast";
import BooksTab from "./components/BooksTab";
import MembersTab from "./components/MembersTab";
import CirculationTab from "./components/CirculationTab";
import ReportsTab from "./components/ReportsTab";

const TABS = [
  { id: "books", label: "Books" },
  { id: "members", label: "Members" },
  { id: "circulation", label: "Circulation" },
  { id: "reports", label: "Reports" },
];

export default function App() {
  const [tab, setTab] = useState("books");
  const [note, setNote] = useState(null);

  const notify = (kind, text) => {
    setNote({ kind, text });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setNote(null), 3500);
  };

  return (
    <div className="app">
      <Toast note={note} onClose={() => setNote(null)} />

      <div className="topbar">
        <span className="brand">Library Management</span>
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="main">
        {tab === "books" && <BooksTab notify={notify} />}
        {tab === "members" && <MembersTab notify={notify} />}
        {tab === "circulation" && <CirculationTab notify={notify} />}
        {tab === "reports" && <ReportsTab />}
      </main>
    </div>
  );
}
