import { useEffect, useRef, useState } from "react";
import type { Creator } from "../../types";

interface CreatorInfoProps {
  creator: Creator;
}

export function CreatorInfo({ creator }: CreatorInfoProps) {
  const [showPopover, setShowPopover] = useState(false);
  const mouseOverTimerRef = useRef<number | null>(null);
  const mouseLeaveTimerRef = useRef<number | null>(null);
  const popupWaitTime = 200;

  const handleMouseEnter = () => {
    mouseOverTimerRef.current = window.setTimeout(() => {
      setShowPopover(true);
    }, popupWaitTime);

    // This is to prevent the popover from showing if the user quickly hovers in and out of the creator info
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    // This is to prevent the popover from showing if the user quickly hovers in and out of the creator info
    if (mouseOverTimerRef.current) {
      clearTimeout(mouseOverTimerRef.current);
    }

    mouseLeaveTimerRef.current = window.setTimeout(() => {
      setShowPopover(false);
    }, popupWaitTime);
  };

  useEffect(() => {
    return () => {
      if (mouseOverTimerRef.current) {
        clearTimeout(mouseOverTimerRef.current);
      }
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="creator-info"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />
      <h2>{creator.name}</h2>

      {showPopover && (
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