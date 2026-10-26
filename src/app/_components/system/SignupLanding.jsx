"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { postToSheet } from "@library/sheet";
import { ensureVisit, track, trackOnce } from "@library/visit";
import { sessionDaysOut } from "@library/sessionDate";

const CAMPAIGN = {
  slug: "market-open-briefing",
  name: "Market open briefing",
  eyebrow: "Live session",
  headline: "A 40-minute briefing on the market open.",
  subhead: "Reserve a seat with your email. The session link and a calendar invite come back to that address.",
  length: "40 minutes",
  where: "A link in the confirmation email",
  button: "Reserve a seat",
  note: "No account. One confirmation email.",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatUSPhone(value) {
  if (/[a-z]/i.test(value)) return value;
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.charAt(0) === "1") digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function phoneCaret(raw, formatted, cursor) {
  if (/[a-z]/i.test(raw)) return cursor;
  const rawDigits = raw.replace(/\D/g, "");
  const before = raw.slice(0, cursor).replace(/\D/g, "");
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

function visitLine(visit) {
  if (!visit) return "Reading this visit";
  return `${visit.source || "direct"} / ${visit.medium || "none"} / ${visit.campaign || "none"}`;
}

function recordedLines(emailValue, reminderChoice, phoneValue) {
  return [
    `Email: ${emailValue}`,
    `SMS reminder: ${reminderChoice === "optin" ? "Send me an SMS" : "No thanks"}`,
    `Mobile number: ${reminderChoice === "optin" ? phoneValue : "Skipped"}`,
    `Campaign: ${CAMPAIGN.name}`,
  ];
}

function calendarUrl(campaign) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: campaign.name,
    dates: `${campaign.starts}/${campaign.ends}`,
    details: "Sample session. The link arrives in the confirmation email.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(campaign) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//David N Allen//Signup Sample//EN",
    "BEGIN:VEVENT",
    `DTSTART:${campaign.starts}`,
    `DTEND:${campaign.ends}`,
    `SUMMARY:${campaign.name}`,
    "DESCRIPTION:Sample session. The link arrives in the confirmation email.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${campaign.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function SignupForm({ id, email, setEmail, error, onFocus, onSubmit }) {
  const errorId = `${id}-error`;

  return (
    <form className="ds-signup-form" onSubmit={onSubmit} noValidate>
      <label className="ds-signup-label" htmlFor={id}>Email</label>
      <div className="ds-signup-row">
        <FormField
          id={id}
          name="email"
          type="email"
          label="Email"
          placeholder="you@email.com"
          icon={<i className="fas fa-at" aria-hidden="true"></i>}
          className="ds-signup-field"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onFocus={onFocus}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
        />
        <Button type="submit">{CAMPAIGN.button}</Button>
      </div>
      {error ? (
        <p id={errorId} className="ds-signup-error">{error}</p>
      ) : (
        <p className="ds-signup-note">{CAMPAIGN.note}</p>
      )}
    </form>
  );
}

function RemindForm({ id, phone, onChange, error, onSubmit, onSkip, sending }) {
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;

  return (
    <form className="ds-signup-remind" onSubmit={onSubmit} noValidate>
      <p className="ds-signup-kicker">SMS</p>
      <p className="ds-signup-done-title">Want an SMS before the session?</p>
      <p className="ds-signup-note">One message, 30 minutes before it starts.</p>
      <label className="ds-signup-label" htmlFor={id}>Mobile number</label>
      <FormField
        id={id}
        name="phone"
        type="tel"
        label="Mobile number"
        placeholder="(303) 555-0100"
        icon={<i className="fas fa-phone" aria-hidden="true"></i>}
        className="ds-signup-field"
        autoComplete="tel"
        inputMode="tel"
        value={phone}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${noteId} ${errorId}` : noteId}
      />
      <p id={noteId} className="ds-signup-privacy">
        Form data is kept for demonstration purposes only and will not be sold or shared.
      </p>
      <div className="ds-signup-remind-actions">
        <Button type="submit" disabled={sending}>{sending ? "Sending..." : "Send me an SMS"}</Button>
        <Button type="button" variant="secondary" onClick={onSkip} disabled={sending}>No thanks</Button>
      </div>
      {error ? <p id={errorId} className="ds-signup-error">{error}</p> : null}
    </form>
  );
}

function Step({ done, label, detail }) {
  return (
    <li className={done ? "is-done" : undefined}>
      <span className="ds-signup-mark" aria-hidden="true">{done ? "✓" : "·"}</span>
      <span>
        <strong>{label}</strong>
        <span className="ds-signup-step-detail">{detail}</span>
      </span>
    </li>
  );
}

export function SignupLanding() {
  const rootRef = useRef(null);
  const baseId = useId();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState("email");
  const [reminder, setReminder] = useState("");
  const [recorded, setRecorded] = useState([]);
  const [sending, setSending] = useState(false);
  const [visit, setVisit] = useState(null);
  const [session, setSession] = useState(null);
  const whenLabel = session ? `${session.whenLabel} · 8:30 a.m. MT` : "8:30 a.m. MT";
  const campaign = session
    ? { ...CAMPAIGN, whenLabel, starts: session.starts, ends: session.ends }
    : null;

  useEffect(() => {
    setSession(sessionDaysOut());
    setVisit(ensureVisit());
    const node = rootRef.current?.querySelector(".ds-signup-hero");
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      trackOnce("signup-view", "signup_view", { module: "signup", campaign: CAMPAIGN.slug });
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "remind") return;
    trackOnce("reminder-view", "reminder_view", { module: "signup", campaign: CAMPAIGN.slug });
  }, [phase]);

  function onFocus() {
    setStarted(true);
    trackOnce("signup-start", "signup_start", { module: "signup", campaign: CAMPAIGN.slug });
  }

  function onSubmit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setError("Enter an email address.");
      return;
    }
    setError("");
    setPhone("");
    setPhoneError("");
    if (!started) {
      setStarted(true);
      trackOnce("signup-start", "signup_start", { module: "signup", campaign: CAMPAIGN.slug });
    }
    setPhase("remind");
    track("signup_complete", { module: "signup", campaign: CAMPAIGN.slug });
  }

  function onPhoneChange(event) {
    const input = event.target;
    const raw = input.value;
    const cursor = input.selectionStart ?? raw.length;
    const formatted = formatUSPhone(raw);
    const pos = phoneCaret(raw, formatted, cursor);
    setPhone(formatted);
    setPhoneError("");
    requestAnimationFrame(() => {
      if (document.activeElement === input) input.setSelectionRange(pos, pos);
    });
  }

  async function saveSignup(reminderChoice, phoneValue) {
    setSending(true);
    setPhoneError("");
    const lines = recordedLines(email.trim(), reminderChoice, phoneValue);
    try {
      await postToSheet({
        form: "signup",
        page: window.location.pathname,
        email: email.trim(),
        phone: phoneValue,
        message: lines.join("\n"),
        description: lines.join("\n"),
        detail: JSON.stringify({ campaign: CAMPAIGN.slug, reminder: reminderChoice }),
      });
    } catch (err) {
      setPhoneError("The form could not be saved. Try again.");
      setSending(false);
      return;
    }
    setPhone("");
    setRecorded(lines);
    setReminder(reminderChoice);
    setPhase("done");
    track(reminderChoice === "optin" ? "reminder_optin" : "reminder_skip", { module: "signup", campaign: CAMPAIGN.slug });
    setSending(false);
  }

  function onRemind(event) {
    event.preventDefault();
    const value = phone.trim();
    if (!value) {
      setPhoneError("Enter a phone number.");
      return;
    }
    saveSignup("optin", value);
  }

  function onSkip() {
    saveSignup("skip", "");
  }

  const formProps = { email, setEmail, error, onFocus, onSubmit };
  const remindProps = { phone, onChange: onPhoneChange, error: phoneError, onSubmit: onRemind, onSkip, sending };
  const signedUp = phase !== "email";
  const progress = phase === "email" ? 1 : phase === "remind" ? 2 : 3;

  return (
    <section className="ds-lead ds-signup" ref={rootRef} aria-label="Email signup">
      <div className="ds-signup-hero">
        <p className="ds-lead-kicker">Registration path (sample)</p>
        <div className="ds-lead-progress" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={progress} aria-label={`Step ${progress} of 3`}>
          <span style={{ width: `${(progress / 3) * 100}%` }} />
        </div>
        <h2>{CAMPAIGN.headline}</h2>
        <p className="ds-signup-lead">{CAMPAIGN.subhead}</p>
        <div className="ds-signup-facts">
          <p className="ds-signup-fact"><span>When</span><strong>{whenLabel}</strong></p>
          <p className="ds-signup-fact"><span>Length</span><strong>{CAMPAIGN.length}</strong></p>
          <p className="ds-signup-fact"><span>Where</span><strong>{CAMPAIGN.where}</strong></p>
        </div>
        {phase === "done" ? (
          <div className="ds-signup-done" role="status">
            <p className="ds-signup-done-title">Seat reserved.</p>
            <p>{email.trim()} is on the list for {CAMPAIGN.name}.</p>
            <ul className="ds-signup-record">
              {recorded.map((row) => <li key={row}>{row}</li>)}
            </ul>
            <p className="ds-signup-note">
              Form data is kept for demonstration purposes only and will not be sold or shared. This sample still has {visitLine(visit)} and the campaign attached.
            </p>
            {campaign ? (
              <div className="ds-signup-cal">
                <Button href={calendarUrl(campaign)} external variant="secondary">Google Calendar</Button>
                <Button variant="secondary" onClick={() => downloadIcs(campaign)}>Download .ics</Button>
              </div>
            ) : null}
          </div>
        ) : phase === "remind" ? (
          <RemindForm id={`${baseId}-phone`} {...remindProps} />
        ) : (
          <SignupForm id={`${baseId}-email`} {...formProps} />
        )}
      </div>

      <h3>Registration path</h3>
      <p className="ds-signup-panel-lead">The visit stays on the signup. Each step is a dataLayer event.</p>
      <ol className="ds-signup-steps">
        <Step done label="Arrived" detail={visitLine(visit)} />
        <Step done={started || signedUp} label="Form started" detail={started || signedUp ? "signup_start" : "Waiting for the field"} />
        <Step done={signedUp} label="Signup" detail={signedUp ? "signup_complete" : "Waiting for a valid email"} />
        <Step
          done={phase === "done"}
          label="SMS"
          detail={
            reminder === "optin" ? "reminder_optin" :
            reminder === "skip" ? "reminder_skip" :
            phase === "remind" ? "Waiting for a number, or a skip" :
            "After the email"
          }
        />
      </ol>

      <h3>Campaign record</h3>
      <p className="ds-signup-panel-lead">The page reads this record. A new session replaces it.</p>
      <dl className="ds-signup-spec">
        <div><dt>Name</dt><dd>{CAMPAIGN.name}</dd></div>
        <div><dt>When</dt><dd>{whenLabel}</dd></div>
        <div><dt>Length</dt><dd>{CAMPAIGN.length}</dd></div>
        <div><dt>Button</dt><dd>{CAMPAIGN.button}</dd></div>
        <div><dt>Calendar</dt><dd>Google Calendar and an .ics file, from the start and end on this record.</dd></div>
        <div><dt>SMS</dt><dd>A US number formats as you type. Form data is kept for demonstration purposes only and will not be sold or shared.</dd></div>
      </dl>
    </section>
  );
}

export default SignupLanding;
