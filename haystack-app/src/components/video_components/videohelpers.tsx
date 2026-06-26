import type { Video } from "../../types";
import { MockData_AllVideos } from "../../mockData";

export function getVideoById(videoId: string): Video {
  return MockData_AllVideos[videoId];
}

export function getVideosByIds(videoIds: string[]): Video[] {
  return videoIds.map(getVideoById);
}