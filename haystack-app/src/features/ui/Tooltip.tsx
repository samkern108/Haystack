import { useDelayedHover } from "../../utils/hoverlogic";

interface TooltipTriggerProps {
  children: React.ReactNode;
  text: string;
}

export function TooltipTrigger({ children, text }: TooltipTriggerProps) {
  const hover = useDelayedHover(1000);

  return (
    <div
      className="tooltip-trigger"
          onPointerEnter={hover.onPointerEnter} 
          onPointerLeave={hover.onPointerLeave}
    >
      {children}
      {hover.hovered && 
        <div className="tooltip-container">
          {text}
        </div>
      }
    </div>
  );
}