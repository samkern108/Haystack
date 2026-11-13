import { hasTag, sameTag, resolveTagName } from "../utils/taghelpers";
import { SYSTEM_VIDEO_LABELS, type VideoLabelId, type VideoLabel, type VideoLabelIdOrNone } from "../features/labels/labels";
import type { CreatorFilter, WatchedFilter } from "../features/filtering/VideoFilterMenu";
import { sameVideo } from "../utils/videohelpers";
import { AllCreators, type VideoTag } from "./types";
import { MAX_VIDEO_FILTER_TIME } from "../features/filtering/constants";

/* -----------------------------
   STATE
------------------------------ */

export interface VideoState {
  creatorTagExceptions?: string[];
  currentWatchPercentage: number;
  historicalMaxWatchPercentage: number;
  // TODO(samkern) – add the ability for users to manually mark a video as "watched"
  // then set the historicalMaxWatchPercentage as 100%
  videoLabelId?: VideoLabelIdOrNone;
  comment?: string;
}

export interface CreatorState {
  tags?: string[];
  followed: boolean;
  favorite: boolean;
  doNotShow?: boolean;
  videoStates: Record<string, VideoState>;
}

export interface VideoFilterState {
  creator: CreatorFilter;
  watched: WatchedFilter;
  minTime: number;
  maxTime: number;
  includeTags: string[];
  excludeTags: string[];
  inWatchLater: boolean;
  inLove: boolean;
}

export type FilterPresetValues = Pick<VideoFilterState,
  "creator" | "watched" | "minTime" | "maxTime" | "includeTags" | "excludeTags">;

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterPresetValues;
}

function presetValues(filters: VideoFilterState): FilterPresetValues {
  return {
    creator: filters.creator,
    watched: filters.watched,
    minTime: filters.minTime,
    maxTime: filters.maxTime,
    includeTags: [...filters.includeTags],
    excludeTags: [...filters.excludeTags],
  };
}

// TODO(Sam): Should creator tags be different from video tags?
// etc, comedy vs comedian?

// TODO(Sam): Shouldn't be called VideoTagState since we have Creators now

// TODO(Sam): For now, I'm putting tags in here,
// but I need to talk to Scott about how we store/load ALL community-submitted info.
export interface VideoTagState {
  allTags: Record<string, VideoTag>; 
  allVideoTags: Record<string, string[]>; // videoId, videoTagName[]
}

export interface PlaylistState {
  id: string;
  name: string;
  exclusive?: boolean;
  videoLabelId: VideoLabelId;
  description?: string;
  videoIds: [creatorId: string, videoId: string][];
}

export interface AppState {
  filterPresets?: FilterPreset[];
  activeFilterPresetId?: string;
  creatorStates: Record<string, CreatorState>;
  playlistStates: Record<string, PlaylistState>;

  videoFilterStates: VideoFilterState;

  videoTagState: VideoTagState;
}

/* -----------------------------
   ACTION TYPES
------------------------------ */

export type Action =
  | { type: "REMOVE_TAG"; tagName: string }
  | { type: "SET_TAG_EMOJI"; tagName: string; emoji: string }
  | { type: "RENAME_TAG" | "MERGE_TAG"; source: string; target: string }
  | { type: "SAVE_FILTER_PRESET"; id: string; name: string }
  | { type: "TOGGLE_FILTER_PRESET"; id: string }
  | {
      type: "TOGGLE_CREATOR_TAG_EXCEPTION";
      creatorId: string;
      videoId: string;
      tagName: string;
    }
  | {
      type: "ADD_CREATOR_TAG" | "REMOVE_CREATOR_TAG";
      creatorId: string;
      tagName: string;
    }
  | {
      type: "SET_VIDEO_FILTERS";
      filters: VideoFilterState;
    }
  | {
      type: "ADD_NEW_VIDEO_TAG";
      tagName: string;
    }
  | {
      type: "UPDATE_TAGS_FOR_VIDEO";
      videoId: string;
      tagName: string;
    }
  | {
      type: "TOGGLE_CREATOR_FLAG";
      creatorId: string;
      field: "followed" | "favorite" | "doNotShow";
    }
  | {
      type: "SET_VIDEO_LABEL";
      creatorId: string;
      videoId: string;
      videoLabel: VideoLabel;
    }
  | {
      type: "SET_WATCH_PERCENTAGE";
      creatorId: string;
      videoId: string;
      value: number;
    }
  | {
      type: "SET_COMMENT";
      creatorId: string;
      videoId: string;
      comment: string;
    };

/* -----------------------------
   INITIAL STATE
------------------------------ */

export const DEFAULT_VIDEO_FILTERS: VideoFilterState = {
  creator: "all",
  watched: "all",
  minTime: 0,
  maxTime: MAX_VIDEO_FILTER_TIME,
  includeTags: [],
  excludeTags: [],
  inWatchLater: false,
  inLove: false,
};

export const DEFAULT_VIDEO_TAGS: VideoTagState = {
  allVideoTags: {},
  allTags: {},
}

function createInitialPlaylistStates(): Record<string, PlaylistState> {
  const initialPlaylists = {} as Record<string, PlaylistState>;
  initialPlaylists['love'] = {
    id: 'love',
    name: 'Favorites (Private)',
    videoLabelId: "love",
    exclusive: true,
    videoIds: []
  };
  initialPlaylists['star'] = {
    id: 'star',
    name: 'Favorites (public)',
    videoLabelId: "star",
    exclusive: true,
    videoIds: []
  };
  initialPlaylists['x'] = {
    id: 'x',
    name: 'x',
    videoLabelId: "x",
    exclusive: true,
    videoIds: []
  };
  initialPlaylists['watchlater'] = {
    id: 'watchlater',
    name: 'Watch Later',
    videoLabelId: "watchlater",
    exclusive: false,
    videoIds: []
  };
  return initialPlaylists;
}

// TODO(sam)
// Depending on how we retrieve new creators from the backend,
// we may want to initialize differently (or repeatedly)
export const initialState: AppState = {
  creatorStates: Object.values(AllCreators).reduce((acc, creator) => {
    acc[creator.ucid] = {
      followed: false,
      favorite: false,
      doNotShow: false,
      videoStates: Object.keys(creator.videos).reduce((videoAcc, videoId) => {
        videoAcc[videoId] = {
          currentWatchPercentage: 0,
          historicalMaxWatchPercentage: 0,
          videoLabelId: null,
          comment: "",
        };
        return videoAcc;
      }, {} as Record<string, VideoState>),
    };
    return acc;
  }, {} as Record<string, CreatorState>),
  playlistStates: createInitialPlaylistStates(),
  filterPresets: [],
  videoFilterStates: DEFAULT_VIDEO_FILTERS,
  videoTagState: DEFAULT_VIDEO_TAGS,
};

/* -----------------------------
   SAFE READ HELPERS
------------------------------ */

export function getPlaylistState(state: AppState, playlistId: string): PlaylistState {
  return state.playlistStates?.[playlistId] ?? {};
}

export function getCreatorState(state: AppState, creatorId: string): CreatorState {
  return state.creatorStates?.[creatorId] ?? {};
}

export function getVideoState(state: AppState, creatorId: string, videoId: string): VideoState | undefined {
  return state.creatorStates?.[creatorId]?.videoStates?.[videoId] ?? undefined;
}

export function getVideoFilterState(state: AppState): VideoFilterState {
  return state.videoFilterStates ?? DEFAULT_VIDEO_FILTERS;
}

export function getTagByName(tagName: string, tagsState: VideoTagState): VideoTag | undefined {
  return tagsState.allTags[resolveTagName(Object.keys(tagsState.allTags), tagName)];
}

export function getTagsForVideo(state: AppState, videoId: string): VideoTag[] {
  const tagNames = state.videoTagState.allVideoTags?.[videoId] ?? [];
  const videoTags = tagNames.flatMap(tagName => {
    const tag = state.videoTagState.allTags[tagName];
    return tag ? [tag] : [];
  });  
  return videoTags;
}

export function getTagsForCreator(state: AppState, creatorId: string): VideoTag[] {
  return (state.creatorStates[creatorId]?.tags ?? []).flatMap((name) => {
    const tag = state.videoTagState.allTags[name];
    return tag ? [tag] : [];
  });
}

export function getVideoCountForTag(
  tagName: string,
  tagsState: VideoTagState,
  creatorStates: Record<string, CreatorState>
): number {
  const videoIds = new Set(
    Object.entries(tagsState.allVideoTags)
      .filter(([, tagNames]) => hasTag(tagNames, tagName))
      .map(([videoId]) => videoId)
  );

  for (const [creatorId, creatorState] of Object.entries(creatorStates)) {
    if (!hasTag(creatorState.tags ?? [], tagName)) continue;

    for (const videoId of Object.keys(AllCreators[creatorId]?.videos ?? {})) {
      const exceptions = creatorState.videoStates[videoId]?.creatorTagExceptions ?? [];
      if (!hasTag(exceptions, tagName)) videoIds.add(videoId);
    }
  }

  return videoIds.size;
}

/* -----------------------------
   REDUCER HELPERS
------------------------------ */

function toggleVideoInPlaylist(
  state: AppState,
  playlistId: string,
  videoId: [creatorId: string, videoId: string]
): AppState {
  const playlistState = getPlaylistState(state, playlistId);
  const playlistStates = { ...state.playlistStates };

  // If this is an exclusive playlist, remove the video
  // from all other exclusive playlists.
  if (playlistState.exclusive) {
    Object.entries(playlistStates).forEach(([otherPlaylistId, otherPlaylist]) => {
      if (
        otherPlaylistId !== playlistId &&
        otherPlaylist.exclusive &&
        otherPlaylist.videoIds.some(id => sameVideo(id, videoId))
      ) {
        playlistStates[otherPlaylistId] = {
          ...otherPlaylist,
          videoIds: otherPlaylist.videoIds.filter(
            id => !sameVideo(id, videoId)
          ),
        };
      }
    });
  }

  const currentVideos = playlistStates[playlistId].videoIds;
  const alreadyIncluded = currentVideos.some(id => sameVideo(id, videoId));

  const nextVideos = alreadyIncluded
    ? currentVideos.filter(id => !sameVideo(id, videoId))
    : [...currentVideos, videoId];

  playlistStates[playlistId] = {
    ...playlistStates[playlistId],
    videoIds: nextVideos,
  };

  return {
    ...state,
    playlistStates,
  };
}

/* -----------------------------
   REDUCER
------------------------------ */

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "REMOVE_TAG": {
      if (!Object.hasOwn(state.videoTagState.allTags, action.tagName)) return state;
      const remove = (names: string[]) => names.filter((name) => !sameTag(name, action.tagName));
      const cleanFilters = <T extends FilterPresetValues>(filters: T): T => ({
        ...filters, includeTags: remove(filters.includeTags), excludeTags: remove(filters.excludeTags),
      });
      const allTags = Object.fromEntries(Object.entries(state.videoTagState.allTags)
        .filter(([name]) => !sameTag(name, action.tagName)));
      return {
        ...state,
        videoTagState: {
          ...state.videoTagState,
          allTags,
          allVideoTags: Object.fromEntries(Object.entries(state.videoTagState.allVideoTags)
            .map(([id, names]) => [id, remove(names)])),
        },
        creatorStates: Object.fromEntries(Object.entries(state.creatorStates).map(([id, creator]) => [id, {
          ...creator,
          tags: remove(creator.tags ?? []),
          videoStates: Object.fromEntries(Object.entries(creator.videoStates).map(([videoId, video]) => [videoId, {
            ...video,
            ...(video.creatorTagExceptions ? { creatorTagExceptions: remove(video.creatorTagExceptions) } : {}),
          }])),
        }])),
        videoFilterStates: cleanFilters(getVideoFilterState(state)),
        filterPresets: state.filterPresets?.map((preset) => ({ ...preset, filters: cleanFilters(preset.filters) })),
      };
    }
    case "SET_TAG_EMOJI": {
      if (!Object.hasOwn(state.videoTagState.allTags, action.tagName)) return state;
      return {
        ...state,
        videoTagState: {
          ...state.videoTagState,
          allTags: {
            ...state.videoTagState.allTags,
            [action.tagName]: { ...state.videoTagState.allTags[action.tagName], emoji: action.emoji || undefined },
          },
        },
      };
    }
    case "RENAME_TAG":
    case "MERGE_TAG": {
      const source = action.source;
      const target = action.type === "MERGE_TAG"
        ? resolveTagName(Object.keys(state.videoTagState.allTags).filter((name) => name !== source), action.target) : action.target.trim();
      const allTags = state.videoTagState.allTags;
      if (!target || source === target || !Object.hasOwn(allTags, source)) return state;
      const targetExists = Object.keys(allTags).some((name) => name !== source && sameTag(name, target));
      if (action.type === "RENAME_TAG" ? targetExists : !targetExists) return state;

      const replace = (names: string[]) => {
        const result: string[] = [];
        for (const name of names) {
          const updated = sameTag(name, source) || sameTag(name, target) ? target : name;
          if (!hasTag(result, updated)) result.push(updated);
        }
        return result;
      };
      const replaceFilters = <T extends FilterPresetValues>(filters: T): T => ({
        ...filters, includeTags: replace(filters.includeTags), excludeTags: replace(filters.excludeTags),
      });
      const updatedTags = { ...allTags };
      delete updatedTags[source];
      updatedTags[target] = targetExists ? allTags[target] : { ...allTags[source], name: target };

      return {
        ...state,
        videoTagState: {
          ...state.videoTagState,
          allTags: updatedTags,
          allVideoTags: Object.fromEntries(Object.entries(state.videoTagState.allVideoTags)
            .map(([id, names]) => [id, replace(names)])),
        },
        creatorStates: Object.fromEntries(Object.entries(state.creatorStates).map(([id, creator]) => {
          const tags = creator.tags ?? [];
          return [id, {
            ...creator,
            tags: replace(tags),
            videoStates: Object.fromEntries(Object.entries(creator.videoStates).map(([videoId, video]) => {
              const exceptions = video.creatorTagExceptions;
              if (!exceptions) return [videoId, video];
              // Merging keeps inheritance when either original creator tag applied.
              const inherited = [source, target].some((tag) => tags.includes(tag) && !exceptions.includes(tag));
              const renamed = replace(exceptions);
              return [videoId, {
                ...video,
                creatorTagExceptions: inherited ? renamed.filter((tag) => tag !== target) : renamed,
              }];
            })),
          }];
        })),
        videoFilterStates: replaceFilters(getVideoFilterState(state)),
        filterPresets: state.filterPresets?.map((preset) => ({ ...preset, filters: replaceFilters(preset.filters) })),
      };
    }
    case "TOGGLE_CREATOR_TAG_EXCEPTION": {
      const creator = getCreatorState(state, action.creatorId);
      const video = creator.videoStates?.[action.videoId];
      if (!video || !hasTag(creator.tags ?? [], action.tagName)) return state;
      const exceptions = video.creatorTagExceptions ?? [];
      return {
        ...state,
        creatorStates: {
          ...state.creatorStates,
          [action.creatorId]: {
            ...creator,
            videoStates: {
              ...creator.videoStates,
              [action.videoId]: {
                ...video,
                creatorTagExceptions: hasTag(exceptions, action.tagName)
                  ? exceptions.filter((name) => !sameTag(name, action.tagName))
                  : [...exceptions, action.tagName],
              },
            },
          },
        },
      };
    }
    case "ADD_CREATOR_TAG":
    case "REMOVE_CREATOR_TAG": {
      const tagName = resolveTagName(Object.keys(state.videoTagState.allTags), action.tagName);
      if (!tagName) return state;
      const creator = getCreatorState(state, action.creatorId);
      const tags = creator.tags ?? [];
      const adding = action.type === "ADD_CREATOR_TAG";
      if (adding === hasTag(tags, tagName)) return state;

      return {
        ...state,
        creatorStates: {
          ...state.creatorStates,
          [action.creatorId]: {
            ...creator,
            tags: adding ? [...tags, tagName] : tags.filter((tag) => !sameTag(tag, tagName)),
          },
        },
        videoTagState: adding ? {
          ...state.videoTagState,
          allTags: {
            ...state.videoTagState.allTags,
            [tagName]: Object.hasOwn(state.videoTagState.allTags, tagName)
              ? state.videoTagState.allTags[tagName]
              : { name: tagName, color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)` },
          },
        } : state.videoTagState,
      };
    }
    
    case "SAVE_FILTER_PRESET": {
      const name = action.name.trim();
      if (!name) return state;
      return {
        ...state,
        filterPresets: [...(state.filterPresets ?? []), {
          id: action.id, name, filters: presetValues(getVideoFilterState(state)),
        }],
        activeFilterPresetId: action.id,
      };
    }

    case "TOGGLE_FILTER_PRESET": {
      const preset = state.filterPresets?.find((item) => item.id === action.id);
      if (!preset) return state;
      const deactivating = state.activeFilterPresetId === action.id;
      return {
        ...state,
        activeFilterPresetId: deactivating ? undefined : preset.id,
        videoFilterStates: {
          ...getVideoFilterState(state),
          ...presetValues(deactivating ? DEFAULT_VIDEO_FILTERS : {
            ...getVideoFilterState(state), ...preset.filters,
          }),
        },
      };
    }

    case "SET_VIDEO_FILTERS": {
      const activePreset = state.filterPresets?.find((item) => item.id === state.activeFilterPresetId);
      return {
        ...state,
        activeFilterPresetId: activePreset
          && JSON.stringify(presetValues(action.filters)) === JSON.stringify(activePreset.filters)
          ? activePreset.id : undefined,
        videoFilterStates: action.filters
      };
    }

    case "ADD_NEW_VIDEO_TAG": {
      const tagName = resolveTagName(Object.keys(state.videoTagState.allTags), action.tagName);
      if (!tagName) return state;

      // Don't overwrite an existing tag.
      if (state.videoTagState.allTags[tagName]) {
        return state;
      }

      const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;

      return {
        ...state,
        videoTagState: {
          ...state.videoTagState,
          allTags: {
            ...state.videoTagState.allTags,
            [tagName]: {
              name: tagName,
              color: randomColor,
            },
          },
        },
      };
    }

    case "UPDATE_TAGS_FOR_VIDEO": {
      const { videoId } = action;
      const tagName = resolveTagName(Object.keys(state.videoTagState.allTags), action.tagName);
      if (!tagName) return state;
      const currentTags = state.videoTagState.allVideoTags[videoId] ?? [];

      const updatedTags = hasTag(currentTags, tagName)
        ? currentTags.filter((tag) => !sameTag(tag, tagName))
        : [...currentTags, tagName];

      return {
        ...state,
        videoTagState: {
          ...state.videoTagState,
          allVideoTags: {
            ...state.videoTagState.allVideoTags,
            [videoId]: updatedTags,
          },
        },
      };
    }

    case "TOGGLE_CREATOR_FLAG": {
      const { creatorId, field } = action;

      const creator = getCreatorState(state, creatorId);

      return {
        ...state,
        creatorStates: {
          ...state.creatorStates,
          [creatorId]: {
            ...creator,
            [field]: !creator[field]
          }
        }
      };
    }

    case "SET_VIDEO_LABEL": {
      const { creatorId, videoId, videoLabel } = action;

      const creator = getCreatorState(state, creatorId);
      const videos = creator.videoStates ?? {};
      const video = videos[videoId] ?? {};

      const current = video.videoLabelId ?? null;

      // TODO(Sam) This produced a really frustrating bug because you
      // were using videoLabelDef.label instead of .id
      // Can we make these types/objects little safer?
      const next =
        current === videoLabel.id
          ? null
          : videoLabel.id;

      let nextState = state;
      if (videoLabel.associatedPlaylistId) {
        nextState = toggleVideoInPlaylist(
          nextState,
          videoLabel.associatedPlaylistId,
          [creatorId, videoId]
        );
      }

      return {
        ...nextState,
        creatorStates: {
          ...nextState.creatorStates,
          [creatorId]: {
            ...creator,
            videoStates: {
              ...videos,
              [videoId]: {
                ...video,
                videoLabelId: next as VideoLabelId
              }
            }
          }
        }
      };
    }

    case "SET_WATCH_PERCENTAGE": {
      const { creatorId, videoId, value } = action;

      const creator = getCreatorState(state, creatorId);
      const videos = creator.videoStates ?? {};
      const video = videos[videoId] ?? {};

      const maxValue = (value > video.historicalMaxWatchPercentage) ? value : video.historicalMaxWatchPercentage;

      return {
        ...state,
        creatorStates: {
          ...state.creatorStates,
          [creatorId]: {
            ...creator,
            videoStates: {
              ...videos,
              [videoId]: {
                ...video,
                currentWatchPercentage: value,
                historicalMaxWatchPercentage: maxValue,
              } 
            }
          }
        }
      };
    }

    case "SET_COMMENT": {
      const { creatorId, videoId, comment } = action;

      const creator = getCreatorState(state, creatorId);
      const videos = creator.videoStates ?? {};
      const video = videos[videoId] ?? {};

      return {
        ...state,
        creatorStates: {
          ...state.creatorStates,
          [creatorId]: {
            ...creator,
            videoStates: {
              ...videos,
              [videoId]: {
                ...video,
                comment
              }
            }
          }
        }
      };
    }

    default:
      return state;
  }
}

// Playlist membership retains every applied label.
export function getVideoLabels(state: AppState, creatorId: string, videoId: string): VideoLabel[] {
  return SYSTEM_VIDEO_LABELS.filter((label) =>
    label.associatedPlaylistId && state.playlistStates[label.associatedPlaylistId]?.videoIds.some(
      (id) => sameVideo(id, [creatorId, videoId])
    )
  );
}
