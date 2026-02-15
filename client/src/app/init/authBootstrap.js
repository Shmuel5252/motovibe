import { me } from "../api/authApi.js";
import { getState, hydrate, setUser, logout } from "../state/authStore.js";

let started = false;

export async function authBootstrap() {
  if (started) return;
  started = true;

  hydrate();

  const { status, token } = getState();
  if (status !== "authenticated" || !token) return;

  try {
    const data = await me(); // { user }
    setUser(data.user);
  } catch (err) {
    // אם זה 401, ה-http כבר dispatchEvent וה-event יגרום ל-logout.
    // אם זה משהו אחר, בינתיים לא עושים כלום (נוסיף telemetry/error handling בהמשך).
    if (err?.code === "UNAUTHORIZED") logout(); // fallback אם השרת מחזיר קוד כזה
  }
}

// auto-run by import
authBootstrap();
