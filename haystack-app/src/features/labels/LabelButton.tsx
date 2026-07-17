import { useDelayedHover } from "../../utils/hoverlogic";
import { findVideoLabelById, type SystemVideoLabelId } from "./labels";

interface VideoLabelButtonProps {
  label: SystemVideoLabelId;
  active: boolean;
  onClick: () => void;
}

export function VideoLabelButton({
  label,
  active,
  onClick,
}: VideoLabelButtonProps) {
  const hover = useDelayedHover(600);

  const videoLabel = findVideoLabelById(label);

  return (
    <button
      className={`label-button ${active ? "active" : ""}`}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
      onClick={onClick}
      style={{
        color: videoLabel?.darkColor,
        backgroundColor: active
          ? videoLabel?.lightColor
          : "transparent",
      }}
    >
      {videoLabel?.icon}

      {hover.hovered && (
        <div className="tooltip">
          <p>{videoLabel?.description}</p>
        </div>
      )}
    </button>
  );
}