import { useParams } from "react-router-dom";
import './VideoPage.css'
import { getTagsForVideo, getVideoState, type Action, type AppState } from "../state/state";
import LabelSelector from "../features/labels/LabelSelector";
import { getVideoById } from "../utils/videohelpers";
import { getCreatorById } from "../utils/creatorhelpers";
import { type Creator, type Video} from "../state/types";
import { VideoStrip } from "../features/videos/VideoStrip";
import { useEffect, useRef } from "react";
import { VideoTags } from "../features/videos/VideoTags";

interface VideoPageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[Action]>;
}

function renderOtherVideosFromCreator(creator: Creator, activeVideoId: string, props: VideoPageProps) {
  
  const allCreatorVideos = creator.videos;
  const returnVideos = [] as Video[];
 
  Object.values(allCreatorVideos).forEach((video) => {
    if (video.video_id !== activeVideoId) {
      const videoState = getVideoState(props.state, creator.ucid, video.video_id);
      if (videoState?.videoLabelId !== "x")
        returnVideos.push(video);
    }
  });

  if (returnVideos.length === 0) return (<></>);
  
  return (
    <section className="creator-videos">
      <h3>More from {creator.name}</h3>
      <VideoStrip 
        state={props.state} 
        videoIds={returnVideos.map((video) => [creator.ucid, video.video_id])} 
        dispatch={props.dispatch}
        displayCreator={false}> 
        
      </VideoStrip>
    </section>);
}

function loadYouTubeAPI(): Promise<typeof YT> {
  return new Promise((resolve) => {
    if (window.YT) {
      resolve(window.YT);
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);
  });
}

export function VideoPage(props: VideoPageProps) {

  const playerRef = useRef<YT.Player | null>(null);
  const watchIntervalRef = useRef<number | null>(null);

  const { creatorId, videoId } = useParams();

  if (!creatorId) return <p>Creator not found.</p>;
  if (!videoId) return <p>Video not found.</p>;

  const video = getVideoById(creatorId, videoId);

  if (!video) return <p>Video not found.</p>;

  const creator = getCreatorById(creatorId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const recordWatchProgress = () => {
    const player = playerRef.current;

    if (!player) return;

    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    if (!duration) return;

    const percentage = currentTime / duration;

    console.log("Watch percentage:", percentage);

    props.dispatch({
      type: "SET_WATCH_PERCENTAGE",
      creatorId: creatorId,
      videoId: videoId,
      value: percentage,
    });

  };

  const startWatchTracking = () => {
    if (watchIntervalRef.current !== null) return;

    watchIntervalRef.current = window.setInterval(() => {
      recordWatchProgress();
    }, 1000);
  };

  const stopWatchTracking = () => {
    if (watchIntervalRef.current !== null) {
      window.clearInterval(watchIntervalRef.current);
      watchIntervalRef.current = null;
    }
  };

    useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !iframeRef.current) return;

      playerRef.current = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            console.log("YouTube player ready!");
          },

          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              startWatchTracking();
            } else {
              stopWatchTracking();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const videoState = getVideoState(props.state, creator.ucid, video.video_id);
  if (!videoState) return null;

  return (
    <div id="video-page">
      <section id="video-player">
        <iframe
          ref={iframeRef}
          width="100%"
          height="600"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
          allowFullScreen
        />
      </section>

      <section id="video-header">
        <h1>{video.title}</h1>
        <div className="video-actions">
          <LabelSelector
            video={video}
            creator={creator}
            videoState={videoState}
            layout="horizontal"
            dispatch={props.dispatch}
          />
        </div>

        <a
          href={`https://www.youtube.com/@${creatorId}`}
          target="_blank"
          id="creator-row"
          rel="noopener noreferrer"
        >
            <img className="creator-avatar" src={creator.avatar.url} alt={creator.name} />   
            <h2>{creator.name}</h2>
        </a>
      </section>

      <VideoTags videoId={video.video_id} tags={getTagsForVideo(props.state, video.video_id)} dispatch={props.dispatch}/>

      { renderOtherVideosFromCreator(creator, video.video_id, props) }
    </div>
  );
}

// TODO(sam) Finish & test the video tags here.