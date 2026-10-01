export interface Creator {
  name: string;
  handle: string;
  ucid: string;
}

export interface MockVideo {
  title: string;
  thumbnail: string;
  videoId_yt: string;
  creatorId_yt: string;
}

export interface MockCreator {
  creatorId_yt: string;
  name: string;
  avatarURL: string;
  videoIds: string[];
}
