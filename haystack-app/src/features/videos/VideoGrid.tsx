import { useState, useEffect, useContext } from "react";

import { VideoCard } from "../videos/VideoCard";
import type { State, Action } from "../../state/state";
import { getVideosByIds } from "../../utils/videohelpers";
import { InnertubeContext } from "../../contexts/InnertubeContext";
import '../videos/VideoCard.css'

interface VideoGridProps {
  state: State;
  videoIds: string[];
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoGrid( props : VideoGridProps) {
  const innertube = useContext(InnertubeContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("calling effect - " + props.videoIds.join(", "))
    if(videos.length === 0 && innertube.ready) {
      console.log("fetching videos")
      const fetchVideos = async () => {
        //const videoData = getVideosByChannelId(innertube, props.creator.creatorId_yt);

        console.log("fetch complete - " + props.videoIds.join(", "));

        //setVideos(videoData);
      }

      fetchVideos();
    }
  }, [videos, innertube]);

  return (
    <section className="video-grid">
      <div className="video-strip">
        {getVideosByIds(props.videoIds).map((video) => (
          <VideoCard
            key={video.videoId_yt}
            video={video}
            state={props.state}
            displayCreator={true}
            dispatch={props.dispatch}
          />
        ))}
      </div>
    </section>
  );
}
