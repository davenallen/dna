"use client";

import { useEffect, useState } from "react";
import { TextLink } from "./TextLink";
import { ensureVisit, getLog } from "@library/visit";

const ARRIVAL = [
  ["source", "Source"],
  ["medium", "Medium"],
  ["campaign", "Campaign"],
  ["content", "Content"],
  ["term", "Term"],
  ["click_id", "Click id"],
  ["landing_path", "Landing"],
  ["referrer", "Referrer"],
  ["session_id", "Session"],
];

function show(value, key) {
  if (value) return key === "referrer" ? value.replace(/^https?:\/\//, "") : value;
  if (key === "referrer") return "none";
  return "—";
}

function stamp(time) {
  return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function details(params) {
  return Object.entries(params)
    .filter(([key]) => key !== "session_id" && key !== "landing_path")
    .map(([key, value]) => `${key}=${value}`)
    .join(" · ");
}

export function VisitLog() {
  const [visit, setVisit] = useState(null);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const read = () => {
      setVisit(ensureVisit());
      setLog(getLog());
    };
    read();
    window.addEventListener("dna-visit", read);
    return () => window.removeEventListener("dna-visit", read);
  }, []);

  const lead = new Set(["source", "medium", "campaign"]);

  return (
    <div className="ds-visit">
      <p className="ds-visit-kicker">Session information</p>
      <dl className="ds-visit-facts">
        {ARRIVAL.map(([key, label]) => (
          <div className={`ds-visit-fact${lead.has(key) ? " is-lead" : ""}`} key={key}>
            <dt>{label}</dt>
            <dd>{visit ? show(visit[key], key) : "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="ds-visit-events">
        <p className="ds-visit-events-label">Events</p>
        <ol className="ds-visit-log" aria-live="polite">
          {log.length === 0 ? (
            <li className="ds-visit-empty">Events from this visit show up here.</li>
          ) : (
            log.map((entry, index) => (
              <li key={`${entry.time}-${entry.name}-${index}`}>
                <time dateTime={new Date(entry.time).toISOString()}>{stamp(entry.time)}</time>
                <span className="ds-visit-name">{entry.name}</span>
                <span className="ds-visit-params">{details(entry.params)}</span>
              </li>
            ))
          )}
        </ol>
      </div>
      <p className="ds-visit-caption">
        Arrival is read once from the landing URL and kept for this browser session. Each line is pushed to the dataLayer with that arrival still attached.{" "}
        <TextLink href="/projects/09-registration-path">The registration path</TextLink> is the production version of this helper.
      </p>
    </div>
  );
}

export default VisitLog;
