import { creators } from "../mockData";
import { CreatorRow } from "./CreatorRow";

export function VideoGrid() {
  return (
    <>
      {creators.map((creator) => (
        <CreatorRow
          key={creator.id}
          creator={creator}
        />
      ))}
    </>
  );
}