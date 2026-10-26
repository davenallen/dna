"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { TextLink } from "./TextLink";
import { postToSheet } from "@library/sheet";
import { track } from "@library/visit";

const CASE_STUDY = "/projects/17-injury-form/";

const WHEN = [
  { value: "under-1", label: "Less than 1 year" },
  { value: "1-to-3", label: "1–3 years" },
  { value: "over-3", label: "More than 3 years" },
];

const CLAIM = [
  { value: "none", label: "No action taken yet" },
  { value: "demand", label: "Demand for compensation made" },
  { value: "filed", label: "Lawsuit filed" },
  { value: "other", label: "Other" },
];

const INJURY = [
  { value: "anxiety", label: "Anxiety" },
  { value: "back", label: "Back or neck pain" },
  { value: "bones", label: "Broken bones" },
  { value: "cuts", label: "Cuts and bruises" },
  { value: "headaches", label: "Headaches" },
  { value: "memory", label: "Memory loss" },
  { value: "limb", label: "Loss of limb" },
  { value: "other", label: "Other" },
];

const CAUSE = [
  { value: "accident", label: "Traumatic physical injury" },
  { value: "repeated", label: "Repeated trauma" },
  { value: "mental", label: "Mental injury" },
  { value: "disease", label: "Occupational disease" },
  { value: "unsure", label: "Not sure" },
];

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const PATHS = [
  {
    id: "vehicle",
    label: "Auto Injury",
    steps: [
      { kind: "choice", name: "when", label: "How long ago did the auto incident happen?", options: WHEN },
      { kind: "choice", name: "report", label: "Was a police report filed?", options: YES_NO },
      { kind: "choice", name: "injury", label: "What is your primary injury?", options: INJURY },
      { kind: "note", name: "description", label: "Please briefly describe your injuries." },
      { kind: "zip", name: "zip", label: "Your ZIP code" },
      { kind: "name", label: "Your name" },
      { kind: "contact", label: "Email and phone" },
    ],
  },
  {
    id: "personal",
    label: "Personal Injury",
    steps: [
      { kind: "choice", name: "when", label: "How long ago did the personal incident happen?", options: WHEN },
      { kind: "choice", name: "claim", label: "What is the status of the claim?", options: CLAIM },
      { kind: "choice", name: "injury", label: "What is your primary injury?", options: INJURY },
      { kind: "note", name: "description", label: "Please briefly describe your injuries." },
      { kind: "zip", name: "zip", label: "Your ZIP code" },
      { kind: "name", label: "Your name" },
      { kind: "contact", label: "Email and phone" },
    ],
  },
  {
    id: "work",
    label: "Worker's Comp",
    steps: [
      { kind: "choice", name: "when", label: "How long ago did the work incident occur?", options: WHEN },
      { kind: "choice", name: "claim", label: "What is the status of the claim?", options: CLAIM },
      { kind: "choice", name: "injury", label: "What is your primary injury?", options: INJURY },
      { kind: "note", name: "description", label: "Please briefly describe your injuries." },
      { kind: "choice", name: "cause", label: "Cause of injury?", options: CAUSE },
      { kind: "zip", name: "zip", label: "Your ZIP code" },
      { kind: "name", label: "Your name" },
      { kind: "contact", label: "Email and phone" },
    ],
  },
];

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

function plainLabel(label) {
  return String(label || "").replace(/[?:.\s]+$/, "");
}

function problemFor(current, answers) {
  if (!current) return "";
  if (current.kind === "note" && !String(answers.description || "").trim()) return "Add a short description.";
  if (current.kind === "zip" && digits(answers.zip).length !== 5) return "Add a 5-digit ZIP code.";
  if (current.kind === "name") {
    if (String(answers.first || "").trim().length < 2 || String(answers.last || "").trim().length < 2) {
      return "Add a first and last name.";
    }
  }
  if (current.kind === "contact") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(answers.email || "").trim())) return "Add an email address.";
    if (digits(answers.phone).length < 10) return "Add a 10-digit phone number.";
  }
  return "";
}

function recordedLines(path, answers) {
  const rows = [];
  path.steps.forEach((item) => {
    if (item.kind === "choice") {
      const picked = (item.options || []).find((option) => option.value === answers[item.name]);
      rows.push(`${plainLabel(item.label)}: ${picked ? picked.label : ""}`);
    } else if (item.kind === "note") {
      rows.push(`${plainLabel(item.label)}: ${answers.description || ""}`);
    } else if (item.kind === "zip") {
      rows.push(`${plainLabel(item.label)}: ${answers.zip || ""}`);
    } else if (item.kind === "name") {
      rows.push(`First name: ${answers.first || ""}`);
      rows.push(`Last name: ${answers.last || ""}`);
    } else if (item.kind === "contact") {
      rows.push(`Email: ${answers.email || ""}`);
      rows.push(`Phone: ${answers.phone || ""}`);
    }
  });
  return rows;
}

function PathIcon({ id }) {
  if (id === "vehicle") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path fill="currentColor" d="M8 30l3-9h26l3 9v8H8v-8zm6 4a2 2 0 110-4 2 2 0 010 4zm20 0a2 2 0 110-4 2 2 0 010 4zM14 18l2-6h16l2 6H14z" />
      </svg>
    );
  }
  if (id === "personal") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="16" r="7" fill="currentColor" />
        <path fill="currentColor" d="M10 38c2-8 8-12 14-12s12 4 14 12H10z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M8 22h32v4H8v-4zm4-6c0-6 4-10 12-10s12 4 12 10v6H12v-6zm-2 14h28l-2 10H12l-2-10z" />
    </svg>
  );
}

export function InjuryForm() {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const baseId = useId();
  const pathname = usePathname();
  const onCaseStudy = (pathname || "").replace(/\/$/, "") === "/projects/17-injury-form";
  const [pathId, setPathId] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const path = PATHS.find((item) => item.id === pathId) || null;
  const current = path && !done ? path.steps[step] : null;
  const total = path ? path.steps.length : 1;
  const progress = done ? total : Math.min(step + 1, total);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      track("lead_view", { module: "injury-form" });
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => onScreen.disconnect();
  }, []);

  function openPath(id) {
    setPathId(id);
    setStep(0);
    setAnswers({});
    setError("");
    setDone(false);
    setSending(false);
    track("lead_step", { module: "injury-form", step: 1, path: id });
  }

  function back() {
    setError("");
    if (step === 0) {
      setPathId("");
      setDone(false);
      setAnswers({});
      return;
    }
    setDone(false);
    setStep(step - 1);
  }

  function setField(name, value) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
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

  async function finish(nextAnswers) {
    if (sending || !path) return;
    setSending(true);
    const lines = recordedLines(path, nextAnswers);
    const recorded = lines.join("\n");
    try {
      await postToSheet({
        form: "injury-form",
        page: window.location.pathname,
        name: `${String(nextAnswers.first || "").trim()} ${String(nextAnswers.last || "").trim()}`.trim(),
        email: String(nextAnswers.email || "").trim(),
        phone: nextAnswers.phone || "",
        message: recorded,
        description: recorded,
        detail: JSON.stringify({ campaign: "injury-evaluation", path: path.id, answers: nextAnswers }),
      });
    } catch (err) {
      setError("The form could not be saved. Try again.");
      setSending(false);
      return;
    }
    setAnswers(nextAnswers);
    setDone(true);
    track("lead_complete", { module: "injury-form", path: path.id });
    setSending(false);
  }

  function advance(patch) {
    if (!path || !current || sending) return;
    const nextAnswers = { ...answers, ...patch };
    const problem = problemFor(current, nextAnswers);
    if (problem) {
      setError(problem);
      return;
    }
    setAnswers(nextAnswers);
    setError("");
    if (step >= path.steps.length - 1) {
      finish(nextAnswers);
      return;
    }
    const next = step + 1;
    setStep(next);
    track("lead_step", { module: "injury-form", step: next + 1, path: path.id });
  }

  function onStepSubmit(event) {
    event.preventDefault();
    if (!current) return;
    if (current.kind === "note") advance({ description: String(answers.description || "").trim() });
    else if (current.kind === "zip") advance({ zip: digits(answers.zip).slice(0, 5) });
    else if (current.kind === "name") {
      advance({
        first: String(answers.first || "").trim(),
        last: String(answers.last || "").trim(),
      });
    } else if (current.kind === "contact") {
      advance({
        email: String(answers.email || "").trim(),
        phone: answers.phone || "",
      });
    }
  }

  const lines = path && done ? recordedLines(path, answers) : [];

  return (
    <section className="ds-lead ds-injury" ref={rootRef} aria-label="Injury form">
      <p className="ds-lead-kicker">Injury form (sample)</p>
      {!path && <h2>Which kind of injury?</h2>}
      <div className="ds-injury-paths" role="group" aria-label="Injury type">
        {PATHS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ds-lead-choice ds-injury-path${pathId === item.id ? " is-picked" : ""}`}
            aria-current={pathId === item.id ? "true" : undefined}
            onClick={() => openPath(item.id)}
          >
            <PathIcon id={item.id} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {path && done ? (
        <div className="ds-lead-result">
          <h2>This is the data that was recorded</h2>
          <p>Form data is kept for demonstration purposes only and will not be sold or shared.</p>
          <ul>
            {lines.map((row) => <li key={row}>{row}</li>)}
          </ul>
          <Button type="button" variant="secondary" onClick={() => openPath(path.id)}>Start over</Button>
        </div>
      ) : path && current ? (
        <>
          <div className="ds-lead-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={progress} aria-label={`Step ${progress} of ${total}`}>
            <span style={{ width: `${(progress / total) * 100}%` }} />
          </div>
          <h2>{current.label}</h2>
          {current.kind === "choice" ? (
            <div className="ds-lead-choices" role="group" aria-label={current.label}>
              {current.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`ds-lead-choice${answers[current.name] === option.value ? " is-picked" : ""}`}
                  onClick={() => advance({ [current.name]: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <form className="ds-lead-form" onSubmit={onStepSubmit} noValidate>
              {current.kind === "note" ? (
                <FormField
                  id={`${baseId}-description`}
                  name="description"
                  label="Description"
                  icon={<i className="far fa-envelope" aria-hidden="true"></i>}
                  as="textarea"
                  rows={3}
                  value={answers.description || ""}
                  onChange={(event) => setField("description", event.target.value)}
                />
              ) : null}
              {current.kind === "zip" ? (
                <FormField
                  id={`${baseId}-zip`}
                  name="zip"
                  label="ZIP code"
                  icon={<i className="fas fa-map-marker-alt" aria-hidden="true"></i>}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={5}
                  value={answers.zip || ""}
                  onChange={(event) => setField("zip", digits(event.target.value).slice(0, 5))}
                />
              ) : null}
              {current.kind === "name" ? (
                <div className="ds-lead-fields">
                  <FormField id={`${baseId}-first`} name="first" label="First name" icon={<i className="fas fa-user" aria-hidden="true"></i>} autoComplete="given-name" value={answers.first || ""} onChange={(event) => setField("first", event.target.value)} />
                  <FormField id={`${baseId}-last`} name="last" label="Last name" icon={<i className="fas fa-user" aria-hidden="true"></i>} autoComplete="family-name" value={answers.last || ""} onChange={(event) => setField("last", event.target.value)} />
                </div>
              ) : null}
              {current.kind === "contact" ? (
                <div className="ds-lead-fields">
                  <FormField id={`${baseId}-email`} name="email" type="email" label="Email" icon={<i className="fas fa-at" aria-hidden="true"></i>} autoComplete="email" inputMode="email" value={answers.email || ""} onChange={(event) => setField("email", event.target.value)} />
                  <FormField id={`${baseId}-phone`} name="phone" type="tel" label="Phone" icon={<i className="fas fa-phone" aria-hidden="true"></i>} autoComplete="tel" inputMode="tel" value={answers.phone || ""} onChange={onPhoneChange} />
                </div>
              ) : null}
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : step === path.steps.length - 1 ? "See my results" : "Next"}
              </Button>
            </form>
          )}
          {error ? <p className="ds-lead-error" role="alert">{error}</p> : null}
          <button type="button" className="ds-lead-back" onClick={back}>{step === 0 ? "All paths" : "Back"}</button>
          <p className="ds-lead-hint">Form data is kept for demonstration purposes only and will not be sold or shared.</p>
        </>
      ) : null}

      {!onCaseStudy && (
        <p className="ds-offer-note">
          Sample of the injury form.{" "}
          <TextLink href={CASE_STUDY}>Full case study</TextLink>
        </p>
      )}
    </section>
  );
}

export default InjuryForm;
