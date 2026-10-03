import { apiRequest } from "../api/api";

export default function useCirculation() {
  // action = "issue" | "return"
  async function runAction(action, isbn, memberId) {
    const { status, body } = await apiRequest(`/TransactionServlet/${action}`, {
      method: "POST",
      body: JSON.stringify({ isbn, memberId: Number(memberId) }),
    });
    return {
      ok: status === 200 || status === 201,
      message: body?.message ?? "Something went wrong.",
    };
  }

  return { runAction };
}
