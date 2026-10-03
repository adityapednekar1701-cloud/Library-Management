import React, { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api";

export default function MembersTab({ notify }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", address: "" });

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const { body } = await apiRequest("/MemberServlet");
    setMembers(body?.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleAddMember(e) {
    e.preventDefault();
    const { status, body } = await apiRequest("/MemberServlet", {
      method: "POST",
      body: JSON.stringify(form),
    });
    notify(status === 201 ? "success" : "error", body?.message ?? "Something went wrong.");
    if (status === 201) {
      setForm({ name: "", email: "", phoneNumber: "", address: "" });
      setShowForm(false);
      loadMembers();
    }
  }

  return (
    <div>
      <div className="section-head">
        <h2>Members</h2>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add member"}
        </button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={handleAddMember}>
          <div className="grid">
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                required
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Address</label>
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save member</button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : members.length === 0 ? (
        <p className="empty-state">No members found.</p>
      ) : (
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
                    <span className="badge badge-red">₹{m.fineAmount}</span>
                  ) : (
                    <span className="dim">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
