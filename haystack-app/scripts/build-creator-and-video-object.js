// Steps to use:
// Run extract-channel-ids (which produces creatorData_Raw.json)
// Run parse-innertube-json (which produces videos_per_creator_ucid.json)
// Then, run this script

import { readFileSync, writeFileSync } from "node:fs";

const creatorData_File = "src/storage/creatorData_Raw.json";
const creatorsAndVideos_File = "src/storage/videos_per_creator_ucid.json";

const creatorData = JSON.parse(
  readFileSync(creatorData_File, "utf8")
);

const creatorAndVideosData = JSON.parse(
  readFileSync(creatorsAndVideos_File, "utf8")
);

// Final object
let output = {};

for (const creator of creatorData) {
  const ucid = creator.ucid;
  if (!ucid) {
    console.log(`Skipping creator ${creator.name} due to missing UCID.`);
    continue;
  }

  output[ucid] = creator;
  output[ucid].videos = creatorAndVideosData[ucid] || {};
}

writeFileSync(
  "src/storage/all_creators_object.json",
  JSON.stringify(output, null, 2)
);