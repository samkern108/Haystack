const MAX_TIME = 240;

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
        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={minTime}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="time-slider time-slider-min"
        />

        <input
          type="range"
          min="0"
          max={MAX_TIME}
          step="1"
          value={maxTime}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="time-slider time-slider-max"
        />
      </div>

      <div className="time-filter-selection">
        {formatTime(minTime)} – {formatTime(maxTime, true)}
      </div>
    </div>
  );
}