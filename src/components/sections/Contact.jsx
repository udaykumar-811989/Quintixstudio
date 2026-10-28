import { useRef } from 'react';
import { useReveal, WordReveal } from '../ui/Reveal.jsx';
import { Icon } from '../ui/Icons.jsx';
import { contact, brand } from '../../data/contact.js';
import { InquiryForm } from './InquiryForm.jsx';

export function Contact() {
  const sectionRef = useRef(null);
  useReveal(sectionRef, { selector: '.contact__channels .channel', y: 30, stagger: 0.08 });
  useReveal(sectionRef, { selector: '.contact__intro > *', y: 34, stagger: 0.1 });

  return (
    <section className="section" id="contact" ref={sectionRef} aria-label="Contact the studio">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="eyebrow">Contact</p>
          <WordReveal as="h2" className="contact__title" text="Say hello to QUINTIX." />
          <p className="contact__lede">
            {brand.fullName} — tell us what you are building. We will come back with a clear,
            honest view of what social can do for it.
          </p>

          <address className="contact__channels">
            <a
              className="channel"
              href={contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <span className="channel__label">Instagram</span>
                <span className="channel__value">{contact.instagram.display}</span>
              </span>
              <span className="channel__arrow" aria-hidden="true">
                <Icon name="arrow" size={14} />
              </span>
            </a>

            <a className="channel" href={contact.email.url}>
              <span>
                <span className="channel__label">Email</span>
                <span className="channel__value">{contact.email.display}</span>
              </span>
              <span className="channel__arrow" aria-hidden="true">
                <Icon name="arrow" size={14} />
              </span>
            </a>

            {contact.whatsapp.map((chat) => (
              <a
                className="channel"
                key={chat.label}
                href={chat.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <span className="channel__label">{chat.label}</span>
                  <span className="channel__value">{chat.display}</span>
                </span>
                <span className="channel__arrow" aria-hidden="true">
                  <Icon name="arrow" size={14} />
                </span>
              </a>
            ))}
          </address>
        </div>

        <InquiryForm />
      </div>
    </section>
  );
}
