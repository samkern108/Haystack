import { useParams } from "react-router-dom";
import './VideoPage.css'
import type { Action, State } from "../state/state";
import LabelSelector from "../features/labels/LabelSelector";
import { getCreatorById, getVideoById, getVideosByIds } from "../utils/videohelpers";
import { VideoCard } from "../features/videos/VideoCard";
interface VideoPageProps {
  state: State;
  dispatch: React.ActionDispatch<[Action]>;
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

        <div id="creator-row">
          <img
            className="creator-avatar"
            src={creator.avatarURL}
            alt={creator.name}
          />
          <h2>{creator.name}</h2>
        </div>
      </section>

      <section className="creator-videos">
        <h3>More from {creator.name}</h3>

        <div className="video-strip">
          {getVideosByIds(creator.videoIds).map((video) => (
            <VideoCard
              key={video.videoId_yt}
              video={video}
              state={props.state}
              displayCreator={false}
              dispatch={props.dispatch}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// TODO(sam): Don't add videos with an X to the recommended videos.