import type { VideoLabelId, VideoLabel, VideoLabelIdOrNone } from "../components/video/videolabels";

/* -----------------------------
   STATE
------------------------------ */

export interface VideoState {
  watchPercentage?: number;
  videoLabelId?: VideoLabelIdOrNone;
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
  exclusive?: boolean;
  videoLabelId: VideoLabelId;
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

function createInitialPlaylists(): Record<string, PlaylistState> {
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

function toggleVideoInPlaylist(
  state: State,
  playlistId: string,
  videoId: string
): State {
  const playlist = getPlaylist(state, playlistId);

  let playlists = { ...state.playlists };

  // If this is an exclusive playlist, remove the video from all other exclusive playlists.
  if (playlist.exclusive) {
    Object.entries(playlists).forEach(([otherPlaylistId, otherPlaylist]) => {
      if (
        otherPlaylistId !== playlistId &&
        otherPlaylist.exclusive &&
        otherPlaylist.videoIds.includes(videoId)
      ) {
        
        playlists[otherPlaylistId] = {
          ...otherPlaylist,
          videoIds: otherPlaylist.videoIds.filter(id => id !== videoId),
        };
      }
    });
  }

  const currentVideos = playlists[playlistId].videoIds;

  const nextVideos = currentVideos.includes(videoId)
    ? currentVideos.filter(id => id !== videoId)
    : [...currentVideos, videoId];

  playlists[playlistId] = {
    ...playlists[playlistId],
    videoIds: nextVideos,
  };

  return {
    ...state,
    playlists,
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
        videoLabelId: "x",
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

    case "SET_VIDEO_LABEL": {
      const { creatorId, videoId, videoLabel } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      const current = video.videoLabelId ?? null;

      // FIX: Hey sam, this produced a really frustrating bug because you
      // were using videoLabelDef.label instead of .id
      // Can we make these types/objects little safer?
      const next =
        current === videoLabel.id
          ? null
          : videoLabel.id;

      if (videoLabel.associatedPlaylistId) {
        state = toggleVideoInPlaylist(
          state,
          videoLabel.associatedPlaylistId,
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
                videoLabelId: next as VideoLabelId
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