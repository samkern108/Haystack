export type SystemVideoLabelId = "love" | "star" | "x";
export type VideoLabelId = SystemVideoLabelId; // TODO - This should be SystemVideoLabel | UserVideoLabel, but we don't have user video labels yet.
export type VideoLabelIdOrNone = VideoLabelId | null | undefined;

export interface VideoLabel {
  id: VideoLabelId;
  label: string;
  color: string;
  associatedPlaylistId?: string;
  description: string;
}

export const SYSTEM_VIDEO_LABELS: VideoLabel[] = [
  {
    id: "love",
    label: "Love",
    associatedPlaylistId: "love",
    color: "var(--color-love)",
    description: "Favorite (private to you)"
  },
  {
    id: "star",
    label: "Star",
    associatedPlaylistId: "star",
    color: "var(--color-star)",
    description: "Favorite (visible to friends)"
  },
  {
    id: "x",
    label: "X",
    associatedPlaylistId: "x",
    color: "var(--color-x)",
    description: "Do not recommend"
  },
];

export const findVideoLabelById = (id: VideoLabelId): VideoLabel | undefined => {
  return SYSTEM_VIDEO_LABELS.find((b) => b.id === id);
}