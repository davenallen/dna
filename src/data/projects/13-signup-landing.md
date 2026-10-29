---
#preview
title: Lead Funnel Landing Page
category: Web
category_slug: web-templates
image: /img/works/original-size/13-signup.png
iframe: /iframes/registration/index.html
embed: true
uses:
  - 09-registration-path
  - 10-campaign-launch-kit
  - 12-onboarding-cards
summary: A live session only counts if someone reserves a seat. Email first, then one SMS reminder. The page is built to move signup completion and that choice.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Frontend and CRO</p>
    <p>A live session only produces a room if people reserve a seat. When the page leads with the full pitch and then asks for email, phone, and calendar together, the seat competes with the story. Ready visitors hunt for the form. Visitors who need a reason never get a clear next step.</p>
    <p>Ask for the email before the rest of the pitch. Keep the session time in the card. After the address, ask one question: an SMS 30 minutes before the session. Repeat that same form at the bottom for anyone who reads first. The pitch explains the session. The email is the action.</p>
    <p>The outcome to move is completed signups, then the share of those signups that take the reminder. Source, medium, and campaign stay on the confirmation, so the rate can be read by campaign.</p>
    <h5>The friction</h5>
    <p>The first screen has two jobs. The story is long enough that a ready visitor has to find the form. The form, once it appears, asks for more than a seat. Phone and calendar sit on the same step as the email, so someone who would have registered stops on a field they do not need yet.</p>
    <h5>The opportunity</h5>
    <p>Give each step one job. The email reserves the seat. The SMS is the next decision, after the signup exists. What the session covers, the agenda, who it is for, and the questions stay on the page for people who need a reason, and they end on the same form.</p>
    <h5>How we measure it</h5>
    <ul>
      <li>signup_view against signup_start, the first focus in the card. That shows whether the ask earned an attempt.</li>
      <li>signup_complete. That is the seat.</li>
      <li>reminder_optin against reminder_skip. That shows whether the second ask adds a reminder or adds drop-off.</li>
      <li>Source, medium, and campaign on the confirmation. Signup rate by campaign, rather than a pile of visits marked direct.</li>
    </ul>
    <p>This page is a sample, so the rate is named here and not published as a result. Form data is kept for demonstration purposes only and will not be sold or shared.</p>
    <!--below-->
    <h5>How someone else reuses it</h5>
    <p>Copy <a href="/iframes/registration/index.html">the registration folder</a>. Edit campaign.js: the headline, the time, the button, the agenda, and the calendar links. Leave the layout. A new session is a new record on the same page. The signup inside the site, on the <a href="/projects/09-registration-path/">registration path</a>, reads a record the same way. The <a href="/projects/10-campaign-launch-kit/">campaign launch kit</a> is that record for the calendar, the redirects, and the modules.</p>
    <h5 id="react">In React and Next.js</h5>
    <p>The page above is the standalone template. SignupLanding renders the same record inside the site. track() writes signup_view, signup_start, signup_complete, then reminder_view and either reminder_optin or reminder_skip. The visit stays attached. Form data is kept for demonstration purposes only and will not be sold or shared.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Frontend + CRO

    - label: Stack
      value: HTML, CSS, JavaScript

    - label: Focus
      value: Signup completion

    - label: Status
      value: Sample
---
