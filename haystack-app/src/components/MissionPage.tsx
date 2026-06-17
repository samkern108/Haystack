interface MissionPageProps {
  onBack: () => void;
}

export function MissionPage({
  onBack,
}: MissionPageProps) {
  return (
    <div>
      <button onClick={onBack}>
        BACK
      </button>
        <h1>Why does this exist?</h1>   
        <p>AI art bad.</p>
        <h1>Who is building this?</h1>   
        <p>Sam & Scott lol</p>
        </div>
    );
};