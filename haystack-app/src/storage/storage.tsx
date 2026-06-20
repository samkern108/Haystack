import type { State } from "../state/creatorVideoState";

const STORAGE_KEY = "creator-video-state";

export function loadState(): State | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as State;
  } catch (err) {
    console.error("Failed to load state", err);
    return null;
  }
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch (err) {
    console.error("Failed to save state", err);
  }
}