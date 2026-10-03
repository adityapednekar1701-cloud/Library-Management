import React, { useState } from "react";
import { apiRequest } from "../api";

export default function CirculationTab({ notify }) {
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
