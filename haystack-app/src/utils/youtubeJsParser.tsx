import { Parser } from "youtubei.js";

const rawText = await fetch("/canned-data/channel-response.json")
  .then(res => res.text());

const rawData = JSON.parse(rawText);

const parsed = Parser.parseResponse(rawData);

console.log(parsed);