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