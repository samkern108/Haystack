import type { Video } from "../types";

interface VideoPageProps {
  video: Video;
  onBack: () => void;
}

export function VideoPage({
  video,
  onBack,
}: VideoPageProps) {
  return (
    <div>
      <button onClick={onBack}>
        BACK
      </button>

      <iframe
        width="100%"
        height="600"
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
        title={video.title}
        allowFullScreen
      />
    </div>
  );
}