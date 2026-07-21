export const AppRoutes = {
  HOME: "/",
  ABOUT: "/about",
  VIDEO: "/video/:id",
  PLAYLISTS: "/playlists",
  SUBMIT_A_CREATOR: "/submitacreator",
  SEARCH: "/search",

  video: (id: string) => `/video/${id}`,
} as const;