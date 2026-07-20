import type { Creator, Video } from "../state/types";
import { MockData_AllCreators, MockData_AllVideos } from "../storage/mockData";

export function getVideoById(videoId: string): Video {
  return MockData_AllVideos[videoId];
}

export function getVideosByIds(videoIds: string[]): Video[] {
  return videoIds.map(getVideoById);
}

export function getCreatorById(creatorId: string): Creator {
  return MockData_AllCreators[creatorId];
}