import { useEffect, useRef, useState } from "react";

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const defaultTime = 100;
  const timer = useRef<number>(defaultTime);

  function handlePointerEnter() {
    timer.current = window.setTimeout(() => {
      setVisible(true);
    }, 1000);
  }

  function handlePointerLeave() {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    setVisible(false);
  }

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div
      className="tooltip-container"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button className="label-button">
        ?
      </button>

      {visible && (
        <div className="tooltip">
          {text}
        </div>
      )}
    </div>
  );
}