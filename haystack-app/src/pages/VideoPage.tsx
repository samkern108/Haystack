import { useParams } from "react-router-dom";
import './VideoPage.css'
import type { Action, State } from "../state/state";
import LabelSelector from "../features/labels/LabelSelector";
import { getCreatorById, getVideoById } from "../utils/videohelpers";
import { VideoCard } from "../features/videos/VideoCard";
import { type Creator, type Video} from "../state/types";

interface VideoPageProps {
  state: State;
  dispatch: React.ActionDispatch<[Action]>;
}

function renderOtherVideosFromCreator(creator: Creator, activeVideoId: string, props: VideoPageProps) {
  
  const allCreatorVideos = creator.videos;
  const returnVideos = [] as Video[];
 
  Object.values(allCreatorVideos).forEach((video) => {
    if (video.video_id !== activeVideoId) {
      const videoState = props.state.creators?.[creator.ucid]?.videos?.[video.video_id];
      if (videoState?.videoLabelId !== "x")
        returnVideos.push(video);
    }
  });

  if (returnVideos.length === 0) {
    return (<></>);
  }
  
  return (
    <section className="creator-videos">
      <h3>More from {creator.name}</h3>
      <div className="video-strip">
        {returnVideos.map((video) => (
          <VideoCard
            key={video.video_id}
            video={video}
            state={props.state}
            displayCreator={false}
            dispatch={props.dispatch}
          />
        ))}
      </div>
    </section>);
}

export function VideoPage(props: VideoPageProps) {

const { creatorId, videoId } = useParams();

  if (!creatorId) return <p>Creator not found.</p>;
  if (!videoId) return <p>Video not found.</p>;

  const video = getVideoById(creatorId, videoId);

  if (!video) return <p>Video not found.</p>;

  const creator = getCreatorById(creatorId);

  return (
    <div id="video-page">
      <section id="video-player">
        <iframe
          width="100%"
          height="600"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          allowFullScreen
        />  
      </section>

      <section id="video-header">
        <h1>{video.title}</h1>
        <div className="video-actions">
          <LabelSelector
            video={video}
            state={props.state}
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

      { renderOtherVideosFromCreator(creator, video.video_id, props) }
    </div>
  );
}

// TODO(sam): Don't add videos with an X to the recommended videos.
