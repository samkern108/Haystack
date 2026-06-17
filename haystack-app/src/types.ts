export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

export interface Creator {
  id: string;
  name: string;
  videos: Video[];
}