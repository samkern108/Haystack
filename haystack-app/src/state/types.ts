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
}

export interface VideoTag {
  name: string,
  color: string,
}

export type Creators = Record<string, Creator>;

// TODO(Sam)
// This should DEFINITELY not live in this file
export const AllCreators: Record<string, Creator> = creatorsData;
console.log("AllCreators loaded:", Object.keys(AllCreators).length, "creators");