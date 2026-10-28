/** Minimal line-icon set — drawn as SVG, no icon dependency. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function Icon({ name, size = 24, className, ...rest }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...base}
      {...rest}
    >
      {paths}
    </svg>
  );
}

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  reels: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="3" />
      <path d="M2.5 9h19" />
      <path d="M8 5 6 9" />
      <path d="M14 5l-2 4" />
      <path d="M10.6 11.4v4.6l3.8-2.3z" fill="currentColor" stroke="none" />
    </>
  ),
  aperture: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v7.4M20.8 8.3l-6.9 3.9M18.4 19.4l-2.4-7M5.6 19.4l6.9-3.9M3.2 8.3l6.9 3.9M8.9 3.6l2.4 6.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
      <path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" />
      <path d="M7.5 13.5h3M13.5 13.5h3M7.5 17h3" />
    </>
  ),
  palette: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9c0 1.9-1.6 3-3.4 3H15a2 2 0 0 0-1.5 3.3c.4.5.2 1.2-.4 1.5-.7.4-1.5.2-2-.2A9 9 0 0 1 12 21Z" />
      <circle cx="7.6" cy="11.4" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.6" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  growth: (
    <>
      <path d="M3.5 20.5h17" />
      <path d="M4 16.5l5-5.5 3.8 3 6.7-8" />
      <path d="M15.2 6h4.3v4.2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.8 13.9 9 20 11l-6.1 2L12 19.2 10.1 13 4 11l6.1-2z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.6 8.4 13.8 13.8 8.4 15.6l1.8-5.4z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6z" />
      <path d="m3.5 12.4 8.5 4.6 8.5-4.6" />
      <path d="m3.5 16.9 8.5 4.6 8.5-4.6" />
    </>
  ),
  chart: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 15.5v-3M12 15.5V9M16.5 15.5v-5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.4l3.4 2" />
    </>
  ),
  headphones: (
    <>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <path d="M4 15a2.5 2.5 0 0 1 5 0v2a2.5 2.5 0 0 1-5 0zM20 15a2.5 2.5 0 0 0-5 0v2a2.5 2.5 0 0 0 5 0z" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17.5 9.5 11l3.5 3.5L21 6.5" />
      <path d="M15.5 6.5H21V12" />
      <circle cx="6" cy="6" r="2.2" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3.5 7 7.4 5.4a2 2 0 0 0 2.2 0L20.5 7" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.4-4.5A8.4 8.4 0 1 1 20.5 11.7Z" />
      <path d="M9 8.8c.4-.2.8 0 1 .4l.5 1c.1.3.1.6-.1.8l-.4.4c.5 1 1.3 1.8 2.3 2.3l.4-.5c.2-.2.5-.3.8-.2l1 .4c.4.2.5.5.4.9-.2.6-.8 1-1.5 1-2.6-.2-5-2.6-5.2-5.2 0-.6.3-1.1.8-1.4Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  check: (
    <>
      <path d="m4.5 12.5 5 5 10-11" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6C6.4 7.5 4.5 10.3 4.5 14v4h6v-6H7.4c.2-1.8 1-3.2 2.6-4.1zM20 6c-3.1 1.5-5 4.3-5 8v4h6v-6h-3.1c.2-1.8 1-3.2 2.6-4.1z" fill="currentColor" stroke="none" />
    </>
  ),
};
