import React from "react";
import Badge from "../common/Badge";

export default function MemberTable({ members }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Fine</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.name}</td>
            <td>{m.email}</td>
            <td>{m.phoneNumber}</td>
            <td>
              {m.fineAmount > 0 ? (
                <Badge variant="red">₹{m.fineAmount}</Badge>
              ) : (
                <span className="dim">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
