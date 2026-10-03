import React from "react";
import useReports from "../../hooks/useReports";
import SectionHead from "../common/SectionHead";
import EmptyState from "../common/EmptyState";
import OverdueTable from "./OverdueTable";
import MostBorrowedTable from "./MostBorrowedTable";

export default function ReportsTab() {
  const { overdue, mostBorrowed, loading, load } = useReports();

  return (
    <div>
      <SectionHead title="Reports">
        <button className="btn btn-secondary" onClick={load}>Refresh</button>
      </SectionHead>

      {loading && <EmptyState>Loading…</EmptyState>}

      <h3 className="subheading">Overdue</h3>
      {overdue.length === 0 ? (
        <EmptyState>Nothing overdue.</EmptyState>
      ) : (
        <OverdueTable rows={overdue} />
      )}

      <h3 className="subheading">Most borrowed</h3>
      {mostBorrowed.length === 0 ? (
        <EmptyState>No circulation history yet.</EmptyState>
      ) : (
        <MostBorrowedTable rows={mostBorrowed} />
      )}
    </div>
  );
}
