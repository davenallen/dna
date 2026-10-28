"use client";

import { useEffect, useState } from "react";
import { SectionTitle } from "@components/system";

const KEY = "dna-campaign-events";

const LANDINGS = [
  {
    id: "registration-landing-page",
    name: "Lead Funnel Landing Page",
    href: "/iframes/registration/index.html?utm_source=email&utm_medium=newsletter&utm_campaign=live_session",
  },
  {
    id: "disability-benefits-briefing",
    name: "Disability Benefits Landing Page",
    href: "/iframes/benefits/index.html?utm_source=search&utm_medium=cpc&utm_campaign=benefits_briefing",
  },
  {
    id: "injury-evaluation",
    name: "Injury Evaluation Landing Page",
    href: "/iframes/injury/index.html?utm_source=partner&utm_medium=referral&utm_campaign=injury_eval",
  },
];

const EVENTS = [
  ["landing_view", "The landing opened."],
  ["form_start", "The first field or choice."],
  ["form_step", "A later step, including the reminder and onboarding."],
  ["generate_lead", "The form was saved. This is the GA4 lead event."],
  ["reminder_opt_in", "The visitor asked for the SMS reminder."],
  ["reminder_opt_out", "The visitor skipped the SMS reminder."],
];

function readEvents() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function tally(events, name, landingId) {
  return events.filter((event) => event.event === name && (!landingId || event.landing_id === landingId)).length;
}

function rate(part, whole) {
  if (!whole) return "—";
  return `${Math.round((part / whole) * 100)}%`;
}

function landingName(id) {
  return LANDINGS.find((item) => item.id === id)?.name || id || "Landing";
}

export function CampaignDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const refresh = () => setEvents(readEvents());
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const views = tally(events, "landing_view");
  const starts = tally(events, "form_start");
  const leads = tally(events, "generate_lead");
  const optIns = tally(events, "reminder_opt_in");
  const optOuts = tally(events, "reminder_opt_out");

  const marketing = Object.values(events.reduce((groups, event) => {
    const key = [event.source || "direct", event.medium || "(none)", event.campaign || "(not set)"].join("|");
    if (!groups[key]) {
      groups[key] = {
        key,
        source: event.source || "direct",
        medium: event.medium || "(none)",
        campaign: event.campaign || "(not set)",
        views: 0,
        leads: 0,
      };
    }
    if (event.event === "landing_view") groups[key].views += 1;
    if (event.event === "generate_lead") groups[key].leads += 1;
    return groups;
  }, {})).sort((a, b) => b.leads - a.leads || b.views - a.views);

  const forms = Object.values(events.reduce((groups, event) => {
    if (!event.form_name) return groups;
    const key = [event.landing_id, event.form_name, event.form_path || ""].join("|");
    if (!groups[key]) {
      groups[key] = {
        key,
        landing: landingName(event.landing_id),
        form: event.form_name,
        path: event.form_path || "",
        starts: 0,
        steps: 0,
        leads: 0,
      };
    }
    if (event.event === "form_start") groups[key].starts += 1;
    if (event.event === "form_step") groups[key].steps += 1;
    if (event.event === "generate_lead") groups[key].leads += 1;
    return groups;
  }, {}));

  const recent = events.slice(-8).reverse();

  function clearLog() {
    localStorage.removeItem(KEY);
    setEvents([]);
  }

  return (
    <div className="ds-campaign">
      <SectionTitle
        title="Campaign dashboard"
        aside={<button type="button" className="ds-campaign-clear" onClick={clearLog}>Clear this browser</button>}
      />
      <p className="ds-campaign-lead">
        Marketing source and form activity for the three landing pages. Each event is sent to Tag Manager and on through the Google tag to GA4. This page shows the same events recorded in this browser. Email, phone, and form answers stay in the sheet, not in these events.
      </p>

      <div className="ds-campaign-stats">
        <Stat label="Landing views" value={views} />
        <Stat label="Form starts" value={starts} />
        <Stat label="Leads" value={leads} />
        <Stat label="Lead rate" value={rate(leads, views)} />
        <Stat label="SMS opt in" value={optIns} />
        <Stat label="SMS skip" value={optOuts} />
      </div>

      <h5 className="ds-campaign-heading">Landings</h5>
      <div className="ds-campaign-landings">
        {LANDINGS.map((landing) => {
          const landingViews = tally(events, "landing_view", landing.id);
          const landingStarts = tally(events, "form_start", landing.id);
          const landingLeads = tally(events, "generate_lead", landing.id);
          return (
            <article className="ds-campaign-landing" key={landing.id}>
              <h6>{landing.name}</h6>
              <p>{landingViews} views · {landingStarts} starts · {landingLeads} leads · {rate(landingLeads, landingViews)} lead rate</p>
              <Funnel views={landingViews} starts={landingStarts} leads={landingLeads} />
              <a href={landing.href}>Open with a sample campaign link</a>
            </article>
          );
        })}
      </div>

      <h5 className="ds-campaign-heading">Marketing</h5>
      {marketing.length ? (
        <div className="ds-campaign-table-wrap">
          <table className="ds-campaign-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Medium</th>
                <th>Campaign</th>
                <th>Views</th>
                <th>Leads</th>
                <th>Lead rate</th>
              </tr>
            </thead>
            <tbody>
              {marketing.map((row) => (
                <tr key={row.key}>
                  <td>{row.source}</td>
                  <td>{row.medium}</td>
                  <td>{row.campaign}</td>
                  <td>{row.views}</td>
                  <td>{row.leads}</td>
                  <td>{rate(row.leads, row.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="ds-campaign-empty">No campaign visits in this browser yet.</p>}

      <h5 className="ds-campaign-heading">Forms</h5>
      {forms.length ? (
        <div className="ds-campaign-table-wrap">
          <table className="ds-campaign-table">
            <thead>
              <tr>
                <th>Landing</th>
                <th>Form</th>
                <th>Path</th>
                <th>Starts</th>
                <th>Steps</th>
                <th>Leads</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((row) => (
                <tr key={row.key}>
                  <td>{row.landing}</td>
                  <td>{row.form}</td>
                  <td>{row.path || "—"}</td>
                  <td>{row.starts}</td>
                  <td>{row.steps}</td>
                  <td>{row.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="ds-campaign-empty">No form events in this browser yet.</p>}

      <h5 className="ds-campaign-heading">Latest events</h5>
      {recent.length ? (
        <ul className="ds-campaign-log">
          {recent.map((event, index) => (
            <li key={`${event.sent_at}-${index}`}>
              <strong>{event.event}</strong>
              <span>{event.landing_name}</span>
              <span>{[event.source, event.medium, event.campaign].filter(Boolean).join(" / ")}</span>
            </li>
          ))}
        </ul>
      ) : <p className="ds-campaign-empty">Open one of the landing links above, then come back.</p>}

      <h5 className="ds-campaign-heading">Events sent to Tag Manager</h5>
      <ul className="ds-campaign-events">
        {EVENTS.map(([name, detail]) => (
          <li key={name}><code>{name}</code> {detail}</li>
        ))}
      </ul>
      <p className="ds-campaign-note">
        Parameters on every event: landing_name, landing_id, form_name, source, medium, campaign. Steps also send form_step and form_step_name. The injury paths send form_path. The Google tag already forwards gtag events. A second GA4 Event tag for these same names will count each one twice.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="ds-campaign-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Funnel({ views, starts, leads }) {
  const width = (value) => `${views ? Math.round((value / views) * 100) : 0}%`;
  const rows = [
    ["Views", views, views ? "100%" : "0%"],
    ["Starts", starts, width(starts)],
    ["Leads", leads, width(leads)],
  ];
  return (
    <div className="ds-campaign-funnel">
      {rows.map(([label, value, bar]) => (
        <div key={label}>
          <span>{label}</span>
          <i><b style={{ width: bar }} /></i>
          <em>{value}</em>
        </div>
      ))}
    </div>
  );
}

export default CampaignDashboard;
