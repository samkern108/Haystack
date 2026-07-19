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

    <section className="form-header">
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

    <section className="form-header">
      <h2>Which creators should you add?</h2>  
  
        <p className="lined-paper">Since Youtube content is varied and overlapping,
          we are conflicted on where to draw this line. Here's what we've landed on, as a general rule:
          <br></br>
          <strong>Add creators who are contributing new ideas, or packaging ideas in valuable ways.</strong>
          <br></br>
        </p>

      <h3>More specific criteria:</h3>
        <ul className="lined-paper">
            <li>Creator does not utilize generative AI</li>
            <li>Creator has no history of harassment of a marginalized group.</li>
            <li>Creator's content meets a minimum standard for audio, scriptwriting,
              and/or visual quality. If the content lacks in one area, it should excel in another.
            </li>
        </ul>
        
    </section>

    <section className="creator-submission">
      <h2>Submission Form</h2>

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

        <button type="submit">
          Submit Creator
        </button>
      </form>
    </section>

</div>
  );
};