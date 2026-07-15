import { useSyncExternalStore } from "react";
import { getPath, subscribe } from "./router";

export function usePath(): string {
  return useSyncExternalStore(subscribe, getPath, getPath);
}
