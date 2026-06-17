import { useParams } from "react-router-dom";

export function VideoPage() {
  const { id } = useParams();

  return (
    <div id="video-page">
      <iframe
        width="100%"
        height="600"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        allowFullScreen
      />
    </div>
  );
}