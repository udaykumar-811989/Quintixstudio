/**
 * ══════════════════════════════════════════════════════════════════════════
 *  QUINTIX STUDIO — BUSINESS INFORMATION
 *  Everything a client would want to change lives here. Edit values only;
 *  the components read from this file automatically.
 * ══════════════════════════════════════════════════════════════════════════
 */

export const brand = {
  name: 'QUINTIX',
  fullName: 'QUINTIX Studio',
  tagline: 'Creative • Social • Digital',
  copyright: '© 2026 QUINTIX STUDIO. ALL RIGHTS RESERVED.',
  signature: 'Bespoke Creative Freelancing Collective.',
};

export const contact = {
  instagram: {
    handle: '@quintix_studio',
    url: 'https://www.instagram.com/quintix_studio/',
    display: '@quintix_studio',
  },
  email: {
    address: 'quintixstudios@gmail.com',
    url: 'mailto:quintixstudios@gmail.com',
    display: 'quintixstudios@gmail.com',
  },
  whatsapp: [
    {
      label: 'WhatsApp 1',
      display: '+91 72049 55268',
      /* International format, no spaces or symbols — required by wa.me */
      url: 'https://wa.me/917204955268?text=Hi%20QUINTIX%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project.',
    },
    {
      label: 'WhatsApp 2',
      display: '+91 63635 36891',
      url: 'https://wa.me/916363536891?text=Hi%20QUINTIX%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20project.',
    },
  ],
};

/**
 * Optional direct-submission endpoint.
 *
 * Leave `null` and the inquiry form gracefully opens the visitor's email app
 * (mailto) with everything pre-filled — no backend required.
 *
 * To collect submissions in a dashboard instead, paste a form service URL
 * (Formspree, Basin, Web3Forms, Netlify Forms, your own API…) e.g.:
 *   endpoint: 'https://formspree.io/f/yourFormId'
 * When set, the form POSTs JSON to it and shows real success/error states.
 */
export const inquiryForm = {
  endpoint: null,
  subject: (values) =>
    `New ${values.businessType || 'General'} inquiry from ${values.name || 'website'} — QUINTIX Studio`,
};

export const businessTypes = [
  'Hotel or Hospitality',
  'Restaurant or Cafe',
  'Fitness',
  'Salon or Spa',
  'Retail or E-commerce',
  'Personal Brand',
  'Other',
];
