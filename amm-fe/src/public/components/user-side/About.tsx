function About() {
  return (
    <>
      <section id="about" className="about">
        <div className="about-text">
          <span className="section-label">Our Story</span>
          <h2>About GoldenStay</h2>
          <p>
            GoldenStay Hotel offers world-class hospitality, elegance, and
            comfort to give you the perfect stay experience across three
            African countries. It is a home away from home — built for
            travelers who expect more.
          </p>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Rooms</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10k+</div>
            <div className="stat-label">Guests Hosted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      <section id="location" className="location">
        <span className="section-label">Where to find us</span>
        <h2>Our Locations</h2>

        <div className="location-grid">
          <div className="location-item">Cameroon</div>
          <div className="location-item">Namibia</div>
          <div className="location-item">South Africa</div>
        </div>
      </section>
    </>
  );
}

export default About;
