export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

export interface Creator {
  id: string;
  name: string;
  videos: Video[];
}