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

export function getDurationInSecondsFromTimecode(timecode: string): number {
  const parts = timecode.split(":").map(Number);
  let duration = 0;
  for (let i = 0; i < parts.length; i++) {
    duration += parts[parts.length - 1 - i] * Math.pow(60, i);
  }
  console.log(`Timecode: ${timecode}, Duration: ${duration} seconds`);
  return duration;
} 