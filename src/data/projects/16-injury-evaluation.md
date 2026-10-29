---
#preview
title: Injury Evaluation Landing Page
category: Web
category_slug: web-templates
image: /img/works/original-size/16-injury.png
iframe: /iframes/injury/index.html
embed: true
uses:
  - 17-injury-form
summary: Three kinds of injury do not share one form. Pick a path, then answer one question at a time. The page is built to move completed evaluations by path.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Frontend and CRO</p>
    <p>An injury evaluation only helps if the person finishes it. A page that asks vehicle, personal injury, and workers' comp questions in one form makes every visitor answer questions that are not theirs. A ready person stalls. Someone who is unsure which kind of case they have never gets a clear first step.</p>
    <p>Open with one choice: vehicle, personal injury, or workers' comp. That choice stays on the page and opens only that path's questions, one at a time. Name, email, and phone come after the questions. The confirmation stays in the same frame.</p>
    <p>The outcome to move is a completed evaluation, read by path. A vehicle case, a personal injury, and a workers' comp case should be three rates, not one blended number.</p>
    <h5>The friction</h5>
    <p>The three cases do not share a first question. A vehicle path needs a police report. A personal injury path needs the status of the claim. Workers' comp needs the cause. One long form either asks the wrong question or hides the right one behind a name and a phone number.</p>
    <h5>The opportunity</h5>
    <p>Let the path choose the questions. A selection moves to the next question on that path. A written answer uses Next. ZIP, name, and contact are the last steps, and they are the same on every path. The result stays on the page.</p>
    <h5>How we measure it</h5>
    <ul>
      <li>lead_step with step 1 and the path. That is the choice: vehicle, personal, or work.</li>
      <li>Later lead_step events on that path. The step number shows where they left the questions.</li>
      <li>lead_complete, with the same path. That is the confirmation.</li>
    </ul>
    <p>Compare completion by path. This page is a sample, so the rate is named here and not published as a result. Form data is kept for demonstration purposes only and will not be sold or shared.</p>
    <!--below-->
    <h5>How someone else reuses it</h5>
    <p>Open <a href="/iframes/injury/index.html">the injury folder</a>. Edit campaign.js. The questions, the three paths, and the lines on the page are fields on that record. Leave the layout. The still on the work card uses the same 16:10 frame as the other Web landing pages. The session page is the <a href="/projects/13-signup-landing/">lead funnel landing page</a>. The briefing is the <a href="/projects/15-disability-benefits/">disability benefits landing page</a>.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Frontend + CRO

    - label: Stack
      value: HTML, CSS, JavaScript

    - label: Focus
      value: Completed evaluations

    - label: Status
      value: Sample
---
