"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hideVideo = () => {
      video.style.display = "none";
    };

    video.addEventListener("error", hideVideo);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(hideVideo);
    }

    return () => {
      video.removeEventListener("error", hideVideo);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      "This form is a working draft. Once connected to Supabase, this will save the enquiry and notify you by email/WhatsApp."
    );
  };

  return (
    <>
      <header id="siteHeader" className={scrolled ? "scrolled" : ""}>
        <div className="wrap">
          <nav>
            <a href="#" className="logo">
              Nile<span> Oasis</span>
            </a>
            <div className="nav-links">
              <a href="#residence">The apartment</a>
              <a href="#services">Services</a>
              <a href="#stays">Stay lengths</a>
              <a href="#enquire">Enquire</a>
            </div>
            <a href="#enquire" className="nav-cta">
              Check availability
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="https://assets.mixkit.co/videos/45393/45393-thumb-720-0.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/45393/45393-720.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-content">
          <div className="wrap">
            <div className="hero-eyebrow">
              <span className="rule"></span>
              <span className="eyebrow">Cairo, Egypt</span>
            </div>
            <h1>
              The space of an apartment. <em>The standard of a hotel.</em>
            </h1>
            <p className="hero-sub">
              Fully serviced Nile-side apartments in Cairo — the privacy and
              room to breathe a hotel can&apos;t offer, with the service of one.
            </p>
            <div className="hero-actions">
              <a href="#enquire" className="btn btn-primary">
                Check availability
              </a>
              <a href="#residence" className="btn btn-ghost">
                View the apartment
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="waterline">
        <svg
          viewBox="0 0 1600 64"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 32 C 80 10, 160 54, 240 32 S 400 10, 480 32 S 640 54, 720 32 S 880 10, 960 32 S 1120 54, 1200 32 S 1360 10, 1440 32 S 1600 54, 1680 32 L 1680 64 L 0 64 Z"
            fill="rgba(169,130,76,0.10)"
          />
          <path
            d="M0 38 C 80 20, 160 56, 240 38 S 400 20, 480 38 S 640 56, 720 38 S 880 20, 960 38 S 1120 56, 1200 38 S 1360 20, 1440 38 S 1600 56, 1680 38 L 1680 64 L 0 64 Z"
            fill="rgba(169,130,76,0.06)"
          />
        </svg>
      </div>

      <section className="why-direct">
        <div className="wrap">
          <div className="section-head">
            <h2>Hotel comforts, apartment privacy</h2>
            <p>
              Everything a five-star stay provides, without sharing a lobby,
              a lift, or a wall with strangers.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <span className="num">01</span>
              <h3>Space to actually live in</h3>
              <p>
                A full apartment, not a room — separate living and sleeping
                areas, a real kitchen, and room for family to spread out.
              </p>
            </div>
            <div className="why-card">
              <span className="num">02</span>
              <h3>Service on call</h3>
              <p>
                A dedicated line to a person who knows your stay — not a
                front desk queue or a support ticket.
              </p>
            </div>
            <div className="why-card">
              <span className="num">03</span>
              <h3>Arranged for how long you&apos;re staying</h3>
              <p>
                Rates and service built around the length of your stay, from
                a long weekend to a long-term assignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="residence">
        <div className="wrap">
          <div className="residence">
            <div className="residence-media">
              <div className="placeholder-tag">
                <div className="icon">&#9633;</div>
                <span>Apartment gallery — image placeholder</span>
              </div>
            </div>
            <div className="residence-body">
              <span className="eyebrow">
                Apartment 01 — Now accepting enquiries
              </span>
              <h2>The Corniche Suite</h2>
              <p>
                Two bedrooms, two bathrooms, and a river-facing terrace —
                finished to a standard guests notice immediately. Considered
                furnishings, proper linens, and a kitchen fit for more than
                coffee.
              </p>
              <ul className="amenity-list">
                <li>2 bedrooms, 2 bathrooms</li>
                <li>River-facing balcony</li>
                <li>Full kitchen</li>
                <li>High-speed Wi-Fi + backup</li>
                <li>Smart lock entry</li>
                <li>Daily housekeeping available</li>
                <li>Dedicated WhatsApp concierge</li>
                <li>Airport transfer on request</li>
              </ul>
              <div className="price-row">
                <span className="amount">—</span>
                <span className="unit">per night</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="wrap">
          <div className="section-head">
            <h2>Looked after, not just rented</h2>
            <p>
              The services that separate a fully managed stay from a
              listing.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <span className="mark">I</span>
              <div>
                <h3>Airport transfer</h3>
                <p>
                  Arranged ahead of arrival, on request at the time of
                  booking.
                </p>
              </div>
            </div>
            <div className="service-card">
              <span className="mark">II</span>
              <div>
                <h3>Concierge support</h3>
                <p>
                  A direct line for anything from restaurant bookings to
                  in-stay issues.
                </p>
              </div>
            </div>
            <div className="service-card">
              <span className="mark">III</span>
              <div>
                <h3>Family-ready</h3>
                <p>
                  Cribs, extra linens and child-safety fittings available on
                  request.
                </p>
              </div>
            </div>
            <div className="service-card">
              <span className="mark">IV</span>
              <div>
                <h3>Local experiences</h3>
                <p>
                  Trusted recommendations and arrangements, not a generic
                  tour list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stays">
        <div className="wrap">
          <div className="section-head">
            <h2>Rates that reward longer stays</h2>
            <p>Built for relocations and assignments, not just weekend trips.</p>
          </div>
          <div className="stay-lengths">
            <div className="stay-card">
              <div className="len">1–6</div>
              <div className="label">Nights</div>
              <div className="discount">Standard rate</div>
            </div>
            <div className="stay-card">
              <div className="len">7+</div>
              <div className="label">Nights</div>
              <div className="discount">Weekly rate applied</div>
            </div>
            <div className="stay-card">
              <div className="len">14+</div>
              <div className="label">Nights</div>
              <div className="discount">Extended-stay rate applied</div>
            </div>
            <div className="stay-card">
              <div className="len">28+</div>
              <div className="label">Nights</div>
              <div className="discount">Monthly rate applied</div>
            </div>
          </div>
        </div>
      </section>

      <section id="enquire">
        <div className="wrap">
          <div className="enquiry">
            <div className="enquiry-intro">
              <span className="eyebrow">Request to book</span>
              <h2>Tell us your dates</h2>
              <p>
                Send your dates and we&apos;ll confirm availability and rate
                directly — usually within a few hours, by WhatsApp or email.
              </p>
              <div className="enquiry-channels">
                <div className="enquiry-channel">
                  <span className="dot"></span> WhatsApp — number to be added
                </div>
                <div className="enquiry-channel">
                  <span className="dot"></span> Email — address to be added
                </div>
                <div className="enquiry-channel">
                  <span className="dot"></span> Direct call — number to be
                  added
                </div>
              </div>
            </div>
            <form id="enquiryForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div>
                  <label htmlFor="name">Full name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact">WhatsApp or email</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    placeholder="+20 / name@email.com"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label htmlFor="checkin">Check-in</label>
                  <input type="date" id="checkin" name="checkin" required />
                </div>
                <div>
                  <label htmlFor="checkout">Check-out</label>
                  <input type="date" id="checkout" name="checkout" required />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label htmlFor="guests">Guests</label>
                  <select id="guests" name="guests" defaultValue="1">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="services_select">Services needed</label>
                  <select id="services_select" name="services" defaultValue="None">
                    <option>None</option>
                    <option>Airport transfer</option>
                    <option>Daily housekeeping</option>
                    <option>Family setup (crib etc.)</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message">Anything we should know</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Optional"
                ></textarea>
              </div>
              <button type="submit" className="form-submit">
                Send enquiry
              </button>
              <p className="form-note">
                We&apos;ll reply with availability and the direct rate — no
                payment is taken at this step.
              </p>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="logo">
                Nile<span> Oasis</span>
              </a>
              <p>
                Fully serviced apartments on the Nile, in Cairo. Expanding
                across Egypt.
              </p>
            </div>
            <div className="footer-col">
              <h4>Stay</h4>
              <a href="#residence">The apartment</a>
              <a href="#stays">Rates &amp; stay lengths</a>
              <a href="#enquire">Request to book</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <div className="footer-placeholder">
                WhatsApp — to be added
              </div>
              <div className="footer-placeholder">Email — to be added</div>
              <div className="footer-placeholder">
                Instagram — to be added
              </div>
            </div>
            <div className="footer-col">
              <h4>Also on</h4>
              <div className="footer-placeholder">
                Airbnb listing — link pending
              </div>
              <div className="footer-placeholder">
                Booking.com — link pending
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 Nile Oasis. All rights reserved.</span>
            <span>Cairo, Egypt</span>
          </div>
          <div className="footer-bottom" style={{ borderTop: "none", paddingTop: 0 }}>
            <span style={{ opacity: 0.6 }}>
              Hero video: free placeholder stock footage from Mixkit
              (sailboats on the Nile, Egypt) — replace with your own
              property video before launch.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
