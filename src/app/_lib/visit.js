const VISIT_KEY = "dna-visit";
const LOG_KEY = "dna-visit-log";
const LOG_LIMIT = 40;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

let memoryVisit = null;
let memoryLog = [];

function readStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be blocked; the in-memory copy still covers this page */
  }
}

function sessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function captureVisit() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  UTM_KEYS.forEach((key) => {
    utm[key] = (params.get(key) || "").trim();
  });
  const gclid = (params.get("gclid") || "").trim();
  const fbclid = (params.get("fbclid") || "").trim();
  const clickId = gclid || fbclid;

  return {
    source: utm.utm_source || "direct",
    medium: utm.utm_medium,
    campaign: utm.utm_campaign,
    content: utm.utm_content,
    term: utm.utm_term,
    click_id: clickId,
    click_type: gclid ? "gclid" : fbclid ? "fbclid" : "",
    landing_path: window.location.pathname,
    referrer: document.referrer || "",
    session_id: sessionId(),
  };
}

export function ensureVisit() {
  if (typeof window === "undefined") return null;
  if (memoryVisit) return memoryVisit;
  const stored = readStorage(VISIT_KEY);
  memoryVisit = stored || captureVisit();
  if (!stored) writeStorage(VISIT_KEY, memoryVisit);
  return memoryVisit;
}

export function getLog() {
  if (typeof window === "undefined") return [];
  const stored = readStorage(LOG_KEY);
  if (Array.isArray(stored)) memoryLog = stored;
  return memoryLog;
}

function remember(entry) {
  const log = getLog().concat(entry).slice(-LOG_LIMIT);
  memoryLog = log;
  writeStorage(LOG_KEY, log);
  window.dispatchEvent(new CustomEvent("dna-visit"));
}

function withVisit(params) {
  const visit = ensureVisit();
  const payload = {
    ...params,
    visit_source: visit.source,
    visit_medium: visit.medium,
    visit_campaign: visit.campaign,
    visit_content: visit.content,
    visit_term: visit.term,
    visit_click_id: visit.click_id,
    session_id: visit.session_id,
    landing_path: visit.landing_path,
  };
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value != null)
  );
}

export function track(name, params = {}) {
  if (typeof window === "undefined") return;
  const payload = withVisit(params);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
  // gtag.js only sends its own command queue. The plain push above is the record the panel shows.
  if (name !== "page_view" && typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
  remember({ name, time: Date.now(), params: payload });
}

export function trackOnce(key, name, params) {
  const storageKey = `dna-once-${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    /* if storage is blocked, the event can repeat on the next call */
  }
  track(name, params);
}
