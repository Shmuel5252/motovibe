import { useSyncExternalStore } from "react";
import { getState, subscribe } from "./authStore.js";

export function useAuth() {
  return useSyncExternalStore(subscribe, getState, getState);
}
