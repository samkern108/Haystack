import { useState, useEffect, useContext } from "react";

import type { Creator } from "../../state/types";
import { CreatorInfo } from "./CreatorInfo";
import type { State, Action } from "../../state/state";
import { InnertubeContext } from "../../contexts/InnertubeContext";
import { getVideosByChannelId } from "../../services/innertube.js";
import { VideoStrip } from "../videos/VideoStrip.js";
import './CreatorRow.css'
import '../videos/VideoCard.css'
import { getDurationInSecondsFromTimecode } from "../../utils/videohelpers.js";

interface CreatorRowProps {
  creator: Creator;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorRow( props : CreatorRowProps) {
  const innertube = useContext(InnertubeContext);
  const [videos, setVideos] = useState([]);
  const filters = props.state.videoFilters;

  useEffect(() => {
    console.log("calling effect - " + props.creator.ucid)
    if(videos.length === 0 && innertube.ready) {
      console.log("fetching videos")
      const fetchVideos = async () => {
        const videoData = getVideosByChannelId(innertube, props.creator.ucid);

		console.log("fetch complete - " + props.creator.ucid);

        setVideos(videoData);
      }

	  fetchVideos();
    }
  }, [videos, innertube]);

  let videoIds = [] as [creatorId: string, videoId: string][];

  // TODO(samkern): Is there a better way to do this
  // to avoid load calls taking SUCH a long time while dragging the
  // filter bar?
  Object.values(props.creator.videos).forEach((video) => {
    const duration = getDurationInSecondsFromTimecode(video.timecode);
    if (duration <= (filters.maxTime * 60) && duration >= (filters.minTime * 60)) {
      videoIds.push([props.creator.ucid, video.video_id]);
    }
  });

  if(videoIds.length === 0) {
    return <></>
  }

  return (
    <section className="creator-row">
      <CreatorInfo creator={props.creator} state={props.state} dispatch={props.dispatch} />

      <VideoStrip
        key={props.creator.ucid}
        state={props.state}
        videoIds={videoIds}
        dispatch={props.dispatch}
        displayCreator={false}
      />
    </section>
  );
}
