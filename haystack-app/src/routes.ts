export const AppRoutes = {
  HOME: "/",
  ABOUT: "/about",
  VIDEO: "/video/:id",
  PLAYLISTS: "/playlists",

  video: (id: string) => `/video/${id}`,
} as const;