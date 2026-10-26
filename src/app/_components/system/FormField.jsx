export function FormField({
  id,
  name,
  label,
  icon,
  as = "input",
  type = "text",
  className = "",
  ...inputProps
}) {
  const fieldClass = `dna-form-field ds-field ${className}`.trim();

  if (as === "textarea") {
    return (
      <div className={fieldClass}>
        <textarea
          id={id}
          name={name}
          placeholder={label}
          className="dna-input ds-field-control"
          {...inputProps}
        />
        {icon ? <label htmlFor={id}>{icon}</label> : null}
      </div>
    );
  }

  return (
    <div className={fieldClass}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={label}
        className="dna-input ds-field-control"
        {...inputProps}
      />
      {icon ? <label htmlFor={id}>{icon}</label> : null}
    </div>
  );
}

export default FormField;
