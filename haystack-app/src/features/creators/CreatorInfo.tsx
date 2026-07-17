import type { Creator } from "../../state/types";
import { useDelayedHover } from "../../utils/hoverlogic";

interface CreatorInfoProps {
  creator: Creator;
}

export function CreatorInfo({ creator }: CreatorInfoProps) {
  const hover = useDelayedHover(50);

  return (
    <div
      className="creator-info"
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
      <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />
      <h2>{creator.name}</h2>

      {hover.hovered && (
        <div className="creator-popover">
          <a
            href={`https://www.youtube.com/${creator.creatorId_yt}`}
            target="_blank"
            rel="noreferrer"
        >
          <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />
          <h2>{creator.name}</h2>
        </a>
        </div>
      )}
    </div>
  );
}