import { useState, useEffect, useContext } from "react";

import { VideoCard } from "../videos/VideoCard";
import type { State, Action } from "../../state/state";
import { getCreatorById } from "../../utils/videohelpers";
import { InnertubeContext } from "../../contexts/InnertubeContext";
import '../videos/VideoCard.css'

interface VideoGridProps {
  state: State;
  videoIds: [creatorId: string, videoId: string][];
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
        {props.videoIds.map(([creatorId, videoId]) => {
          const creator = getCreatorById(creatorId);
          if (!creator) {
            console.error(`Creator not found for ID: ${creatorId}`);
            return null;
          }
          const video = creator.videos[videoId];
          if (!video) {
            console.error(`Video not found for ID: ${videoId} in creator ${creatorId}`);
            return null;
          }
          return (
            <VideoCard
              key={video.video_id}
              creator={creator}
              video={video}
              state={props.state}
              displayCreator={true}
              dispatch={props.dispatch}
            />
          );
        })}
      </div>
    </section>
  );
}
