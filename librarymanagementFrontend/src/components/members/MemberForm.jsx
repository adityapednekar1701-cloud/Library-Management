import React, { useState } from "react";
import FormField from "../common/FormField";

const EMPTY = { name: "", email: "", phoneNumber: "", address: "" };

// onSubmit(form) must return true when the save succeeded
export default function MemberForm({ onSubmit }) {
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
        <FormField label="Name" required value={form.name} onChange={set("name")} />
        <FormField label="Email" required type="email" value={form.email} onChange={set("email")} />
        <FormField label="Phone" required value={form.phoneNumber} onChange={set("phoneNumber")} />
        <FormField label="Address" required value={form.address} onChange={set("address")} />
      </div>
      <button type="submit" className="btn btn-primary">Save member</button>
    </form>
  );
}
