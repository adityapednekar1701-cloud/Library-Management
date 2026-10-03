import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

export default function ReportsTab() {
  const [overdue, setOverdue] = useState([]);
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, m] = await Promise.all([
      apiRequest("/TransactionServlet/overdue"),
      apiRequest("/TransactionServlet/most-borrowed"),
    ]);
    setOverdue(o.body?.results ?? []);
    setMostBorrowed(m.body?.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="section-head">
        <h2>Reports</h2>
        <button className="btn btn-secondary" onClick={load}>Refresh</button>
      </div>

      {loading && <p className="empty-state">Loading…</p>}

      <h3 className="subheading">Overdue</h3>
      {overdue.length === 0 ? (
        <p className="empty-state">Nothing overdue.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Member</th>
              <th>Due date</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {overdue.map((t) => (
              <tr key={t.transactionId}>
                <td className="mono">{t.isbn}</td>
                <td>{t.memberId}</td>
                <td>{t.dueDate}</td>
                <td><span className="badge badge-red">₹{t.fineAmount}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="subheading">Most borrowed</h3>
      {mostBorrowed.length === 0 ? (
        <p className="empty-state">No circulation history yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {mostBorrowed.map((b) => (
              <tr key={b.isbn}>
                <td>{b.title}</td>
                <td>{b.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
