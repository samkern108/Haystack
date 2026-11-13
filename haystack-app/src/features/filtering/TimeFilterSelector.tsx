import { formatDuration } from "./formatDuration";
import { MAX_VIDEO_FILTER_TIME as MAX_TIME } from "./constants";

function snapMaxTime(value: number) {
  if (value === 0) value = 5; // To prevent max and min from being the same, which breaks the scrollbar.
  if (value <= 60) {
    return Math.round(value / 5) * 5;
  }
  return Math.round(value / 10) * 10;
}

function snapMinTime(value: number) {
  if (value === MAX_TIME) value = MAX_TIME - 10; // To prevent max and min from being the same, which breaks the scrollbar.
  if (value <= 60) {
    return Math.round(value / 5) * 5;
  }
  return Math.round(value / 10) * 10;
}

interface TimeFilterSelectorProps {
  minTime: number;
  maxTime: number;
  onMinTimeChange: (value: number) => void;
  onMaxTimeChange: (value: number) => void;
}

export function TimeFilterSelector({
  minTime,
  maxTime,
  onMinTimeChange,
  onMaxTimeChange,
}: TimeFilterSelectorProps) {
  function handleMinChange(value: number) {
    const snapped = snapMinTime(value);
    onMinTimeChange(Math.min(snapped, maxTime));
  }

  function handleMaxChange(value: number) {
    const snapped = snapMaxTime(value);
    onMaxTimeChange(Math.max(snapped, minTime));
  }

  return (
    <div className="time-filter">
      <div className="time-filter-range">
        <span className="time-handle-label time-handle-label-min"
          style={{
            left: `min(calc(${minTime / MAX_TIME * 100}% + ${8 - minTime / MAX_TIME * 16}px), calc(${(minTime + maxTime) / (2 * MAX_TIME) * 100}% + ${8 - (minTime + maxTime) / (2 * MAX_TIME) * 16 - 30}px))`,
          }}>
          {formatDuration(minTime)}
        </span>
        <span className="time-handle-label time-handle-label-max"
          style={{
            left: `max(calc(${maxTime / MAX_TIME * 100}% + ${8 - maxTime / MAX_TIME * 16}px), calc(${(minTime + maxTime) / (2 * MAX_TIME) * 100}% + ${8 - (minTime + maxTime) / (2 * MAX_TIME) * 16 + 30}px))`,
          }}>
          {formatDuration(maxTime, true)}
        </span>
        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={minTime}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="time-slider time-slider-min"
          aria-label="Minimum video duration"
        />

        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={maxTime}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="time-slider time-slider-max"
          aria-label="Maximum video duration"
        />
      </div>

    </div>
  );
}
