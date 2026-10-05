import { Reveal } from "../components/UI";
import { media } from "../data/site";
import Sponsors from "../components/Sponsors";
export default function Contact() {
  return (
    <>
      <section className="contact-section">
        <Reveal className="contact-photo">
          <img
            src={media("FUDKSoEZ9PsNVvjDQcuUnBiO2uY.jpg")}
            alt="Phil cycling in the mountains"
          />
        </Reveal>
        <div className="contact-copy">
          <Reveal>
            <h1>Contact Phil — we'd love to hear from you!</h1>
          </Reveal>
          <Reveal>
            <p>
              Would you like to sponsor Phil or maybe you can help spread the
              message? If you think you can help in any way, we'd love to hear
              from you. Email Phil at{" "}
              <a href="mailto:info@justphilride.co.uk">
                info@justphilride.co.uk
              </a>{" "}
              or simply fill in the form below and we’ll get right back to you.
            </p>
          </Reveal>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              required
              autoComplete="email"
            />
            <label className="sr-only" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              required
              rows={5}
            />
            <button
              type="submit"
              className="contact-submit"
              disabled
              title="Form submission is not enabled"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
      <Sponsors contact />
    </>
  );
}
