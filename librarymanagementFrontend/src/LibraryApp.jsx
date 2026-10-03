import React, { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:8080/LibraryManagement";

async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    
  }
  return { status: res.status, body };
}

function Toast({ note, onClose }) {
  if (!note) return null;
  return (
    <div className={`toast ${note.kind === "error" ? "toast-error" : "toast-success"}`}>
      {note.text}
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
}

//Books
function BooksTab({ notify }) {
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

  useEffect(() => { loadBooks(""); }, [loadBooks]);

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
          <button className="btn btn-secondary" onClick={() => { setQuery(""); loadBooks(""); }}>
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

//Members
function MembersTab({ notify }) {
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

  useEffect(() => { loadMembers(); }, [loadMembers]);

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
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
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

//Circulation
function CirculationTab({ notify }) {
  const [isbn, setIsbn] = useState("");
  const [memberId, setMemberId] = useState("");

  async function act(action) {
    if (!isbn || !memberId) {
      notify("error", "Enter both an ISBN and a member ID.");
      return;
    }
    const { status, body } = await apiRequest(`/TransactionServlet/${action}`, {
      method: "POST",
      body: JSON.stringify({ isbn, memberId: Number(memberId) }),
    });
    const success = status === 200 || status === 201;
    notify(success ? "success" : "error", body?.message ?? "Something went wrong.");
    if (success) {
      setIsbn("");
      setMemberId("");
    }
  }

  return (
    <div>
      <div className="section-head">
        <h2>Circulation</h2>
      </div>

      <div className="panel" style={{ maxWidth: 420 }}>
        <div className="field">
          <label>ISBN</label>
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-0134685991" />
        </div>
        <div className="field">
          <label>Member ID</label>
          <input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="1" />
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => act("issue")}>Issue book</button>
          <button className="btn btn-secondary" onClick={() => act("return")}>Return book</button>
        </div>
      </div>
    </div>
  );
}

//Reports
function ReportsTab() {
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

  useEffect(() => { load(); }, [load]);

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
            <tr><th>ISBN</th><th>Member</th><th>Due date</th><th>Fine</th></tr>
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
            <tr><th>Title</th><th>Author</th></tr>
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

const TABS = [
  { id: "books", label: "Books" },
  { id: "members", label: "Members" },
  { id: "circulation", label: "Circulation" },
  { id: "reports", label: "Reports" },
];

export default function LibraryApp() {
  const [tab, setTab] = useState("books");
  const [note, setNote] = useState(null);

  const notify = (kind, text) => {
    setNote({ kind, text });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setNote(null), 3500);
  };

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; }

        .app {
          min-height: 100vh;
          background: #f7f8fa;
          color: #1a1d23;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
        }

        .topbar {
          background: #fff;
          border-bottom: 1px solid #e4e6eb;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          height: 56px;
        }

        .brand {
          font-weight: 600;
          font-size: 1rem;
          color: #1a1d23;
        }

        .tabs { display: flex; gap: 4px; }

        .tabs button {
          background: none;
          border: none;
          padding: 8px 14px;
          font-size: 0.9rem;
          color: #5b616e;
          cursor: pointer;
          border-radius: 6px;
          font-family: inherit;
        }

        .tabs button:hover { background: #f0f1f3; color: #1a1d23; }

        .tabs button.active {
          background: #eef2ff;
          color: #3b4ee0;
          font-weight: 600;
        }

        .main {
          max-width: 920px;
          margin: 0 auto;
          padding: 32px 24px 60px;
        }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .section-head h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .subheading {
          font-size: 1rem;
          font-weight: 600;
          margin: 28px 0 10px;
        }

        .btn {
          font-family: inherit;
          font-size: 0.86rem;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 6px;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .btn-primary { background: #3b4ee0; color: #fff; }
        .btn-primary:hover { background: #2f3fc4; }

        .btn-secondary { background: #fff; border-color: #d7dae0; color: #333; }
        .btn-secondary:hover { background: #f5f6f8; }

        .btn-row { display: flex; gap: 10px; margin-top: 4px; }

        .panel {
          background: #fff;
          border: 1px solid #e4e6eb;
          border-radius: 8px;
          padding: 18px;
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }

        .field { display: flex; flex-direction: column; gap: 5px; }
        .field label { font-size: 0.78rem; font-weight: 500; color: #5b616e; }

        input {
          font-family: inherit;
          font-size: 0.9rem;
          padding: 8px 10px;
          border: 1px solid #d7dae0;
          border-radius: 6px;
          background: #fff;
          color: #1a1d23;
        }

        input:focus, .btn:focus { outline: 2px solid #3b4ee0; outline-offset: 1px; }

        .toolbar {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .search-input { flex: 1; }

        .table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #e4e6eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .table th, .table td {
          text-align: left;
          padding: 10px 14px;
          font-size: 0.87rem;
          border-bottom: 1px solid #eef0f3;
        }

        .table th {
          font-size: 0.75rem;
          font-weight: 600;
          color: #5b616e;
          background: #fafbfc;
        }

        .table tr:last-child td { border-bottom: none; }

        .mono { font-family: 'SF Mono', Menlo, monospace; font-size: 0.82rem; color: #5b616e; }

        .badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 2px 9px;
          border-radius: 10px;
        }

        .badge-green { background: #e6f6ec; color: #1b8a4c; }
        .badge-gray { background: #eef0f3; color: #5b616e; }
        .badge-red { background: #fdeaea; color: #c0392b; }

        .dim { color: #9aa0ab; }

        .empty-state { color: #9aa0ab; font-size: 0.9rem; padding: 20px 0; }

        .toast {
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.87rem;
          font-weight: 500;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
        }

        .toast-success { background: #1b8a4c; color: #fff; }
        .toast-error { background: #c0392b; color: #fff; }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 1.1rem;
          cursor: pointer;
          line-height: 1;
        }
      `}</style>

      <Toast note={note} onClose={() => setNote(null)} />

      <div className="topbar">
        <span className="brand">Library Management</span>
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="main">
        {tab === "books" && <BooksTab notify={notify} />}
        {tab === "members" && <MembersTab notify={notify} />}
        {tab === "circulation" && <CirculationTab notify={notify} />}
        {tab === "reports" && <ReportsTab />}
      </main>
    </div>
  );
}
