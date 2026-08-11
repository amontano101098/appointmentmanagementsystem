function Hero() {
  return (
    <section id="home" className="hero">
      <span className="hero-tag">Luxury Hotel &amp; Suites</span>

      <h2>
        Experience <em>Luxury</em><br />
        &amp; Comfort
      </h2>

      <p>
        World-class hospitality across three African countries.
        Your perfect stay starts here.
      </p>

      <div className="hero-actions">
        <a href="#book" className="btn">Book a Room</a>
        <a href="#rooms" className="btn-ghost">Explore Rooms →</a>
      </div>
    </section>
  );
}

export default Hero;
