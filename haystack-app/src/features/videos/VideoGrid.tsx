import { VideoCard } from "./VideoCard";
import { type AppState, type Action, getVideoState } from "../../state/state";
import { getCreatorById } from "../../utils/creatorhelpers";
import '../videos/VideoCard.css'
import '../videos/VideoGrid.css'

// TODO(sam): Seems overkill to pass global state here
interface VideoGridProps {
  state: AppState;
  videoIds: [creatorId: string, videoId: string][];
  dispatch: React.ActionDispatch<[action: Action]>;
  displayCreator: boolean;

  maxColumns: number;
  maxRows: number;
}

export function VideoGrid( props : VideoGridProps) {
    return (
        <div className="video-grid"
            style={{
                gridTemplateColumns: `repeat(${props.maxColumns}, minmax(0, 1fr))`,
            }}
        >
        {props.videoIds
            .slice(0, props.maxColumns * props.maxRows)
            .map(([creatorId, videoId]) => {
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

                const videoState = getVideoState(props.state, creatorId, videoId);
                if (!videoState) {
                    console.error(`Video state not found for ID: ${videoId} in creator ${creatorId}`);
                    return null;
                }

                return <VideoCard
                    key={video.video_id}
                    creator={creator}
                    video={video}
                    videoState={videoState}
                    displayCreator={props.displayCreator}
                    dispatch={props.dispatch}
                />
            })}
    </div>
);}
