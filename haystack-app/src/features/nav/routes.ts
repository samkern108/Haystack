export const AppRoutes = {
  HOME: "/",
  CREATORS: "/creators",
  ABOUT: "/about",
  VIDEO: "/v/:videoId/c/:creatorId",
  PLAYLISTS: "/playlists",
  SUBMIT_A_CREATOR: "/submitacreator",
  USER_PROFILE: "/profile", // TODO – there should be a distinction between YOUR profile and A profile.
  SEARCH: "/search",

  video: (videoId: string, creatorId: string) => `/v/${videoId}/c/${creatorId}`,
} as const;