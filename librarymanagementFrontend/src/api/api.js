export const BASE_URL = "http://localhost:8080/LibraryManagement";

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    /* empty body */
  }
  return { status: res.status, body };
}
