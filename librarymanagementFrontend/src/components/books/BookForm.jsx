import React, { useState } from "react";
import FormField from "../common/FormField";

const EMPTY = { isbn: "", title: "", author: "", genre: "", totalCopies: "" };

// onSubmit(form) must return true when the save succeeded
export default function BookForm({ onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const set = (key) => (value) => setForm({ ...form, [key]: value });

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await onSubmit(form);
    if (ok) setForm(EMPTY);
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="grid">
        <FormField label="ISBN" required value={form.isbn} onChange={set("isbn")} />
        <FormField label="Title" required value={form.title} onChange={set("title")} />
        <FormField label="Author" required value={form.author} onChange={set("author")} />
        <FormField label="Genre" required value={form.genre} onChange={set("genre")} />
        <FormField
          label="Total copies"
          required
          type="number"
          min="1"
          value={form.totalCopies}
          onChange={set("totalCopies")}
        />
      </div>
      <button type="submit" className="btn btn-primary">Save book</button>
    </form>
  );
}
