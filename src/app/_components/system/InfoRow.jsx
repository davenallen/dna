export function InfoRow({ label, value }) {
  const text = String(label).endsWith(":") ? label : `${label}:`;
  const valueIsHtml = typeof value === "string" && value.includes("<");

  return (
    <li className="ds-info-row">
      <h6>{text}</h6>
      {valueIsHtml ? <span dangerouslySetInnerHTML={{ __html: value }} /> : <span>{value}</span>}
    </li>
  );
}

export default InfoRow;
