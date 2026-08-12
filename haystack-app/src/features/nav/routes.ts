export const AppRoutes = {
  HOME: "/",
  ABOUT: "/about",
  VIDEO: "/video/:id",
  PLAYLISTS: "/playlists",
  SUBMIT_A_CREATOR: "/submitacreator",
  USER_PROFILE: "/profile", // TODO – there should be a distinction between YOUR profile and A profile.
  SEARCH: "/search",

  video: (id: string) => `/video/${id}`,
} as const;