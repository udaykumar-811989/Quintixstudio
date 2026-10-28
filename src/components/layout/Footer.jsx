import { scrollToId } from '../../lib/scrollStore.js';
import { brand, contact } from '../../data/contact.js';

const go = (event, href) => {
  event.preventDefault();
  scrollToId(href);
};

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="footer__brand-name">{brand.name}</div>
            <p className="footer__tagline">{brand.tagline}</p>
          </div>

          <div>
            <h3 className="footer__col-title">Studio</h3>
            <ul className="footer__list">
              <li>
                <a href="#services" onClick={(e) => go(e, '#services')}>
                  Services
                </a>
              </li>
              <li>
                <a href="#work" onClick={(e) => go(e, '#work')}>
                  Sample Work
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => go(e, '#contact')}>
                  Start Inquiries
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer__col-title">Connect</h3>
            <ul className="footer__list">
              <li>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram Feed — {contact.instagram.handle}
                </a>
              </li>
              <li>
                <a href={contact.whatsapp[0].url} target="_blank" rel="noopener noreferrer">
                  WhatsApp Chat
                </a>
              </li>
              <li>
                <a href={contact.email.url}>Email Studio</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{brand.copyright}</span>
          <span>{brand.signature}</span>
        </div>
      </div>
    </footer>
  );
}
