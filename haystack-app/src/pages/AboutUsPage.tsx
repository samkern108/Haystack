import "./AboutUsPage.css";
import "../features/ui/styles/LinedPaper.scss";


export function AboutUsPage() {
  return (
  <div className="about-page">

    <section className="about-header">
      <h1>What is Haystack?</h1>  

          <p className="lined-paper">
          <strong>Our goal is simple:</strong> to connect viewers with creators making thoughtful, original work.
          <br></br>
          As fans of online auteur video, we are frustrated by platforms that prioritize engagement over quality, 
          creating incentives for overwork, clickbait, and sensationalism.
          <br></br>
          <strong>We hope to help good, honest work rise above the slop.</strong>
          </p>
    </section>

    <section className="about-header">
      <h1>We believe that</h1>  
        
          <ul className="lined-paper">
            <li>Art should be human</li>
            <li>Our time should be respected</li>
            <li>Sensationalism is cheap</li>
          </ul>
        
    </section>

 <h1>How we curate</h1>
  <div className="qa-container">
    <div className="qa-box">
      <article>
        <h2>How creators are added</h2>   
        <p>Community curators submit creators for consideration.
          It is the role of our curators to check one another's work
          and ensure creators meet our standards.
        </p>
        
        <h2>How curators are selected</h2>   
        <p>Curators are often creators themselves, or viewers who have dedicated
          significant time to understanding the landscape of online video.
        </p>
      </article>
    </div>

    <div className="qa-box">
      <article>
        <h2>What we're looking for</h2>
        <p>We prioritize creators who:</p>
        <ul className="lined-paper small">
          <li>Demonstrate a commitment to quality and originality</li>
          <li>Have a clear and authentic voice</li>
        </ul>
      </article>
    </div>

    <div className="qa-box">
      <article>
        <h2>Disqualifying Criteria</h2>
        <p>A creator may be excluded or removed if they:</p>
        <ul className="lined-paper small">
          <li>Utilize AI-generated visuals, audio, or text</li>
          <li>Plagiarize or duplicate content</li>
          <li>Spread dis/misinformation</li>
          <li>Harass or threaten individuals or communities</li>
          <li>Promote hateful or dehumanizing views toward people or groups</li>
          <li>Have a pattern of misconduct that conflicts with the values of this community</li>
          <li>Manipulate, deceive, or exploit their audience</li>
        </ul>

        <p>Decisions are made based on patterns of behavior, context, and accountability – not isolated moments.</p>
      </article>
    </div>  
  </div>
</div>
  );
};