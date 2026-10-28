/**
 * Seamless marquee. Two identical groups are rendered and the track slides
 * by exactly -50%, so the loop has no visible seam. Screen readers only
 * read the first group.
 */
export function Ticker({
  items,
  duration = 40,
  reverse = false,
  className = '',
  itemClassName = '',
  dot = true,
}) {
  if (!items || items.length === 0) return null;

  const renderGroup = (hidden) => (
    <div className="ticker__group" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <span className={`ticker__item ${itemClassName}`.trim()} key={`${hidden ? 'b' : 'a'}-${index}`}>
          {item}
          {dot && <i className="ticker__dot" aria-hidden="true" />}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`ticker${reverse ? ' ticker--reverse' : ''} ${className}`.trim()}
      style={{ '--ticker-duration': `${duration}s` }}
    >
      <div className="ticker__track">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}
