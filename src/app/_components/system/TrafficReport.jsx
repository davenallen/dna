"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@library/visit";

const ROWS = [
  {
    id: "direct",
    source: "(direct)",
    medium: "(none)",
    arrived: "No campaign on the landing URL, and no referrer.",
  },
  {
    id: "copy",
    source: "copy_link",
    medium: "page_share",
    arrived: "Copy link on this site. The shared URL carries utm_source=copy_link and utm_medium=page_share.",
  },
  {
    id: "adobe",
    source: "new.express.adobe.com",
    medium: "referral",
    arrived: "The visit came from Adobe Express. GA recorded the referrer. The link had no UTM.",
  },
  {
    id: "ig",
    source: "ig",
    medium: "social",
    arrived: "A link tagged utm_source=ig and utm_medium=social. This site's Instagram share button would read instagram / page_share.",
  },
];

const DIMENSIONS = [
  { id: "source_medium", label: "Source / medium" },
  { id: "source", label: "Source" },
  { id: "medium", label: "Medium" },
];

function rowLabel(row, dimension) {
  if (dimension === "source") return row.source;
  if (dimension === "medium") return row.medium;
  return `${row.source} / ${row.medium}`;
}

export function TrafficReport() {
  const rootRef = useRef(null);
  const viewed = useRef(false);
  const [dimension, setDimension] = useState("source_medium");
  const [narrow, setNarrow] = useState(false);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const apply = () => setNarrow(node.clientWidth < 900);
    apply();
    const resize = new ResizeObserver(apply);
    resize.observe(node);
    const onScreen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || viewed.current) return;
      viewed.current = true;
      track("report_view", {
        module: "traffic",
        view: node.clientWidth < 900 ? "cards" : "table",
      });
    }, { threshold: 0.2 });
    onScreen.observe(node);
    return () => {
      resize.disconnect();
      onScreen.disconnect();
    };
  }, []);

  function chooseDimension(next) {
    setDimension(next);
    track("report_dimension", { module: "traffic", dimension: next });
  }

  function chooseRow(row) {
    setSelected(row.id);
    track("report_select", { module: "traffic", source: row.source, medium: row.medium });
  }

  const active = ROWS.find((row) => row.id === selected);
  const heading = DIMENSIONS.find((item) => item.id === dimension).label;

  return (
    <div className="ds-offer ds-traffic" ref={rootRef}>
      <p className="ds-traffic-kicker">Session information</p>
      <div className="ds-offer-tabs" role="tablist" aria-label="Report dimension">
        {DIMENSIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ds-offer-tab"
            role="tab"
            aria-selected={dimension === item.id}
            onClick={() => chooseDimension(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {narrow ? (
        <div className="ds-traffic-cards">
          {ROWS.map((row) => (
            <button
              key={row.id}
              type="button"
              className={`ds-traffic-card${selected === row.id ? " is-selected" : ""}`}
              aria-pressed={selected === row.id}
              onClick={() => chooseRow(row)}
            >
              <span className="ds-traffic-label">{heading}</span>
              <span className="ds-traffic-value">{rowLabel(row, dimension)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="ds-traffic-table-wrap">
          <table className="ds-traffic-table">
            <thead>
              <tr>
                <th scope="col">{heading}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.id} className={selected === row.id ? "is-selected" : undefined}>
                  <td>
                    <button type="button" onClick={() => chooseRow(row)} aria-pressed={selected === row.id}>
                      {rowLabel(row, dimension)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="ds-traffic-note">
        {active ? active.arrived : "Select a source to see how that visit arrived."}
      </p>
      <p className="ds-traffic-caption">
        These sources are already in the property. Session counts stay in GA.
      </p>
    </div>
  );
}

export default TrafficReport;
