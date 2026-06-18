export interface Video {
  title: string;
  thumbnail: string;
  youtubeId: string;
}

export interface Creator {
  youtubeId: string;
  name: string;
  avatarURL: string;

  videos: Video[];
}