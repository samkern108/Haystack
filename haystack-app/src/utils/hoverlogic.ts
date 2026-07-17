import { useEffect, useRef, useState } from "react";

export function useDelayedHover(delay = 1000, exitDelay = delay) {
  const [hovered, setHovered] = useState(false);
  const timer = useRef<number | null>(null);

  function onPointerEnter() {
    timer.current = window.setTimeout(() => {
      setHovered(true);
    }, delay);
  }

  function onPointerLeave() {
    timer.current = window.setTimeout(() => {
      setHovered(false);
    }, exitDelay);
  }

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return {
    hovered,
    onPointerEnter,
    onPointerLeave,
  };
}