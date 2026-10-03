import React from "react";
import Badge from "../common/Badge";

export default function OverdueTable({ rows }) {
  return (
    <table className="table">
      <thead>
        <tr><th>ISBN</th><th>Member</th><th>Due date</th><th>Fine</th></tr>
      </thead>
      <tbody>
        {rows.map((t) => (
          <tr key={t.transactionId}>
            <td className="mono">{t.isbn}</td>
            <td>{t.memberId}</td>
            <td>{t.dueDate}</td>
            <td><Badge variant="red">₹{t.fineAmount}</Badge></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
