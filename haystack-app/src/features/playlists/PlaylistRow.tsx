import { VideoCard } from "../videos/VideoCard";
import { type AppState, type Action, type PlaylistState, getTagsForVideo } from "../../state/state";
import { getCreatorById } from "../../utils/creatorhelpers";
import { SYSTEM_VIDEO_LABELS } from "../labels/labels";
import './PlaylistRow.css'

interface PlaylistRowProps {
  playlist: PlaylistState;
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow( props : PlaylistRowProps) {

  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === props.playlist.videoLabelId);

  return (
    <section className="playlist-row">
      <div className="playlist-info">
        <div className={`playlist-label-button`}
          style={{ color: videoLabel?.color }}>
          { videoLabel?.label }
        </div>
        <h2>{ props.playlist.name }</h2>
      </div>
      
      <div className="video-strip scrollable">
        {props.playlist.videoIds.map(([creatorId, videoId]) => {
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
          const videoState = props.state.creatorStates?.[creator.ucid] ?.videoStates?.[video.video_id];
          
          return (
            <VideoCard
              key={video.video_id}
              creator={creator}
              video={video}
              videoState={videoState}
              videoFilterState={props.state.videoFilterStates}
              videoTags={getTagsForVideo(props.state, video.video_id)}
              displayCreator={true}
              dispatch={props.dispatch}
            />
          );
        })}
      </div>
    </section>
  );
}