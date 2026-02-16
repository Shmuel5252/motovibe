import { http } from "./http.js";

function normalizeError(err) {
  const data = err?.response?.data;
  const code = data?.error?.code ?? "UNKNOWN";
  const message = data?.error?.message ?? err?.message ?? "Request failed";
  return { code, message };
}

export async function listRoutes() {
  try {
    const res = await http.get("/routes");
    return res.data; 
    // אם השרת מחזיר מערך ישירות → [...]
    // אם מחזיר אובייקט → נטפל בדף
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function createRoute(payload) {
  try {
    const res = await http.post("/routes", payload);
    return res.data;
  } catch (err) {
    throw normalizeError(err);
  }
}
