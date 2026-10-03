import React from "react";
import Badge from "../common/Badge";

export default function BookTable({ books }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Genre</th>
          <th>ISBN</th>
          <th>Copies</th>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.isbn}>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>{b.genre}</td>
            <td className="mono">{b.isbn}</td>
            <td>
              <Badge variant={b.availableCopies > 0 ? "green" : "gray"}>
                {b.availableCopies} / {b.totalCopies}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
