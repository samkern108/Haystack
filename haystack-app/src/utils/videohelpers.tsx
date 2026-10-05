import { AllCreators, type Creator, type Video } from "../state/types";

export function getVideoById(creatorId: string, videoId: string): Video {
  return AllCreators[creatorId]?.videos?.[videoId];
}

export function getCreatorById(creatorId: string): Creator {
  return AllCreators[creatorId];
}

export function getChannelURL(creatorId: string): string {
  return ("https://www.youtube.com/channel/" + creatorId);
}
