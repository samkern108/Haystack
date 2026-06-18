import { creators } from "../../mockData";
import { CreatorRow } from "../creator_components/CreatorRow";

export function VideoGrid() {
  return (
    <>
      {creators.map((creator) => (
        <CreatorRow
          key={creator.youtubeId}
          creator={creator}
        />
      ))}
    </>
  );
}