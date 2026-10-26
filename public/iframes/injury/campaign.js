/* Injury evaluation landing.

   Same kind of record as the registration and benefits folders.
   The page is a sample. It does not send the form.
*/

var whenOptions = [
  { value: "under-1", label: "Less than 1 year" },
  { value: "1-to-3", label: "1–3 years" },
  { value: "over-3", label: "More than 3 years" }
];

var claimOptions = [
  { value: "none", label: "No action taken yet" },
  { value: "demand", label: "Demand for compensation made" },
  { value: "filed", label: "Lawsuit filed" },
  { value: "other", label: "Other" }
];

var injuryOptions = [
  { value: "anxiety", label: "Anxiety" },
  { value: "back", label: "Back or neck pain" },
  { value: "bones", label: "Broken bones" },
  { value: "cuts", label: "Cuts and bruises" },
  { value: "headaches", label: "Headaches" },
  { value: "memory", label: "Memory loss" },
  { value: "limb", label: "Loss of limb" },
  { value: "other", label: "Other" }
];

var causeOptions = [
  { value: "accident", label: "Traumatic physical injury" },
  { value: "repeated", label: "Repeated trauma" },
  { value: "mental", label: "Mental injury" },
  { value: "disease", label: "Occupational disease" },
  { value: "unsure", label: "Not sure" }
];

var campaign = {
  slug: "injury-evaluation",
  title: "Injury evaluation",
  brand: "accidenthelpusa.com",
  brandNote: "Injury Evaluation",
  logo: "img/logo.svg",
  hero: "img/hero.jpg",
  headlineLead: "Get Top-dollar For",
  headline: "Vehicle, Personal, & Worker's Comp Injuries",
  subhead: "Have you been injured and it's not your fault? Get help now.",
  sampleNote: "Form data is kept for demonstration purposes only and will not be sold or shared.",
  sectionHow: "How it works",
  sectionHowLead: "Three short steps. The result stays on this page.",
  sectionGuide: "What to gather",
  sectionFaq: "Questions",
  footer: "Form data is kept for demonstration purposes only and will not be sold or shared.",
  doneTitle: "This is the data that was recorded",
  doneBody: "Form data is kept for demonstration purposes only and will not be sold or shared.",
  paths: [
    {
      id: "vehicle",
      nav: "Vehicle",
      label: "Auto Injury",
      steps: [
        { kind: "choice", name: "when", label: "How long ago did the incident happen?", options: whenOptions },
        { kind: "choice", name: "report", label: "Was a police report filed?", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
        { kind: "choice", name: "injury", label: "What is your primary injury?", options: injuryOptions },
        { kind: "note", name: "description", label: "Please briefly describe your injuries." },
        { kind: "zip", name: "zip", label: "Your ZIP code" },
        { kind: "name", label: "Your name" },
        { kind: "contact", label: "Email and phone" }
      ]
    },
    {
      id: "personal",
      nav: "Personal",
      label: "Personal Injury",
      steps: [
        { kind: "choice", name: "when", label: "How long ago did the incident happen?", options: whenOptions },
        { kind: "choice", name: "claim", label: "What is the status of the claim?", options: claimOptions },
        { kind: "choice", name: "injury", label: "What is your primary injury?", options: injuryOptions },
        { kind: "note", name: "description", label: "Please briefly describe your injuries." },
        { kind: "zip", name: "zip", label: "Your ZIP code" },
        { kind: "name", label: "Your name" },
        { kind: "contact", label: "Email and phone" }
      ]
    },
    {
      id: "work",
      nav: "Worker's Comp",
      label: "Worker's Comp",
      steps: [
        { kind: "choice", name: "when", label: "When did the incident occur?", options: whenOptions },
        { kind: "choice", name: "claim", label: "What is the status of the claim?", options: claimOptions },
        { kind: "choice", name: "injury", label: "What is your primary injury?", options: injuryOptions },
        { kind: "note", name: "description", label: "Please briefly describe your injuries." },
        { kind: "choice", name: "cause", label: "Cause of injury?", options: causeOptions },
        { kind: "zip", name: "zip", label: "Your ZIP code" },
        { kind: "name", label: "Your name" },
        { kind: "contact", label: "Email and phone" }
      ]
    }
  ],
  how: [
    { title: "Pick a path", body: "Vehicle, personal injury, or workers' comp. Each path asks its own short set of questions." },
    { title: "Answer one step", body: "A choice opens the next question. A written answer uses Next." },
    { title: "Stay on the page", body: "The last step shows a confirmation here. Form data is kept for demonstration purposes only and will not be sold or shared." }
  ],
  guide: [
    "The date of the incident, as closely as you remember it.",
    "Whether a report was filed, and with whom.",
    "The care you have already had, and the bills you still have.",
    "The names of the insurers already involved."
  ],
  faqs: [
    {
      q: "Where do the answers go?",
      a: "Form data is kept for demonstration purposes only and will not be sold or shared."
    },
    {
      q: "Is this a law firm?",
      a: "No. This is a sample of the landing page. It does not review a claim or match anyone with a representative."
    },
    {
      q: "Why are there three paths?",
      a: "A vehicle crash, a personal injury, and a workers' comp case do not ask the same first questions. The record in campaign.js holds each list."
    },
    {
      q: "How do I change the questions?",
      a: "Edit campaign.js. Leave index.html, landing.css, and landing.js."
    }
  ]
};
