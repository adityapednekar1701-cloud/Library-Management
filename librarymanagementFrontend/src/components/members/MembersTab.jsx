import React, { useState } from "react";
import useMembers from "../../hooks/useMembers";
import SectionHead from "../common/SectionHead";
import EmptyState from "../common/EmptyState";
import MemberForm from "./MemberForm";
import MemberTable from "./MemberTable";

export default function MembersTab({ notify }) {
  const { members, loading, loadMembers, addMember } = useMembers();
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(data) {
    const { ok, message } = await addMember(data);
    notify(ok ? "success" : "error", message);
    if (ok) {
      setShowForm(false);
      loadMembers();
    }
    return ok;
  }

  return (
    <div>
      <SectionHead title="Members">
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "+ Add member"}
        </button>
      </SectionHead>

      {showForm && <MemberForm onSubmit={handleAdd} />}

      {loading ? (
        <EmptyState>Loading…</EmptyState>
      ) : members.length === 0 ? (
        <EmptyState>No members found.</EmptyState>
      ) : (
        <MemberTable members={members} />
      )}
    </div>
  );
}
