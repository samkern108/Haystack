import { AllCreators, type Creator, type Video } from "../state/types";

export function getVideoById(creatorId: string, videoId: string): Video {
  return AllCreators[creatorId]?.videos?.[videoId];
}

export function getVideosByIds(ids: [creatorId: string, videoId: string][]): Video[] {
  return ids.map(([creatorId, videoId]) => getVideoById(creatorId, videoId));
}

export function getCreatorById(creatorId: string): Creator {
  return AllCreators[creatorId];
}