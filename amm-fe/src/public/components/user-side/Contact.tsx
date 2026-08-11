function Contact() {
  return (
    <section id="contact" className="contact">
      <div>
        <span className="section-label">Get in touch</span>
        <h2>Contact Us</h2>

        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div className="contact-detail">
              <p>Email</p>
              <a href="mailto:goldenstay@gmail.com">goldenstay@gmail.com</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">☎️</div>
            <div className="contact-detail">
              <p>Phone</p>
              <a href="tel:+237000000">+237 000 000</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div className="contact-detail">
              <p>Headquarters</p>
              <a href="#">Yaoundé, Cameroon</a>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-cta">
        <h3>Ready to book your stay?</h3>
        <p>
          Fill out our quick booking form and our team will confirm your
          reservation within 24 hours.
        </p>
        <a href="#book" className="btn">Reserve a Room</a>
      </div>
    </section>
  );
}

export default Contact;
