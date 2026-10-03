import { useState, useEffect, useContext } from "react";

import type { Creator } from "../../state/types";
import { VideoCard } from "../videos/VideoCard";
import { CreatorInfo } from "./CreatorInfo";
import type { State, Action } from "../../state/state";
import { InnertubeContext } from "../../contexts/InnertubeContext";
import { getVideosByChannelId } from "../../services/innertube.js";
import './CreatorRow.css'
import '../videos/VideoCard.css'

interface CreatorRowProps {
  creator: Creator;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorRow( props : CreatorRowProps) {
  const innertube = useContext(InnertubeContext);
  const [videos, setVideos] = useState([]);

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

  return (
    <section className="creator-row">
      <CreatorInfo creator={props.creator} state={props.state} dispatch={props.dispatch} />

      <div className="video-strip">
        {Object.values(props.creator.videos).map((video) => (
          <VideoCard
            key={video.video_id}
            video={video}
            state={props.state}
            displayCreator={false}
            dispatch={props.dispatch}
          />
        ))}
      </div>
    </section>
  );
}
