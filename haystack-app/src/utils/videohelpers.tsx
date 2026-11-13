import { matchesIncludedTags, type TagOperator } from "./tagfilterlogic";
import { hasTag } from "./taghelpers";
import type { CreatorState, VideoFilterState, VideoTagState } from "../state/state";
import { AllCreators, type Video } from "../state/types";
import { MAX_VIDEO_FILTER_TIME } from "../features/filtering/constants";

export function getVideoById(creatorId: string, videoId: string): Video {
  return AllCreators[creatorId]?.videos?.[videoId];
}

function matchesCreatorFilter(
  creatorState: CreatorState | undefined,
  filter: VideoFilterState["creator"]
): boolean {
  const followed = creatorState?.followed ?? false;
  return filter === "all" || (filter === "followed" ? followed : !followed);
}

function getEffectiveVideoTagNames(
  videoId: string,
  tagState: VideoTagState,
  creatorState?: CreatorState
): string[] {
  const exceptions = creatorState?.videoStates[videoId]?.creatorTagExceptions ?? [];
  const creatorTags = (creatorState?.tags ?? []).filter(
    (tag) => !hasTag(exceptions, tag)
  );
  return [...(tagState.allVideoTags[videoId] ?? []), ...creatorTags];
}

export function filterVideoIdsByIncludedTags(
  videoIds: string[],
  includeTagNames: string[],
  tagState: VideoTagState,
  creatorState?: CreatorState,
  operators?: TagOperator[],
  order?: number[]
): string[] {
  if (includeTagNames.length === 0) return videoIds;

  return videoIds.filter((videoId) => {
    const videoTags = getEffectiveVideoTagNames(videoId, tagState, creatorState);
    return matchesIncludedTags(videoTags, includeTagNames, operators, order);
  });
}

export function filterVideoIdsByExcludedTags(
  videoIds: string[],
  excludeTagNames: string[],
  tagState: VideoTagState,
  creatorState?: CreatorState
): string[] {
  if (excludeTagNames.length === 0) return videoIds;

  return videoIds.filter((videoId) => {
    const videoTags = getEffectiveVideoTagNames(videoId, tagState, creatorState);

    return !excludeTagNames.some((name) => hasTag(videoTags, name));
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
  if (!matchesCreatorFilter(creatorState, filters.creator)) return [];

  // Start with this creator's video IDs.
  let candidateVideoIds = Object.values(inputVideoIds).map(
    (video) => video.video_id
  );

  // INCLUDE TAGS: AND groups joined by OR.
  candidateVideoIds = filterVideoIdsByIncludedTags(
    candidateVideoIds,
    filters.includeTags,
    tagState,
    creatorState,
    filters.includeTagOperators,
    filters.includeTagOrder
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
    ) continue;

    // TIME
    const duration = getDurationInSecondsFromTimecode(video.timecode);

    if (
      duration >= filters.minTime * 60 &&
      (filters.maxTime === MAX_VIDEO_FILTER_TIME || duration <= filters.maxTime * 60)
    ) { outputVideoIds.push([creatorId, videoId]); }
  }

  // EXCLUDE TAGS: remove matching videos after the other filters.
  const finalVideoIds = filterVideoIdsByExcludedTags(
    outputVideoIds.map(([, videoId]) => videoId),
    filters.excludeTags,
    tagState,
    creatorState
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

export function filterVideosFromPlaylist(
  playlistVideoIds: [string, string][],
  creatorStates: Record<string, CreatorState>,
  filters: VideoFilterState,
  tagState: VideoTagState,
  maxResults?: number
): [string, string][] {

  const results: [string, string][] = [];

  for (const [creatorId, videoId] of playlistVideoIds) {
    if (!matchesCreatorFilter(creatorStates[creatorId], filters.creator)) continue;

    const video = getVideoById(creatorId, videoId);
    if (!video) continue;

    const videoState = creatorStates[creatorId]?.videoStates[videoId];

    // INCLUDE TAGS
    const videoTags = getEffectiveVideoTagNames(videoId, tagState, creatorStates[creatorId]);

    if (
      !matchesIncludedTags(videoTags, filters.includeTags, filters.includeTagOperators, filters.includeTagOrder)
    ) continue;

    // EXCLUDE TAGS
    if (
      filters.excludeTags.some((tag) => hasTag(videoTags, tag))
    ) continue;

    // WATCHED
    const watched =
      (videoState?.historicalMaxWatchPercentage ?? 0) > 0.9;

    if (
      (filters.watched === "no" && watched) ||
      (filters.watched === "yes" && !watched)
    ) continue;

    // DURATION
    const duration = getDurationInSecondsFromTimecode(video.timecode);

    if (
      duration < filters.minTime * 60 ||
      (filters.maxTime !== MAX_VIDEO_FILTER_TIME && duration > filters.maxTime * 60)
    ) continue;

    results.push([creatorId, videoId]);

    // Stop as soon as we have enough results
    if (maxResults !== undefined && results.length >= maxResults) {
      break;
    }
  }

  return results;
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
