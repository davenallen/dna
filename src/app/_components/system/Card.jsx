export function Card({ children, className = "" }) {
  return <div className={`ds-card dna-a dna-card ${className}`.trim()}>{children}</div>;
}

export default Card;
