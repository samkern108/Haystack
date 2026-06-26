import type { VideoLabel } from "./components/video_components/videolabels";

export interface Video {
  title: string;
  thumbnail: string;
  videoId_yt: string;
  creatorId_yt: string;
}

export interface Creator {
  creatorId_yt: string;
  name: string;
  avatarURL: string;
  videoIds: string[];
}

export interface Playlist {
  name: string;
  videoIds: string[];
  icon: VideoLabel;
}

// SAM – Should this be a type?
export type defaultPlaylists = 'watch-later';