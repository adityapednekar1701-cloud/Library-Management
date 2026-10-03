import React, { useState } from "react";
import "./App.css";
import useNotification from "./hooks/useNotification";
import Toast from "./components/common/Toast";
import TopBar from "./components/layout/TopBar";
import BooksTab from "./components/books/BooksTab";
import MembersTab from "./components/members/MembersTab";
import CirculationTab from "./components/circulation/CirculationTab";
import ReportsTab from "./components/reports/ReportsTab";

const TABS = [
  { id: "books", label: "Books" },
  { id: "members", label: "Members" },
  { id: "circulation", label: "Circulation" },
  { id: "reports", label: "Reports" },
];

export default function App() {
  const [tab, setTab] = useState("books");
  const { note, notify, dismiss } = useNotification();

  return (
    <div className="app">
      <Toast note={note} onClose={dismiss} />
      <TopBar tabs={TABS} activeTab={tab} onTabChange={setTab} />

      <main className="main">
        {tab === "books" && <BooksTab notify={notify} />}
        {tab === "members" && <MembersTab notify={notify} />}
        {tab === "circulation" && <CirculationTab notify={notify} />}
        {tab === "reports" && <ReportsTab />}
      </main>
    </div>
  );
}
