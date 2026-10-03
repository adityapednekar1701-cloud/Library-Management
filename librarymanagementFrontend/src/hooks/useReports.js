import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/api";

export default function useReports() {
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

  useEffect(() => {
    load();
  }, [load]);

  return { overdue, mostBorrowed, loading, load };
}
