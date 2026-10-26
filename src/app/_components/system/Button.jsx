import Link from "next/link";

export function Button({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}) {
  const classes = [
    "ds-btn",
    "dna-btn",
    size === "sm" ? "dna-btn-sm" : "dna-btn-md",
    variant === "secondary" ? "dna-btn-secondary" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = <span>{children}</span>;

  if (href && external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}

export default Button;
