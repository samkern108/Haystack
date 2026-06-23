import type { VideoLabel } from "./components/video_components/videolabels";

export interface Video {
  title: string;
  thumbnail: string;
  videoId_yt: string;
  video_creatorId_yt: string;
}

export interface Creator {
  creatorId_yt: string;
  name: string;
  avatarURL: string;

  videos: Video[];
}

export interface Playlist {
  name: string;
  videos: Video[];
  icon: VideoLabel;
}

// SAM – Should this be a type?
export type defaultPlaylists = 'watch-later' | 'loved' | 'starred';