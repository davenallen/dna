/* Registration landing template.

   Copy this folder to start another page. Change this campaign object.
   Leave index.html, landing.css, and landing.js alone unless the layout itself should change.
   A new session is a new campaign: headline, time, button, reminder, agenda, and calendar dates.
*/

var campaign = {
  slug: "registration-landing-page",
  name: "Registration landing page",
  title: "Registration landing page — reserve a seat",
  // Header logo. Replace this file, or point mark at another image.
  mark: "/img/logo.png",
  eyebrow: "Live session",
  headline: "An impactful lead funnel - Live Session",
  subhead: "Reserve a seat with your email. Get an SMS reminder, add it to your calendar, and get an onboarding experience.",
  button: "Reserve a seat",
  note: "No account. One confirmation email.",
  timeLabel: "8:30 a.m. MT",
  length: "40 minutes",
  where: "Virtual Live Session",
  checks: [
    "One email. No account to create.",
    "An SMS 30 minutes before, if you want one.",
    "A calendar invite built from the date on this page.",
    "An onboarding experience for the live session.",
    "The replay, after the live hour, to registered addresses."
  ],
  remind: {
    headline: "Want an SMS 30 minutes before?",
    lede: "One message before the session starts.",
    label: "Mobile number",
    placeholder: "(303) 555-0100",
    button: "Send me an SMS",
    skip: "No thanks",
    note: "Form data is kept for demonstration purposes only and will not be sold or shared.",
    empty: "Enter a phone number."
  },
  sections: {
    benefits: "What the campaign covers",
    agenda: "Email, SMS, calendar, onboarding, and replay",
    fit: "Who's it is for",
    faq: "Questions"
  },
  benefits: [
    {
      title: "The email",
      body: "Signup confirmation and the session link."
    },
    {
      title: "The reminders",
      body: "A 30 minutes SMS and calendar invite before the session starts."
    },
    {
      title: "The assets",
      body: "Onboarding and followup materials for the live session."
    },
    {
      title: "The replay",
      body: "The session replay goes to the same address you register with."
    }
  ],
  agenda: [
    { time: "1", title: "Build a list of opportunities", body: "Recieve analytical and form data." },
    { time: "2", title: "Analyze the data", body: "Examine the information collected and make decisions." },
    { time: "3", title: "Promote the session", body: "Teach more about the upcoming live session." },
    { time: "4", title: "Onboard attendees", body: "Provide a seamless experience for registered participants." },
    { time: "5", title: "Keep track", body: "Recognize registered attendees and show time-based updates." }
  ],
  fit: [
    { title: "You have a live session", body: "Get people signed up to see important updates." },
    { title: "You want to be sure", body: "Get an SMS reminder or add it to your calendar." },
    { title: "You want to add value", body: "Onboarding materials and followup resources." },
    { title: "You want to show more", body: "After the event, a redirect to a replay or secondary page is automatic." }
  ],
  faqs: [
    {
      q: "What do I need?",
      a: "An email address. The session link arrives there."
    },
    {
      q: "Is there a replay?",
      a: "Yes. Registered addresses receive it after the live hour."
    },
    {
      q: "Where does this sample send the address?",
      a: "Form data is kept for demonstration purposes only and will not be sold or shared."
    },
    {
      q: "Do you keep the phone number?",
      a: "Form data is kept for demonstration purposes only and will not be sold or shared."
    }
  ],
  closeLede: "8:30 a.m. MT. — Registration is free. One confirmation email. An SMS reminder if you want one.",
  footer: "David N. Allen — Sample registration page."
};

// The invite and the date on the page stay 3 days ahead, at 8:30 a.m. MT for 40 minutes.
(function scheduleSession() {
  var timeZone = "America/Denver";

  function zoneOffsetMinutes(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).formatToParts(date);
    var map = {};
    parts.forEach(function (part) {
      if (part.type !== "literal") map[part.type] = part.value;
    });
    var asUtc = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour % 24, +map.minute, +map.second);
    return (asUtc - date.getTime()) / 60000;
  }

  function zonedDate(year, month, day, hour, minute) {
    var utc = Date.UTC(year, month - 1, day, hour, minute, 0);
    var i;
    for (i = 0; i < 2; i += 1) {
      utc = Date.UTC(year, month - 1, day, hour, minute, 0) - zoneOffsetMinutes(new Date(utc)) * 60000;
    }
    return new Date(utc);
  }

  function stamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  var nowParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  var map = {};
  nowParts.forEach(function (part) {
    if (part.type !== "literal") map[part.type] = part.value;
  });
  var start = zonedDate(+map.year, +map.month, +map.day + 3, 8, 30);
  var end = new Date(start.getTime() + 40 * 60000);
  campaign.whenLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(start);
  campaign.starts = stamp(start);
  campaign.ends = stamp(end);
  campaign.closeHeadline = "Save a seat for " + campaign.whenLabel + ".";
})();
