import './App.css'

import { creators } from "./mockData";
import { CreatorRow } from "./components/CreatorRow";

export default function App() {
  return (
    <main>
      {creators.map((creator) => (
        <CreatorRow
          key={creator.id}
          creator={creator}
        />
      ))}
    </main>
  );
}