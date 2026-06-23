import type { VideoLabel, VideoLabelOrNone } from "../components/video_components/videolabels";

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
  videos: string[];
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
      type: "TOGGLE_VIDEO_IN_PLAYLIST";
      playlistId: string;
      videoId: string;
    }
  | {
      type: "SET_VIDEO_LABEL";
      creatorId: string;
      videoId: string;
      videoLabel: Exclude<VideoLabel, null>;
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

export const initialState: State = {
  creators: {},
  playlists: {}
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
   REDUCER
------------------------------ */

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    /* ---- CREATOR FLAGS ---- */

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

    /* ---- PLAYLIST ---- */
    case "TOGGLE_VIDEO_IN_PLAYLIST": {
      const { playlistId, videoId } = action;

      const playlist = getPlaylist(state, playlistId);
      const videos = playlist.videos ?? [];

      const nextVideos = videos.includes(videoId)
        ? videos.filter(id => id !== videoId)
        : [...videos, videoId];

      return {
        ...state,
        playlists: {
          ...state.playlists,
          [playlistId]: {
            ...playlist,
            videos: nextVideos,
          },
        },
      };
    }

    /* ---- REACTION ---- */

    case "SET_VIDEO_LABEL": {
      const { creatorId, videoId, videoLabel } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      const current = video.videoLabel ?? null;
      const next = current === videoLabel ? null : videoLabel;

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
                videoLabel: next
              }
            }
          }
        }
      };
    }

    /* ---- WATCH PERCENTAGE ---- */

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

    /* ---- COMMENT ---- */

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