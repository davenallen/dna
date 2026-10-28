/* Shared landing events for GTM and GA4.

   Pushes one dataLayer record and, when Tag Manager has installed gtag,
   sends that same event through it. Does not load a second measurement ID.
   Form answers, email, and phone stay out of these events. */
(function () {
  var KEY = "dna-campaign-events";
  var LIMIT = 500;
  var RENAMES = {
    signup_view: "landing_view",
    lead_view: "landing_view",
    signup_start: "form_start",
    signup_complete: "generate_lead",
    lead_complete: "generate_lead",
    lead_step: "form_step",
    reminder_view: "form_step",
    reminder_optin: "reminder_opt_in",
    reminder_skip: "reminder_opt_out",
    onboarding_view: "form_step",
    onboarding_open: "form_step",
    onboarding_step: "form_step",
    onboarding_finish: "form_step"
  };
  var STATUS = {
    landing_view: "viewed",
    form_start: "started",
    form_step: "started",
    generate_lead: "completed",
    reminder_opt_in: "opted_in",
    reminder_opt_out: "opted_out"
  };
  var FIELDS = [
    "landing_name",
    "landing_id",
    "form_name",
    "form_step",
    "form_step_name",
    "form_path",
    "lead_status",
    "source",
    "medium",
    "campaign",
    "content",
    "term",
    "page_path",
    "sent_at"
  ];

  function read() {
    try {
      var parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function visit() {
    var params = new URLSearchParams(window.location.search);
    return {
      source: (params.get("utm_source") || "direct").trim() || "direct",
      medium: (params.get("utm_medium") || "(none)").trim() || "(none)",
      campaign: (params.get("utm_campaign") || "(not set)").trim() || "(not set)",
      content: (params.get("utm_content") || "").trim(),
      term: (params.get("utm_term") || "").trim()
    };
  }

  window.dnaCampaignEvent = function (name, fields) {
    var eventName = RENAMES[name] || name;
    var incoming = fields || {};
    var traffic = visit();
    var data = {
      event: eventName,
      landing_name: incoming.landing_name || "",
      landing_id: incoming.landing_id || "",
      form_name: incoming.form_name || "",
      form_step: incoming.form_step == null ? "" : incoming.form_step,
      form_step_name: incoming.form_step_name || "",
      form_path: incoming.form_path || "",
      lead_status: incoming.lead_status || STATUS[eventName] || "",
      source: traffic.source,
      medium: traffic.medium,
      campaign: traffic.campaign,
      content: traffic.content,
      term: traffic.term,
      page_path: window.location.pathname,
      sent_at: new Date().toISOString()
    };
    Object.keys(data).forEach(function (key) {
      if (data[key] === "" || data[key] == null) delete data[key];
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    if (typeof window.gtag === "function") {
      var params = {};
      FIELDS.forEach(function (key) {
        if (data[key] != null && data[key] !== "") params[key] = data[key];
      });
      window.gtag("event", eventName, params);
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(read().concat([data]).slice(-LIMIT)));
    } catch (error) {
      /* the dataLayer push still reaches Tag Manager when storage is blocked */
    }
    return data;
  };

  window.dnaCampaignEvents = function () {
    return read();
  };
}());
