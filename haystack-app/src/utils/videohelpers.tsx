import type { CreatorState, VideoFilterState, VideoTagState } from "../state/state";
import { AllCreators, type Video } from "../state/types";

export function getVideoById(creatorId: string, videoId: string): Video {
  return AllCreators[creatorId]?.videos?.[videoId];
}

export function filterVideoIdsByIncludedTags(
  videoIds: string[],
  includeTagNames: string[],
  tagState: VideoTagState
): string[] {
  if (includeTagNames.length === 0) return videoIds;

  const includedVideoIds = new Set<string>();

  for (const [videoId, tagNames] of Object.entries(
    tagState.allVideoTags
  )) {
    if (includeTagNames.some((name) => tagNames.includes(name))) {
      includedVideoIds.add(videoId);
    }
  }

  return videoIds.filter((videoId) => includedVideoIds.has(videoId));
}

export function filterVideoIdsByExcludedTags(
  videoIds: string[],
  excludeTagNames: string[],
  tagState: VideoTagState
): string[] {
  if (excludeTagNames.length === 0) return videoIds;

  return videoIds.filter((videoId) => {
    const videoTags = tagState.allVideoTags[videoId] ?? [];

    return !excludeTagNames.some((name) => videoTags.includes(name));
  });
}

// The way we're returning data RIGHT NOW, 
// it is most economical to filter videos *one creator at a time*
export function filterVideosForCreator(
  creatorId: string,
  creatorState: CreatorState,
  filters: VideoFilterState,
  inputVideoIds: Record<string, Video>,
  tagState: VideoTagState,
  maxResultsPerCreator?: number
): [creatorId: string, videoId: string][] {

  // Start with this creator's video IDs.
  let candidateVideoIds = Object.values(inputVideoIds).map(
    (video) => video.video_id
  );

  // INCLUDE TAGS: match at least one included tag.
  candidateVideoIds = filterVideoIdsByIncludedTags(
    candidateVideoIds,
    filters.includeTags,
    tagState
  );

  const outputVideoIds: [creatorId: string, videoId: string][] = [];

  // Apply watched and duration filters.
  for (const videoId of candidateVideoIds) {
    const video = inputVideoIds[videoId];
    if (!video) continue;

    const videoState = creatorState.videoStates[videoId];

    // WATCHED
    const watched =
      (videoState?.historicalMaxWatchPercentage ?? 0) > 0.9;

    if (
      (filters.watched === "no" && watched) ||
      (filters.watched === "yes" && !watched)
    ) {
      continue;
    }

    // TIME
    const duration = getDurationInSecondsFromTimecode(video.timecode);

    if (
      duration >= filters.minTime * 60 &&
      duration <= filters.maxTime * 60
    ) {
      outputVideoIds.push([creatorId, videoId]);
    }
  }

  // EXCLUDE TAGS: remove matching videos after the other filters.
  const finalVideoIds = filterVideoIdsByExcludedTags(
    outputVideoIds.map(([, videoId]) => videoId),
    filters.excludeTags,
    tagState
  );

  const finalVideoIdSet = new Set(finalVideoIds);

  const finalResults = outputVideoIds.filter(
    ([, videoId]) => finalVideoIdSet.has(videoId)
  );

  // Apply the result limit LAST.
  return maxResultsPerCreator !== undefined
    ? finalResults.slice(0, maxResultsPerCreator)
    : finalResults;
}

export function getDurationInSecondsFromTimecode(timecode: string): number {
  const parts = timecode.split(":").map(Number);
  let duration = 0;
  for (let i = 0; i < parts.length; i++) {
    duration += parts[parts.length - 1 - i] * Math.pow(60, i);
  }
  return duration;
} 

export function sameVideo(
  a: [string, string],
  b: [string, string]
): boolean {
  return a[0] === b[0] && a[1] === b[1];
}