import { creators } from "../mockData";
import type { Video } from "../types";
import { CreatorRow } from "./CreatorRow";

interface VideoGridProps {
  onVideoClick: (video: Video) => void;
}

export function VideoGrid({
  onVideoClick,
}: VideoGridProps) {
  return (
    <>
      {creators.map((creator) => (
        <CreatorRow
          key={creator.id}
          creator={creator}
          onVideoClick={onVideoClick}
        />
      ))}
    </>
  );
}