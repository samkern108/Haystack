import React, { type ReactElement } from "react";
import *  as Icons from "./videolabelsvg";

export type SystemVideoLabelId = "love" | "star" | "x";
export type VideoLabelId = SystemVideoLabelId; // TODO - This should be SystemVideoLabel | UserVideoLabel, but we don't have user video labels yet.
export type VideoLabelIdOrNone = VideoLabelId | null | undefined;

export interface VideoLabel {
  id: VideoLabelId;
  label: string;
  icon: React.ReactNode;
  lightColor: string;
  darkColor: string;
  associatedPlaylistId?: string;
  description: string;
}

// The system playlists:
// Heart + Star both feed into Favorites
// 

export const SYSTEMVIDEOLABELS: VideoLabel[] = [
  {
    id: "love",
    label: "Love",
    associatedPlaylistId: "favorites",
    lightColor: "#df7e9c",
    darkColor: "#c95a80",
    icon: Icons.loveIcon, // TODO – Should prolly make this iconId.
    description: "Favorite (public)"
  },
  {
    id: "star",
    label: "Star",
    associatedPlaylistId: "watch-later",
    lightColor: "#fde68a",
    darkColor: "#facc15",
    icon: Icons.starIcon,
    description: "Favorite (private)"
  },
  {
    id: "x",
    label: "X",
    associatedPlaylistId: "x",
    lightColor: "#fca5a5",
    darkColor: "#ef4444",
    icon: Icons.xIcon,
    description: "Do not recommend"
  },
];

export const findVideoLabelById = (id: VideoLabelId): VideoLabel | undefined => {
  return SYSTEMVIDEOLABELS.find((b) => b.id === id);
}

export const videoIcons: Record<VideoLabelId, ReactElement> = {
  love: Icons.loveIcon,
  star: Icons.starIcon,
  x: Icons.xIcon,
}