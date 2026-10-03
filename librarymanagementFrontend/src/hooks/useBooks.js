import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/api";

export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = useCallback(async (q = "") => {
    setLoading(true);
    const path = q ? `/BookServlet?q=${encodeURIComponent(q)}` : "/BookServlet";
    const { body } = await apiRequest(path);
    setBooks(body?.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBooks("");
  }, [loadBooks]);

  async function addBook(data) {
    const { status, body } = await apiRequest("/BookServlet", {
      method: "POST",
      body: JSON.stringify({ ...data, totalCopies: Number(data.totalCopies) }),
    });
    return { ok: status === 201, message: body?.message ?? "Something went wrong." };
  }

  return { books, loading, loadBooks, addBook };
}
