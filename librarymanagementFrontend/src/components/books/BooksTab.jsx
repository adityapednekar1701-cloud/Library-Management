import React, { useState } from "react";
import useBooks from "../../hooks/useBooks";
import SectionHead from "../common/SectionHead";
import EmptyState from "../common/EmptyState";
import BookForm from "./BookForm";
import BookSearchBar from "./BookSearchBar";
import BookTable from "./BookTable";

export default function BooksTab({ notify }) {
  const { books, loading, loadBooks, addBook } = useBooks();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(data) {
    const { ok, message } = await addBook(data);
    notify(ok ? "success" : "error", message);
    if (ok) {
      setShowForm(false);
      loadBooks(query);
    }
    return ok;
  }

  function handleClear() {
    setQuery("");
    loadBooks("");
  }

  return (
    <div>
      <SectionHead title="Books">
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add book"}
        </button>
      </SectionHead>

      {showForm && <BookForm onSubmit={handleAdd} />}

      <BookSearchBar
        query={query}
        onQueryChange={setQuery}
        onSearch={() => loadBooks(query)}
        onClear={handleClear}
      />

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : books.length === 0 ? (
        <EmptyState>No books found.</EmptyState>
      ) : (
        <BookTable books={books} />
      )}
    </div>
  );
}
