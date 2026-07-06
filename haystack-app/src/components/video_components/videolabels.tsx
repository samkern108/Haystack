import React, { type ReactElement } from "react";
import *  as Icons from "./videolabelsvg";

export type SystemVideoLabelId = "love" | "star" | "x";
export type VideoLabelId = SystemVideoLabelId; // TODO - This should be SystemVideoLabel | UserVideoLabel, but we don't have user video labels yet.
export type VideoLabelIdOrNone = VideoLabelId | null | undefined;

export interface VideoLabel {
  id: VideoLabelId;
  label: string;
  icon: React.ReactNode;
  color: string;
  associatedPlaylistId?: string;
}

export const SYSTEMVIDEOLABELS: VideoLabel[] = [
  {
    id: "love",
    label: "Love",
    associatedPlaylistId: "favorites",
    color: "#000000",
    icon: Icons.loveIcon // TODO – Should prolly make this iconId.
  },
  {
    id: "star",
    label: "Star",
    associatedPlaylistId: "watch-later",
    color: "#000000",
    icon: Icons.starIcon
  },
  {
    id: "x",
    label: "X",
    associatedPlaylistId: "x",
    color: "#000000",
    icon: Icons.xIcon
  },
];

export const findVideoLabelDefById = (id: VideoLabelId): VideoLabel | undefined => {
  return SYSTEMVIDEOLABELS.find((b) => b.id === id);
}

export const videoIcons: Record<VideoLabelId, ReactElement> = {
  love: Icons.loveIcon,
  star: Icons.starIcon,
  x: Icons.xIcon,
}