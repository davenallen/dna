"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { postToSheet } from "@library/sheet";
import { track } from "@library/visit";

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const STEPS = [
  {
    id: "age",
    label: "Age range",
    prompt: "What is your age range?",
    choices: [
      { value: "under-49", label: "Under 49" },
      { value: "mid", label: "49 to 62" },
      { value: "over-62", label: "Over 62" },
    ],
  },
  {
    id: "enrolled",
    label: "Already in a program",
    prompt: "Are you already in a similar program?",
    choices: YES_NO,
  },
  {
    id: "working",
    label: "Working full time",
    prompt: "Are you working full time?",
    choices: YES_NO,
  },
  {
    id: "advisor",
    label: "Working with an advisor",
    prompt: "Are you already working with an advisor?",
    choices: YES_NO,
  },
  {
    id: "tenure",
    label: "Five of the last ten years",
    prompt: "Have you worked at least 5 of the last 10 years?",
    hint: "The years do not have to be in a row.",
    choices: YES_NO,
  },
  {
    id: "focus",
    prompt: "What should the review focus on?",
    text: true,
  },
];

const EMPTY_FORM = { first: "", last: "", email: "", phone: "", zip: "" };
const TOTAL = STEPS.length + 1;

function digits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatUSPhone(value) {
  if (/[a-z]/i.test(value)) return value;
  let chars = digits(value);
  if (chars.length > 10 && chars.charAt(0) === "1") chars = chars.slice(1);
  chars = chars.slice(0, 10);
  if (!chars) return "";
  if (chars.length < 4) return `(${chars}`;
  if (chars.length < 7) return `(${chars.slice(0, 3)}) ${chars.slice(3)}`;
  return `(${chars.slice(0, 3)}) ${chars.slice(3, 6)}-${chars.slice(6)}`;
}

function phoneCaret(raw, formatted, cursor) {
  if (/[a-z]/i.test(raw)) return cursor;
  const rawDigits = digits(raw);
  const before = digits(raw.slice(0, cursor));
  let count = before.length;
  if (rawDigits.length > 10 && rawDigits.charAt(0) === "1" && before.charAt(0) === "1") {
    count = Math.max(0, count - 1);
  }
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted.charAt(i))) seen += 1;
    if (seen === count) return i + 1;
  }
  return formatted.length;
}

function contactError(form) {
  if (!form.first.trim() || !form.last.trim()) return "Add a first and last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Add an email address.";
  if (digits(form.phone).length < 10) return "Add a 10-digit phone number.";
  if (digits(form.zip).length !== 5) return "Add a 5-digit ZIP code.";
  return "";
}

export function LeadQuiz() {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [note, setNote] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      track("lead_view", { module: "lead" });
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => onScreen.disconnect();
  }, []);

  const question = STEPS[step];
  const onContact = step >= STEPS.length;
  const progress = done ? TOTAL : Math.min(step + 1, TOTAL);

  function go(next) {
    setError("");
    setStep(next);
    if (next > step) track("lead_step", { module: "lead", step: next + 1 });
  }

  function choose(value) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    go(step + 1);
  }

  function continueNote() {
    if (!note.trim()) {
      setError("Add a short note about the review.");
      return;
    }
    go(step + 1);
  }

  async function finish(event) {
    event.preventDefault();
    const problem = contactError(form);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSending(true);
    try {
      await postToSheet({
        form: "lead",
        page: window.location.pathname,
        name: `${form.first.trim()} ${form.last.trim()}`,
        email: form.email.trim(),
        phone: form.phone,
        detail: JSON.stringify({ zip: form.zip, note: note.trim(), answers }),
      });
    } catch (err) {
      setError("The form could not be saved. Try again.");
      setSending(false);
      return;
    }
    setDone(true);
    track("lead_complete", { module: "lead" });
    setSending(false);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setNote("");
    setForm(EMPTY_FORM);
    setError("");
    setDone(false);
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  function onPhoneChange(event) {
    const input = event.target;
    const raw = input.value;
    const cursor = input.selectionStart ?? raw.length;
    const formatted = formatUSPhone(raw);
    const pos = phoneCaret(raw, formatted, cursor);
    setField("phone", formatted);
    requestAnimationFrame(() => {
      if (document.activeElement === input) input.setSelectionRange(pos, pos);
    });
  }

  function onZipChange(event) {
    setField("zip", digits(event.target.value).slice(0, 5));
  }

  return (
    <section className="ds-lead" ref={rootRef} aria-label="SSD Lead Quiz (Sample)">
      <p className="ds-lead-kicker">SSD Lead Quiz (Sample)</p>
      <div className="ds-lead-progress" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL} aria-valuenow={progress} aria-label={`Step ${progress} of ${TOTAL}`}>
        <span style={{ width: `${(progress / TOTAL) * 100}%` }} />
      </div>

      {done ? (
        <div className="ds-lead-result">
          <h2>Sample result</h2>
          <p>This is where a live page would show the next step. Form data is kept for demonstration purposes only and will not be sold or shared.</p>
          <ul>
            {STEPS.filter((item) => item.choices).map((item) => {
              const picked = item.choices.find((choice) => choice.value === answers[item.id]);
              return <li key={item.id}>{item.label}: {picked ? picked.label : "Skipped"}</li>;
            })}
            {note.trim() ? <li>Review: {note.trim()}</li> : null}
          </ul>
          <Button type="button" variant="secondary" onClick={restart}>Start over</Button>
        </div>
      ) : (
        <>
          <h2>{onContact ? "Where should the result go?" : question.prompt}</h2>
          {question?.hint && !onContact ? <p className="ds-lead-hint">{question.hint}</p> : null}
          {onContact ? <p className="ds-lead-hint">Form data is kept for demonstration purposes only and will not be sold or shared.</p> : null}

          {!onContact && question.choices ? (
            <div className="ds-lead-choices" role="group" aria-label={question.prompt}>
              {question.choices.map((choice) => (
                <button
                  key={choice.value}
                  type="button"
                  className={`ds-lead-choice${answers[question.id] === choice.value ? " is-picked" : ""}`}
                  onClick={() => choose(choice.value)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : null}

          {!onContact && question.text ? (
            <div className="ds-lead-note">
              <FormField
                id="lead-focus"
                name="focus"
                label="A sentence is enough"
                icon={<i className="far fa-envelope" aria-hidden="true"></i>}
                as="textarea"
                rows={3}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setError("");
                }}
              />
              <Button type="button" onClick={continueNote}>Continue</Button>
            </div>
          ) : null}

          {onContact ? (
            <form className="ds-lead-form" onSubmit={finish} noValidate>
              <div className="ds-lead-fields">
                <FormField id="lead-first" name="first" label="First name" icon={<i className="fas fa-user" aria-hidden="true"></i>} autoComplete="given-name" value={form.first} onChange={(event) => setField("first", event.target.value)} />
                <FormField id="lead-last" name="last" label="Last name" icon={<i className="fas fa-user" aria-hidden="true"></i>} autoComplete="family-name" value={form.last} onChange={(event) => setField("last", event.target.value)} />
                <FormField id="lead-email" name="email" type="email" label="Email" icon={<i className="fas fa-at" aria-hidden="true"></i>} autoComplete="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
                <FormField id="lead-phone" name="phone" type="tel" label="Phone" icon={<i className="fas fa-phone" aria-hidden="true"></i>} autoComplete="tel" inputMode="tel" value={form.phone} onChange={onPhoneChange} />
                <FormField id="lead-zip" name="zip" label="ZIP code" icon={<i className="fas fa-map-marker-alt" aria-hidden="true"></i>} autoComplete="postal-code" inputMode="numeric" maxLength={5} value={form.zip} onChange={onZipChange} />
              </div>
              <Button type="submit" disabled={sending}>{sending ? "Sending..." : "See the sample result"}</Button>
            </form>
          ) : null}

          {error ? <p className="ds-lead-error" role="alert">{error}</p> : null}
          {step > 0 ? (
            <button type="button" className="ds-lead-back" onClick={() => go(step - 1)}>Back</button>
          ) : null}
        </>
      )}
    </section>
  );
}

export default LeadQuiz;
