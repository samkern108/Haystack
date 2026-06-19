import { useState } from "react";
import "./VideoCard.css";
import { videoLabelButtons } from "./videoLabelButtons";

export default function VideoLabelsPopup() {
  const [active, setActive] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setActive((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
   
    <div className="label-buttons-container">
      <div className="label-buttons-overlay">
        {videoLabelButtons.map((b) => {
          const isActive = !!active[b.id];
          const className = `label-button ${b.id} ${isActive ? "active" : ""}`;
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              title={b.label}
              className={className}
            >
              <span className="label-icon-wrapper">{b.icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}