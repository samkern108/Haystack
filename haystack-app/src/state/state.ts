import type { VideoLabelId, VideoLabel, VideoLabelIdOrNone } from "../features/labels/labels";
import type { CreatorFilter, WatchedFilter } from "../features/filtering/VideoFilterMenu";
import { sameVideo } from "../utils/videohelpers";
import { AllCreators, type VideoTag } from "./types";

/* -----------------------------
   STATE
------------------------------ */

export interface VideoState {
  currentWatchPercentage: number;
  historicalMaxWatchPercentage: number;
  // TODO(samkern) – add the ability for users to manually mark a video as "watched"
  // then set the historicalMaxWatchPercentage as 100%
  videoLabelId?: VideoLabelIdOrNone;
  comment?: string;
}

export interface CreatorState {
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
}

// TODO(Sam): For now, I'm putting tags in here,
// but I need to talk to Scott about how we store/load ALL community-submitted info.
export interface VideoTagState {
  allTags: Record<string, VideoTag>;
  // videoId, videoTagName[]
  allVideoTags: Record<string, string[]>;
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
  creatorStates: Record<string, CreatorState>;
  playlistStates: Record<string, PlaylistState>;

  videoFilterStates: VideoFilterState;

  videoTagState: VideoTagState;
}

/* -----------------------------
   ACTION TYPES
------------------------------ */

export type Action =
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
  |
    {
      type: "CREATE_NEW_PLAYLIST";
      playlistId: string;
      playlistName: string;
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
  creator: "both",
  watched: "both",
  minTime: 0,
  maxTime: 240,
  includeTags: [],
  excludeTags: [],
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

export function getTagByName(
  tagName: string,
  tagsState: VideoTagState
): VideoTag | undefined {
  return tagsState.allTags[tagName];
}

export function getTagsForVideo(state: AppState, videoId: string): VideoTag[] {
  const tagNames = state.videoTagState.allVideoTags?[videoId] : [];
  const videoTags = tagNames.flatMap(tagName => {
    const tag = state.videoTagState.allTags[tagName];
    return tag ? [tag] : [];
  });  
  return videoTags;
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
    
    case "SET_VIDEO_FILTERS": {
      return {
        ...state,
        videoFilterStates: action.filters
      };
    }

    case "ADD_NEW_VIDEO_TAG": {
      const { tagName } = action;

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
      const { videoId, tagName } = action;
      const currentTags = state.videoTagState.allVideoTags[videoId] ?? [];

      const updatedTags = currentTags.includes(tagName)
        ? currentTags.filter((tag) => tag !== tagName)
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

    case "CREATE_NEW_PLAYLIST": {
      const { playlistId, playlistName } = action;
      const playlist = 
      { id: playlistId, 
        name: playlistName,
        description: "",
        videoLabelId: "x",
        videoIds: [],
        systemDefault: false,

      } as PlaylistState;
      return {
        ...state,
        playlistStates: {
          ...state.playlistStates,
          [playlistId]: playlist,
        },
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
