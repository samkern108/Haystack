
export interface Avatar {
  url: string;
  width: number;
  height: number;
}
export interface Creator {
  name: string;
  handle: string;
  ucid: string; //used to be creatorId_yt
  avatar: Avatar;

  // Do we need this in Creator? It was in MockCreator.
  // videoIds: string[];
}

export interface MockVideo {
  title: string;
  thumbnail: string;
  videoId_yt: string;
  creatorId_yt: string;
}