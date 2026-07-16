import type { Creator, Video } from "./types";

export const MockData_AllVideos: Record<string, Video> = {
    "MeNYH8pTT0I": {
      title: "Final Fantasy 4 and Disability",
      thumbnail: "https://i.ytimg.com/vi/MeNYH8pTT0I/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBzaFkI_ZFj6XKaZWw9g-8GI8FX0w",
      videoId_yt: "MeNYH8pTT0I",
      creatorId_yt: "QuestingRefuge",
    },
    "APoEQ1cc0lU": {
      title: "The fake shot that saved WALL-E",
      thumbnail: "https://i.ytimg.com/vi/APoEQ1cc0lU/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBk869MyDDRVzFXRHTh-y-ArhMDsg",
      videoId_yt: "APoEQ1cc0lU",
      creatorId_yt: "Kikikrazed",
    },
    "tCi5k1XCj-E": {
      title: "This is the best scene in Notting Hill",
      thumbnail: "https://i.ytimg.com/vi/tCi5k1XCj-E/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDsettOJhr9Wtegwaom6iCKkkPPsg",
      videoId_yt: "tCi5k1XCj-E",
      creatorId_yt: "Kikikrazed",
    }
  }

export const MockData_AllCreators: Creator[] = [
  {
    creatorId_yt: "Kikikrazed",
    name: "Kikikrazed",
    avatarURL: "https://yt3.googleusercontent.com/sasx1iTZchZlzobI02xl-nOqO6jiEhdnTH6yA9bi0jm7-2WQYYvqlP4PFxNh7yi_ToYXARXM=s160-c-k-c0x00ffffff-no-rj",
    videoIds: ["APoEQ1cc0lU", "tCi5k1XCj-E"],
  },
  {
    creatorId_yt: "QuestingRefuge",
    name: "Questing Refuge",
    avatarURL: "https://yt3.googleusercontent.com/ytc/AIdro_nMxL8r9S3s3xPv8EDlgQnaqgYy9-WLSRVhYDe8hpi4xMY=s160-c-k-c0x00ffffff-no-rj",
    videoIds: ["MeNYH8pTT0I"],
  },
];