import type { Action, State } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { AllCreators } from "../state/types";
import { CreatorRow } from "../features/creators/CreatorRow";
import { useEffect, useRef, useState } from "react";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {

  // SCROLL LOGIC
  // This effect loads more creators when the user
  // scrolls near the bottom of the page.
  const loadThreshold = 0.9;
  const [loadAmount, setLoadAmount] = useState(10);
  const lastLoadHeight = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;

      const nearBottom =
        scrollPosition >= scrollHeight * loadThreshold;

      const alreadyLoadedForThisHeight =
        scrollHeight === lastLoadHeight.current;

      if (nearBottom && !alreadyLoadedForThisHeight) {
        lastLoadHeight.current = scrollHeight;

        setLoadAmount((prev) =>
          Math.min(prev + 10, Object.values(AllCreators).length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // END SCROLL LOGIC

  return (
    <div style={{marginTop: 24}}>
      <TestButton />

      <section className="video-grid">
        {Object.values(AllCreators).slice(0, loadAmount).map((creator) => {
          return (
            <CreatorRow
              key={creator.ucid}
              state={props.state}
              dispatch={props.dispatch} 
              creator={creator}
            />
          );
        })}
      </section>
    </div>
  );
}