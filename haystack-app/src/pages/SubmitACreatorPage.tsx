import "./styles/FormPage.css";
import "../features/ui/styles/LinedPaper.scss";
import { useState } from "react";


export function SubmitACreatorPage() {

  const [youtubeHandle, setYoutubeHandle] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Submitted creator:", youtubeHandle);

    // TODO: Send this to backend later
    setYoutubeHandle("");
  }

  return (
  <div className="form-page">

    <section className="form-section">
      <h1>Submit A Creator</h1>  
      
        <p className="lined-paper">
          <strong>Add your favorite Youtube creators to Haystack!</strong>
          <br></br>
          During <strong>Phase One</strong>, we've given this website to friends and colleagues whose taste
          and judgment we trust. Help us make connections between great creators and passionate viewers!
          <br></br>
          <strong>Please review our guidelines first!</strong>
        </p>
    </section>

    <section className="form-section">
      <h2>Which creators should you add?</h2>  
  
      <div className="lined-paper">
        <p>Since Youtube content is varied and overlapping,
          we are conflicted on where to draw this line. Here's what we've landed on, as a general rule:
          <br></br>
          <strong>Add creators who are contributing new ideas, or packaging ideas in valuable ways.</strong>
          <br></br>
        </p>
      </div>
        
    </section>

    <section className="form-section">
      <h2>Submission Form</h2>

      <div>
        <form onSubmit={handleSubmit}>

          <label htmlFor="youtube-handle">
            YouTube Handle
          </label>

          <input
            id="youtube-handle"
            name="youtube-handle"
            type="text"
            placeholder="@creatorname"
            value={youtubeHandle}
            onChange={(e) => setYoutubeHandle(e.target.value)}
            required
          />

          <fieldset>
            <legend>How would you describe this creator's content?</legend>

            <label>
              <input type="radio" name="strengths" value="original-ideas" />
              Presents original ideas.
            </label>

            <label>
              <input type="radio" name="strengths" value="original-presentation" />
              Presents existing ideas in original ways.
            </label>

            <label>
              <input type="radio" name="strengths" value="polished" />
              Presents existing ideas in a polished, engaging format.
            </label>
          </fieldset>

          <fieldset>
            <legend>Why do you value this creator's content?</legend>

            <label>
              <input type="radio" name="strengths" value="original-ideas" />
              They have high-end audio, visuals, performance, and writing.
            </label>

            <label>
              <input type="radio" name="strengths" value="original-presentation" />
              Audio, visuals, performance, or writing is lacking, but one aspect is of such
              outstanding quality as to outweighs any deficits.
            </label>
          </fieldset>

          <fieldset>
            <legend>To the best of your knowledge…</legend>

            <label>
              <input type="checkbox" name="criteria" value="no-ai" />
              Creator does not use generative AI to produce their scripts, narration,
              music, or visuals.
            </label>

            <label>
              <input type="checkbox" name="criteria" value="not-bandwagoning" />
              Creator's content is not primarily driven by bandwagons,
              controversy-chasing, or sensationalism.
            </label>

            <label>
              <input type="checkbox" name="criteria" value="no-grifting" />
              Creator does not engage in grifting or misleading their audience.
            </label>

            <label>
              <input type="checkbox" name="criteria" value="no-harassment" />
              Creator has no pattern of inciting harassment against marginalized groups.
            </label>
          </fieldset>

          <label htmlFor="why">
            What do you like about this creator?
          </label>

          <textarea
            id="why"
            name="why"
            rows={5}
            placeholder="Tell us why you enjoy their work and why you think they belong on Haystack."
          />

          <label htmlFor="genres">
            What genre(s) would you place this creator in?
          </label>

          <input
            id="genres"
            name="genres"
            type="text"
            placeholder="e.g. History, Video Essays, Philosophy, Science"
          />

          <label htmlFor="keywords">
            Describe this creator in a few words.
          </label>

          <input
            id="keywords"
            name="keywords"
            type="text"
            placeholder="e.g. thoughtful, funny, deeply researched, cozy, optimistic"
          />

          <button type="submit">
            Submit Creator
          </button>

        </form>
      </div>
    </section>

</div>
  );
};