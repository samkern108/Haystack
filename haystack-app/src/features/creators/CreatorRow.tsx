import { useState, useEffect, useContext } from "react";

import type { Creator } from "../../state/types";
import { CreatorInfo } from "./CreatorInfo";
import { type AppState, type Action, getCreatorState } from "../../state/state";
import { InnertubeContext } from "../../contexts/InnertubeContext";
import { getVideosByChannelId } from "../../services/innertube.js";
import { VideoStrip } from "../videos/VideoStrip.js";
import './CreatorRow.css'
import '../videos/VideoCard.css'
import { filterVideosForCreator } from "../../utils/videohelpers.js";

interface CreatorRowProps {
  creator: Creator;
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorRow( props : CreatorRowProps) {
  const filters = props.state.videoFilterStates;

  /*const innertube = useContext(InnertubeContext);
  const [videos, setVideos] = useState([]);
  

  useEffect(() => {
    // console.log("calling effect - " + props.creator.ucid)
    if(videos.length === 0 && innertube.ready) {
      console.log("fetching videos")
      const fetchVideos = async () => {
        const videoData = getVideosByChannelId(innertube, props.creator.ucid);

		 // console.log("fetch complete - " + props.creator.ucid);

        setVideos(videoData);
      }

	  fetchVideos();
    }
  }, [videos, innertube]);*/

  // TODO(samkern): Is there a better way to do this to avoid 
  // load calls taking a long time while dragging the filter bar?
  const creatorState = getCreatorState(props.state, props.creator.ucid);
  const videoIds = filterVideosForCreator(props.creator.ucid, creatorState, filters, props.creator.videos, props.state.videoTagState);

  // If all the videos have been filtered out... don't show the creator row lol
  if(videoIds.length === 0) return <></>

  return (
    <section className="creator-row">
      <CreatorInfo creator={props.creator} creatorState={creatorState} dispatch={props.dispatch} />

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
