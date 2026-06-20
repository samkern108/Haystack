export type Reaction = "love" | "star" | "x";
export type ReactionOrNone = Reaction | null | undefined;

export interface VideoState {
  watchPercentage?: number;
  reaction?: ReactionOrNone;
  comment?: string;
}

export interface CreatorState {
  followed?: boolean;
  favorite?: boolean;
  doNotShow?: boolean;
  videos?: Record<string, VideoState>;
}

export interface State {
  creators: Record<string, CreatorState>;
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
  | {
      type: "SET_REACTION";
      creatorId: string;
      videoId: string;
      reaction: Exclude<Reaction, null>;
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
  creators: {}
};

/* -----------------------------
   SAFE READ HELPERS
------------------------------ */

export function getCreator(state: State, creatorId: string): CreatorState {
  return state.creators?.[creatorId] ?? {};
}

export function getVideo(
  state: State,
  creatorId: string,
  videoId: string
): VideoState {
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

    /* ---- REACTION ---- */

    case "SET_REACTION": {
      const { creatorId, videoId, reaction } = action;

      const creator = getCreator(state, creatorId);
      const videos = creator.videos ?? {};
      const video = videos[videoId] ?? {};

      const current = video.reaction ?? null;
      const next = current === reaction ? null : reaction;

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
                reaction: next
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