import { STORAGE_KEYS } from "../config/storageKeys.js";

// חשוב: snapshot חייב להיות יציב (אותו reference) כל עוד אין שינוי אמיתי
let state = {
  status: "unknown", // 'unknown' | 'guest' | 'authenticated'
  user: null,
  token: null,
};

let hydrated = false;
const listeners = new Set();

function emit() {
  // useSyncExternalStore listener לא מקבל args
  for (const fn of listeners) fn();
}

function set(nextPartial) {
  state = { ...state, ...nextPartial };
  emit();
  return state;
}

export function getState() {
  return state; // ✅ מחזיר reference יציב
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function hydrate() {
  // 🔒 idempotent
  if (hydrated) return state;
  hydrated = true;

  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (token) {
    // user נמשוך דרך /auth/me בשלב הבא
    return set({ status: "authenticated", token, user: null });
  }

  return set({ status: "guest", token: null, user: null });
}

export function setAuth({ token, user }) {
  if (token) localStorage.setItem(STORAGE_KEYS.token, token);
  else localStorage.removeItem(STORAGE_KEYS.token);

  return set({ status: "authenticated", token: token ?? null, user: user ?? null });
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.token);
  return set({ status: "guest", token: null, user: null });
}
export function setUser(user) {
  return set({ user: user ?? null });
}
