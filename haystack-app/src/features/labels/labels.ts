import *  as Icons from "./icons";

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

export const SYSTEM_VIDEO_LABELS: VideoLabel[] = [
  {
    id: "love",
    label: "Love",
    associatedPlaylistId: "love",
    lightColor: "var(--color-love-light)",
    darkColor: "var(--color-love)",
    icon: Icons.loveIcon, // TODO – Should prolly make this iconId.
    description: "Favorite (private to you)"
  },
  {
    id: "star",
    label: "Star",
    associatedPlaylistId: "star",
    lightColor: "var(--color-star-light)",
    darkColor: "var(--color-star)",
    icon: Icons.starIcon,
    description: "Favorite (visible to friends)"
  },
  {
    id: "x",
    label: "X",
    associatedPlaylistId: "x",
    lightColor: "var(--color-x-light)",
    darkColor: "var(--color-x)",
    icon: Icons.xIcon,
    description: "Do not recommend"
  },
];

export const findVideoLabelById = (id: VideoLabelId): VideoLabel | undefined => {
  return SYSTEM_VIDEO_LABELS.find((b) => b.id === id);
}