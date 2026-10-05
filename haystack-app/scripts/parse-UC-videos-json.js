// This script reads all the canned responses from the src/storage/cannedResponses directory, 
// parses them, and outputs a single JSON file: 
// a structure mapping each creator to relevant data for their videos.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const inputDir = "src/storage/cannedResponses/";

const files = readdirSync(inputDir).filter(file => file.endsWith(".json"));

const output = {};

for (const file of files) {
  const filePath = `${inputDir}${file}`;

  const data = JSON.parse(
    readFileSync(filePath, "utf8")
  );

  if (!Array.isArray(data)) {
    console.log("🚨 NOT AN ARRAY:", file);
    continue;
  }

  // TODO(sam)
  // the way we're retrieving thumbnails right now is a bit hacky.
  // especially if youtube changes the options available, we should reinvestigate this.

  const filename = file.replace("-videos.json", "");
  // Creator object
  output[filename] = {};

  for (const item of data) {
    if (!item) continue;

    const thumbnailFromMetadata = item.content_image?.image?.[0]?.url + ``;
    const thumbnailUrl = `https://i.ytimg.com/vi/${item.content_id}`.concat(thumbnailFromMetadata.includes("hq720") ? `/hq720.jpg` : `/mqdefault.jpg`);

    output[filename][item.content_id] = {
      video_id: item.content_id,
      title: item.metadata?.title?.text,
      thumbnail_url: thumbnailUrl,
      timecode: item.content_image?.overlays?.[0]?.badges?.[0]?.text
    };
  }
}

writeFileSync(
  "src/storage/videos_per_creator_ucid.json",
  JSON.stringify(output, null, 2)
);