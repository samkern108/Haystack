import { useEffect, useRef, useState } from "react";

export function useDelayedHover(delay = 1000) {
  const [hovered, setHovered] = useState(false);
  const timer = useRef<number | null>(null);

  function onPointerEnter() {
    timer.current = window.setTimeout(() => {
      setHovered(true);
    }, delay);
  }

  function onPointerLeave() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setHovered(false);
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