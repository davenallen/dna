export function SectionTitle({ title, children, aside, className = "" }) {
  const heading = children ?? title;
  const asHtml = typeof heading === "string";

  return (
    <div className={`dna-section-title ds-section-title ${className}`.trim()}>
      <div className="dna-title-frame">
        {asHtml ? <h4 dangerouslySetInnerHTML={{ __html: heading }} /> : <h4>{heading}</h4>}
      </div>
      {aside ? <div className="dna-right-frame">{aside}</div> : null}
    </div>
  );
}

export default SectionTitle;
