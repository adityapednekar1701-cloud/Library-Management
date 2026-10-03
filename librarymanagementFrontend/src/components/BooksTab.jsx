import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

export default function BooksTab({ notify }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ isbn: "", title: "", author: "", genre: "", totalCopies: "" });

  const loadBooks = useCallback(async (q) => {
    setLoading(true);
    const path = q ? `/BookServlet?q=${encodeURIComponent(q)}` : "/BookServlet";
    const { body } = await apiRequest(path);
    setBooks(body?.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBooks("");
  }, [loadBooks]);

  async function handleAddBook(e) {
    e.preventDefault();
    const { status, body } = await apiRequest("/BookServlet", {
      method: "POST",
      body: JSON.stringify({ ...form, totalCopies: Number(form.totalCopies) }),
    });
    notify(status === 201 ? "success" : "error", body?.message ?? "Something went wrong.");
    if (status === 201) {
      setForm({ isbn: "", title: "", author: "", genre: "", totalCopies: "" });
      setShowForm(false);
      loadBooks(query);
    }
  }

  return (
    <div>
      <div className="section-head">
        <h2>Books</h2>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add book"}
        </button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={handleAddBook}>
          <div className="grid">
            <div className="field">
              <label>ISBN</label>
              <input required value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            </div>
            <div className="field">
              <label>Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Author</label>
              <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div className="field">
              <label>Genre</label>
              <input required value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
            </div>
            <div className="field">
              <label>Total copies</label>
              <input
                required
                type="number"
                min="1"
                value={form.totalCopies}
                onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save book</button>
        </form>
      )}

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by title, author, or ISBN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadBooks(query)}
        />
        <button className="btn btn-secondary" onClick={() => loadBooks(query)}>Search</button>
        {query && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setQuery("");
              loadBooks("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : books.length === 0 ? (
        <p className="empty-state">No books found.</p>
      ) : (
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
                  <span className={`badge ${b.availableCopies > 0 ? "badge-green" : "badge-gray"}`}>
                    {b.availableCopies} / {b.totalCopies}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
