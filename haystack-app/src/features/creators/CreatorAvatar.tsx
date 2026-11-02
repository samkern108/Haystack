import '../creators/CreatorRow.css'

export function CreatorAvatar({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  return (
    <img
      src={url}
      alt={name}
      className="creator-avatar"
      loading="lazy"
      onLoad={() => {
        navigator.serviceWorker.controller?.postMessage({
          type: "AVATAR_LOADED",
          url,
        });
      }}
    />
  );
}