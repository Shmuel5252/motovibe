import { logout } from "../state/authStore.js";

let initialized = false;

export function initAuthEvents() {
  if (initialized) return;
  initialized = true;

  window.addEventListener("auth:unauthorized", () => {
    // 🔒 נעילה: logout רק ב-store
    logout();
  });
}

// auto-init by import
initAuthEvents();
