import React from "react";

export default function MostBorrowedTable({ rows }) {
  return (
    <table className="table">
      <thead>
        <tr><th>Title</th><th>Author</th></tr>
      </thead>
      <tbody>
        {rows.map((b) => (
          <tr key={b.isbn}>
            <td>{b.title}</td>
            <td>{b.author}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
