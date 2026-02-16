import { http } from "./http.js";

function normalizeError(err) {
  const data = err?.response?.data;
  const code = data?.error?.code ?? "UNKNOWN";
  const message = data?.error?.message ?? err?.message ?? "Request failed";
  return { code, message };
}

export async function startRide(routeId) {
  try {
    const res = await http.post("/rides/start", { routeId });
    return res.data; // { ride }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function stopRide() {
  try {
    const res = await http.post("/rides/stop");
    return res.data; // { ride }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getActiveRide() {
  try {
    const res = await http.get("/rides/active");
    return res.data; // { ride: ... | null }
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getRideHistory() {
  try {
    const res = await http.get("/rides/history");
    return res.data; // { rides }
  } catch (err) {
    throw normalizeError(err);
  }
}
