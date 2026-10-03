import creatorsData from "../storage/all_creators_object.json";

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
  videos: Record<string, Video>;
}

export interface Video {
  video_id: string;
  title: string;
  thumbnail_url: string;
  timecode: string;
  // creatorId_yt: string;
  // Do we need this? ^
}

export type Creators = Record<string, Creator>;

export const AllCreators: Record<string, Creator> = creatorsData;
console.log("AllCreators loaded:", Object.keys(AllCreators).length, "creators");