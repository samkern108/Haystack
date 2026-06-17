export const AppRoutes = {
  HOME: "/",
  ABOUT: "/about",
  VIDEO: "/video/:id",

  video: (id: string) => `/video/${id}`,
} as const;