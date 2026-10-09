import { type Creator, AllCreators } from "../state/types";

// TODO(Sam) Put this into a creator helper file
export const shuffleCreators = (array: Creator[]) => {
  const sortedArr = structuredClone(array);
  for (let i = sortedArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [sortedArr[i], sortedArr[j]] = [sortedArr[j], sortedArr[i]];
  }
  return sortedArr;
}

export function getCreatorById(creatorId: string): Creator {
  return AllCreators[creatorId];
}

export function getChannelURL(creatorId: string): string {
  return ("https://www.youtube.com/channel/" + creatorId);
}