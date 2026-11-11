export const AppRoutes = {
  TAGS: "/tags",
  HOME: "/",
  CREATORS: "/creators",
  CREATOR: "/creators/:creatorId",
  ABOUT: "/about",
  VIDEO: "/v/:videoId/c/:creatorId",
  SUBMIT_A_CREATOR: "/submitacreator",
  USER_PROFILE: "/profile", // TODO – there should be a distinction between YOUR profile and A profile.
  SEARCH: "/search",

  video: (videoId: string, creatorId: string) => `/v/${videoId}/c/${creatorId}`,
  creator: (creatorId: string) => `/creators/${encodeURIComponent(creatorId)}`,
} as const;
