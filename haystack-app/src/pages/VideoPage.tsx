import { useParams } from "react-router-dom";
import './VideoPage.css'
import type { Action, State } from "../state/state";
import LabelSelector from "../features/labels/LabelSelector";
import { getCreatorById, getVideoById, getVideosByIds } from "../utils/videohelpers";
import { VideoCard } from "../features/videos/VideoCard";
import type { Creator, Video} from "../state/types";
interface VideoPageProps {
  state: State;
  dispatch: React.ActionDispatch<[Action]>;
}

function renderOtherVideosFromCreator(creator: Creator, activeVideoId: string, props: VideoPageProps) {
  
  const allCreatorVideos = getVideosByIds(creator.videoIds);
  const returnVideos = [] as Video[];
 
  allCreatorVideos.forEach((video) => {
    if (video.videoId_yt !== activeVideoId) {
      const videoState = props.state.creators?.[creator.creatorId_yt]?.videos?.[video.videoId_yt];
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
            key={video.videoId_yt}
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

  const { id } = useParams();

  if (!id) return <p>Video not found.</p>;

  const video = getVideoById(id);

  if (!video) return <p>Video not found.</p>;

  const creator = getCreatorById(video.creatorId_yt);

  return (
    <div id="video-page">
      <section id="video-player">
        <iframe
          width="100%"
          height="600"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
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
          href={`https://www.youtube.com/@${video.creatorId_yt}`}
          target="_blank"
          id="creator-row"
          rel="noopener noreferrer"
        >
            <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />   
            <h2>{creator.name}</h2>
        </a>
      </section>

      { renderOtherVideosFromCreator(creator, video.videoId_yt, props) }
    </div>
  );
}

// TODO(sam): Don't add videos with an X to the recommended videos.