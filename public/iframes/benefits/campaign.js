/* Disability benefits briefing.

   Same landing layout as the registration folder. This record is the copy.
   The page is a sample. It is not a government site, and it does not send the form.
*/

var campaign = {
  slug: "disability-benefits-briefing",
  name: "Disability benefits briefing",
  title: "Social Security disability benefits — a public briefing",
  brand: "Benefits briefing",
  brandNote: "Sample · Not a government site",
  eyebrow: "Public briefing",
  headline: "How Social Security disability benefits work.",
  subhead: "A 35-minute briefing on Disability Insurance: the work record, the medical review, and what happens after an application is filed.",
  disclaimer: "This is a sample page. It is not the Social Security Administration. It does not file a claim, review medical records, or decide who qualifies.",
  button: "Start the quiz",
  quizKicker: "Lead quiz (sample)",
  whenLabel: "Tuesday, November 10",
  timeLabel: "1:00 p.m. ET",
  length: "35 minutes",
  where: "The result stays on this page",
  starts: "20261110T180000Z",
  ends: "20261110T183500Z",
  calendarNote: "Sample briefing on Social Security disability benefits. The link stays in this browser.",
  checks: [
    "Disability Insurance and Supplemental Security Income, and why the names get mixed up.",
    "The work record an application asks about, in plain language.",
    "The kinds of medical records a review usually uses.",
    "What a person can expect after filing, including a first decision that is often a denial.",
    "Where the official rules are published, and what this briefing does not do."
  ],
  sections: {
    benefits: "What the briefing covers",
    agenda: "The 35 minutes",
    fit: "Who the briefing is for",
    faq: "Questions"
  },
  benefits: [
    {
      title: "The program",
      body: "Disability Insurance is federal insurance paid for by payroll taxes. It is not Supplemental Security Income, and it is not a medical diagnosis."
    },
    {
      title: "The application",
      body: "What a person is asked about work history, medical care, and the limits those conditions place on work."
    },
    {
      title: "The review",
      body: "How a claim moves from filing to a first decision, and why that first decision is often a denial."
    },
    {
      title: "The next step",
      body: "Where to read the official rules. This briefing does not file a claim or match anyone with a representative."
    }
  ],
  agenda: [
    { time: "00:00", title: "The two programs", body: "Disability Insurance and Supplemental Security Income, and which questions belong to which program." },
    { time: "08:00", title: "Work and earnings", body: "The work test, described without a guess about any one person's eligibility." },
    { time: "16:00", title: "Medical evidence", body: "The kinds of records that usually matter, and who is expected to gather them." },
    { time: "24:00", title: "After filing", body: "The wait people ask about, and what can still be done while a decision is pending." },
    { time: "31:00", title: "Official sources", body: "Where the Social Security Administration publishes the rules this briefing is summarizing." }
  ],
  fit: [
    { title: "You want the rules first", body: "A plain-language map before a phone call with an agency or a representative." },
    { title: "You were told to apply", body: "What the form is asking, before you sit down with it." },
    { title: "You are helping family", body: "A shared outline of the process, without a promise about the outcome." },
    { title: "You are comparing pages", body: "This sample stays on the briefing. It does not sell a claim review." }
  ],
  faqs: [
    {
      q: "Is this the Social Security Administration?",
      a: "No. This is a sample briefing page. The agency publishes the program rules on its own website."
    },
    {
      q: "Will this tell me if I qualify?",
      a: "No. Eligibility depends on a work record and a medical finding. This page does not review a claim."
    },
    {
      q: "Where do the answers go?",
      a: "Form data is kept for demonstration purposes only and will not be sold or shared."
    },
    {
      q: "Do you keep the phone number?",
      a: "Form data is kept for demonstration purposes only and will not be sold or shared."
    },
    {
      q: "Is this legal advice?",
      a: "No. It is a public explanation of a federal program. It is not a filing service."
    }
  ],
  closeHeadline: "Start with the quiz.",
  closeLede: "The same questions as the lead quiz. One at a time, then a sample result on this page.",
  footer: "Sample briefing page. Not affiliated with the Social Security Administration. David N. Allen.",
  contactPrompt: "Where should the result go?",
  contactHint: "Form data is kept for demonstration purposes only and will not be sold or shared.",
  contactButton: "See the sample result",
  noteButton: "Continue",
  noteError: "Add a short note about the review.",
  resultTitle: "Sample result",
  resultNote: "This is where a live page would show the next step. Form data is kept for demonstration purposes only and will not be sold or shared.",
  restart: "Start over",
  quiz: [
    {
      id: "age",
      label: "Age range",
      prompt: "What is your age range?",
      choices: [
        { value: "under-49", label: "Under 49" },
        { value: "mid", label: "49 to 62" },
        { value: "over-62", label: "Over 62" }
      ]
    },
    {
      id: "enrolled",
      label: "Already in a program",
      prompt: "Are you already in a similar program?",
      choices: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "working",
      label: "Working full time",
      prompt: "Are you working full time?",
      choices: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "advisor",
      label: "Working with an advisor",
      prompt: "Are you already working with an advisor?",
      choices: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "tenure",
      label: "Five of the last ten years",
      prompt: "Have you worked at least 5 of the last 10 years?",
      hint: "The years do not have to be in a row.",
      choices: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    {
      id: "focus",
      prompt: "What should the review focus on?",
      fieldLabel: "A sentence is enough",
      text: true
    }
  ]
};
