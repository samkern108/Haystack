import type { CreatorState, VideoFilterState } from "../state/state";
import { AllCreators, type Video } from "../state/types";

export function getVideoById(creatorId: string, videoId: string): Video {
  return AllCreators[creatorId]?.videos?.[videoId];
}

// The way we're returning data RIGHT NOW, 
// it is most economical to filter videos *one creator at a time*
export function filterVideosForCreator(creatorId: string, creatorState: CreatorState, filters: VideoFilterState, inputVideoIds: Record<string, Video>, maxResultsPerCreator?: number) {
  let outputVideoIds = [] as [creatorId: string, videoId: string][];
  Object.values(inputVideoIds).forEach((video) => {
    if(maxResultsPerCreator && outputVideoIds.length >= maxResultsPerCreator) return;
    // TODO(samkern)
    // Put this in a helper function in videoHelpers that also checks a "manualWatchTriggered" flag
    const watched = creatorState.videoStates[video.video_id].historicalMaxWatchPercentage > .9;
    console.log('watchpercentage ' + creatorState.videoStates[video.video_id].historicalMaxWatchPercentage);

    // WATCHED
    if ((filters.watched === 'no' && watched) || (filters.watched === 'yes' && !watched)) {
      return;
    }

    // TIME
    const duration = getDurationInSecondsFromTimecode(video.timecode);
    if (duration <= (filters.maxTime * 60) && duration >= (filters.minTime * 60)) {
      outputVideoIds.push([creatorId, video.video_id]);
    }
  })
  return outputVideoIds;
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