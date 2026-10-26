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
summary: A standalone registration page. Copy the folder, change the campaign record, and the next landing page is the same layout.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Front-end and CRO</p>
    <p><strong>Context:</strong> A sample page, built to show a second landing-page pattern beside the sales page. It opens on its own, the way the other previews in /iframes/ do.</p>
    <h5>The decision</h5>
    <p>The page asks for an email before the rest of the pitch. After that address, it asks for an SMS 30 minutes before the session. The session time sits in the form card, and the same form returns at the bottom.</p>
    <h5>What I owned</h5>
    <ul>
      <li>The layout: a split hero, the promise, what the session covers, the agenda, who it is for, questions, and the form again.</li>
      <li>The registration path on that form. Source, medium, and campaign stay on the confirmation. The dataLayer records the view, the first focus, the signup, and the reminder choice. Form data is kept for demonstration purposes only and will not be sold or shared.</li>
      <li>The campaign record in campaign.js. The headline, the time, the button, the agenda, and the calendar links are fields on that object.</li>
    </ul>
    <h5>How someone else reuses it</h5>
    <p>Copy <a href="/iframes/registration/index.html">the registration folder</a>. Edit campaign.js. Leave the layout. A new session is a new record, on the same page. The signup inside the site, on the <a href="/projects/09-registration-path/">registration path</a>, reads a record the same way. The <a href="/projects/10-campaign-launch-kit/">campaign launch kit</a> is that record for the calendar, the redirects, and the modules.</p>
    <h5 id="react">In React and Next.js</h5>
    <p>The page above is the standalone template. SignupLanding is the same kind of record rendered inside the site. Form data is kept for demonstration purposes only and will not be sold or shared. track() writes signup_view, signup_start, signup_complete, then reminder_view and either reminder_optin or reminder_skip. The visit stays attached.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Front-end + CRO

    - label: Stack
      value: HTML, CSS, JavaScript

    - label: Focus
      value: Email signup

    - label: Status
      value: Sample
---
