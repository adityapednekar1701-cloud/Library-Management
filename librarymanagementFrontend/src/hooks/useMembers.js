import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/api";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const { body } = await apiRequest("/MemberServlet");
    setMembers(body?.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function addMember(data) {
    const { status, body } = await apiRequest("/MemberServlet", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { ok: status === 201, message: body?.message ?? "Something went wrong." };
  }

  return { members, loading, loadMembers, addMember };
}
