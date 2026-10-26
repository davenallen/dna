import Link from "next/link";

export function TextLink({
  href,
  native = false,
  chevron = true,
  tone = "accent",
  direction = "right",
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "ds-link",
    "dna-link",
    tone === "accent" ? "dna-color-link" : "",
    chevron ? "dna-w-chevron" : "",
    direction === "left" ? "dna-left-link" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !native) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

export default TextLink;
