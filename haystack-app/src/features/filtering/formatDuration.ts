import { MAX_VIDEO_FILTER_TIME as MAX_TIME } from "./constants";

export function formatDuration(minutes: number, isMax = false) {
  if (minutes === MAX_TIME && isMax) {
    return "4h+";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

