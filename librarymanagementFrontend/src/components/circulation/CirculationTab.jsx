import React, { useState } from "react";
import useCirculation from "../../hooks/useCirculation";
import SectionHead from "../common/SectionHead";
import FormField from "../common/FormField";

export default function CirculationTab({ notify }) {
  const { runAction } = useCirculation();
  const [isbn, setIsbn] = useState("");
  const [memberId, setMemberId] = useState("");

  async function act(action) {
    if (!isbn || !memberId) {
      notify("error", "Enter both an ISBN and a member ID.");
      return;
    }
    const { ok, message } = await runAction(action, isbn, memberId);
    notify(ok ? "success" : "error", message);
    if (ok) {
      setIsbn("");
      setMemberId("");
    }
  }

  return (
    <div>
      <SectionHead title="Circulation" />

      <div className="panel panel-narrow">
        <FormField label="ISBN" value={isbn} onChange={setIsbn} placeholder="978-0134685991" />
        <FormField label="Member ID" value={memberId} onChange={setMemberId} placeholder="1" />
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => act("issue")}>Issue book</button>
          <button className="btn btn-secondary" onClick={() => act("return")}>Return book</button>
        </div>
      </div>
    </div>
  );
}
