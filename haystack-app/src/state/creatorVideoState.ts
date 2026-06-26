import type { VideoLabel, VideoLabelDef, VideoLabelOrNone } from "../components/video_components/videolabels";

/* -----------------------------
   STATE
------------------------------ */

export interface VideoState {
  watchPercentage?: number;
  videoLabel?: VideoLabelOrNone;
  comment?: string;
}

export interface CreatorState {
  followed?: boolean;
  favorite?: boolean;
  doNotShow?: boolean;
  videos?: Record<string, VideoState>;
}

export interface PlaylistState {
  id: string;
  name: string;
  description?: string;
  videoIds: string[];
}

export interface State {
  creators: Record<string, CreatorState>;
  playlists: Record<string, PlaylistState>;
}

/* -----------------------------
   ACTION TYPES
------------------------------ */

export type Action =
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
  |
    {
      type: "TOGGLE_VIDEO_IN_PLAYLIST";
      playlistId: string;
      videoId: string;
    }
  | {
      type: "SET_VIDEO_LABEL";
      creatorId: string;
      videoId: string;
      videoLabelDef: VideoLabelDef;
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

function createInitialPlaylists(): Record<string, PlaylistState> {
  const initialPlaylists = {} as Record<string, PlaylistState>;
  initialPlaylists['favorites'] = {
    id: 'favorites',
    name: 'Favorites',
    videoIds: []
  };
  initialPlaylists['watch-later'] = {
    id: 'watch-later',
    name: 'Watch Later',
    videoIds: []
  };
  initialPlaylists['x'] = {
    id: 'x',
    name: 'x',
    videoIds: []
  };
  return initialPlaylists;
}

export const initialState: State = {
  creators: {},
  playlists: createInitialPlaylists(),
};

/* -----------------------------
   SAFE READ HELPERS
------------------------------ */

export function getPlaylist(state: State, playlistId: string): PlaylistState {
  return state.playlists?.[playlistId] ?? {};
}

export function getCreator(state: State, creatorId: string): CreatorState {
  return state.creators?.[creatorId] ?? {};
}

export function getVideo(state: State, creatorId: string, videoId: string): VideoState {
  return state.creators?.[creatorId]?.videos?.[videoId] ?? {};
}

/* -----------------------------
   REDUCER HELPERS
------------------------------ */

function toggleVideoInPlaylist(state: State, playlistId: string, videoId: string): State {
  const playlist = getPlaylist(state, playlistId);
  const videos = playlist.videoIds ?? [];

  const nextVideos = videos.includes(videoId)
    ? videos.filter(id => id !== videoId)
    : [...videos, videoId];

  return {
    ...state,
    playlists: {
      ...state.playlists,
      [playlistId]: {
        ...playlist,
        videoIds: nextVideos,
      },
    },
  };
}

/* -----------------------------
   REDUCER
------------------------------ */

export function reducer(state: State, action: Action): State {
  switch (action.type) {

    case "TOGGLE_CREATOR_FLAG": {
      const { creatorId, field } = action;

      const creator = getCreator(state, creatorId);

      return {
        ...state,
        creators: {
          ...state.creators,
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
        videoIds: [],
        systemDefault: false,

      } as PlaylistState;
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [playlistId]: playlist,
        },
      };
    }

    case "TOGGLE_VIDEO_IN_PLAYLIST": {
      const { playlistId, videoId } = action;
      return toggleVideoInPlaylist(state, playlistId, videoId);
    }

    case "SET_VIDEO_LABEL": {
      const { creatorId, videoId, videoLabelDef } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      const current = video.videoLabel ?? null;

      const next =
        current === videoLabelDef.label
          ? null
          : videoLabelDef.label;

      if (videoLabelDef.associatedPlaylistId) {
        state = toggleVideoInPlaylist(
          state,
          videoLabelDef.associatedPlaylistId,
          videoId
        );
      }

      return {
        ...state,
        creators: {
          ...state.creators,
          [creatorId]: {
            ...creator,
            videos: {
              ...videos,
              [videoId]: {
                ...video,
                videoLabel: next as VideoLabel
              }
            }
          }
        }
      };
    }

    case "SET_WATCH_PERCENTAGE": {
      const { creatorId, videoId, value } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      return {
        ...state,
        creators: {
          ...state.creators,
          [creatorId]: {
            ...creator,
            videos: {
              ...videos,
              [videoId]: {
                ...video,
                watchPercentage: value
              }
            }
          }
        }
      };
    }

    case "SET_COMMENT": {
      const { creatorId, videoId, comment } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      return {
        ...state,
        creators: {
          ...state.creators,
          [creatorId]: {
            ...creator,
            videos: {
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