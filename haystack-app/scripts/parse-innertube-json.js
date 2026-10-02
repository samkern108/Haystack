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

  const filename = file.replace("-videos.json", "");
  // Creator object
  output[filename] = {};

  for (const item of data) {
    if (!item) continue;

    output[filename][item.content_id] = {
      video_id: item.content_id,
      thumbnail: item.content_image?.image?.[0]?.url,
      timecode: item.content_image?.overlays?.[0]?.badges?.[0]?.text
    };
  }
}

writeFileSync(
  "src/storage/test/creators_and_videos.json",
  JSON.stringify(output, null, 2)
);