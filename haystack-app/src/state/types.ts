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