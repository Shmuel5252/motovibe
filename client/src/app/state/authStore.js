import { STORAGE_KEYS } from "../config/storageKeys.js";

const state = {
  status: "unknown", // 'unknown' | 'guest' | 'authenticated'
  user: null,
  token: null,
};

let hydrated = false;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn(getState());
}

export function getState() {
  return { ...state };
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function hydrate() {
  // 🔒 idempotent: אם כבר עשינו hydrate — לא עושים שוב
  if (hydrated) return getState();
  hydrated = true;

  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (token) {
    state.status = "authenticated";
    state.token = token;
    // user נמשוך דרך /auth/me בשלב הבא
    state.user = null;
  } else {
    state.status = "guest";
    state.token = null;
    state.user = null;
  }

  emit();
  return getState();
}

export function setAuth({ token, user }) {
  state.status = "authenticated";
  state.token = token;
  state.user = user ?? null;

  if (token) localStorage.setItem(STORAGE_KEYS.token, token);
  else localStorage.removeItem(STORAGE_KEYS.token);

  emit();
  return getState();
}

export function logout() {
  state.status = "guest";
  state.token = null;
  state.user = null;

  localStorage.removeItem(STORAGE_KEYS.token);

  emit();
  return getState();
}
