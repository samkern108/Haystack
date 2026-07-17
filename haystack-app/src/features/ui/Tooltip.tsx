interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {

  return (
    <div className="tooltip-container">
        {text}
    </div>
  );
}