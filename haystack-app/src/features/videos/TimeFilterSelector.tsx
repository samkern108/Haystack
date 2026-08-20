import { useState } from "react";

const MAX_TIME = 240;

function snapTime(value: number) {
  if (value <= 60) {
    return Math.round(value / 5) * 5;
  }

  return Math.round(value / 30) * 30;
}

function formatTime(minutes: number, isMax = false) {
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

export function TimeFilterSelector() {
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(MAX_TIME);

  function handleMinChange(value: number) {
    const snapped = snapTime(value);

    setMinTime(Math.min(snapped, maxTime));
  }

  function handleMaxChange(value: number) {
    const snapped = snapTime(value);

    setMaxTime(Math.max(snapped, minTime));
  }

  return (
    <div className="time-filter">
      <div className="time-filter-range">
        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={minTime}
          onChange={(e) =>
            handleMinChange(Number(e.target.value))
          }
          className="time-slider time-slider-min"
        />

        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={maxTime}
          onChange={(e) =>
            handleMaxChange(Number(e.target.value))
          }
          className="time-slider time-slider-max"
        />
      </div>

      <div className="time-filter-selection">
        {formatTime(minTime)} – {formatTime(maxTime, true)}
      </div>
    </div>
  );
}