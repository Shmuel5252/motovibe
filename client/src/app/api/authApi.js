import { http } from "./http.js";

function normalizeError(err) {
  const data = err?.response?.data;
  const code = data?.error?.code ?? "UNKNOWN";
  const message = data?.error?.message ?? err?.message ?? "Request failed";
  return { code, message };
}

export async function login(email, password) {
  try {
    const res = await http.post("/auth/login", { email, password });
    return res.data; // { token, user }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function register(payload) {
  try {
    const res = await http.post("/auth/register", payload);
    return res.data; // { token, user }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function me() {
  try {
    const res = await http.get("/auth/me");
    return res.data; // { user }
  } catch (err) {
    throw normalizeError(err);
  }
}
