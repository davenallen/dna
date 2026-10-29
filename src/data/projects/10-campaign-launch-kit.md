---
#preview
title: Campaign Launch Kit
image: /img/works/original-size/10.jpg
cover: true
iframe: /iframes/registration/index.html
module: campaign
module_grid: false
category: Web System
category_slug: web-system
summary: One campaign record drives the calendar invite, the timed redirects, and the modules on the page. A new live event is a new record. Shown here with a sample record.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Frontend</p>
    <p><strong>Context:</strong> Simpler Trading. After someone registers, the confirmation, the live URL, and the next webinar have to stay in agreement. This is that production behavior, rebuilt here with a sample record. Live offer URLs and internal campaign codes stay off this page.</p>
    <h5>The decision</h5>
    <p>One campaign record is the source of truth. The calendar invite, the moment the URL becomes the replay, and the moment the next webinar takes that URL all come from that record. A date that is not in the spec does not go on the page. A member who already owns a product can have that tier hidden.</p>
    <h5>What I owned</h5>
    <ul>
      <li>The campaign spec as the source of truth. A date, a slug, or a URL that is not in the spec does not go on the page.</li>
      <li>The redirect. Before the event, the URL is the registration page. After the replay time, that same URL sends people to the replay. At the handoff time, it sends them to the next webinar. A query flag holds the page for QA, and a tab left open rechecks the clock.</li>
      <li>The confirmation calendar. One config builds the Google Calendar link and the .ics file from the title, the time, and the bullets.</li>
      <li>The modules. The pricing matrix renders the desktop table and the phone cards from one object. The carousels fill from that campaign copy. A member who already owns a product can have that tier hidden.</li>
      <li>The intake and the preflight. Marketing fills the record. The pages ship after that checklist.</li>
    </ul>
    <h5>Design system pieces</h5>
    <p>The live module uses <a href="/system/">the system this site ships from</a>. The actions are the shared button. Type, accent, and the card surface come from the tokens. The preview uses a sample record. Live offer URLs and internal campaign codes stay off this page.</p>
    <h5>How someone else reuses it</h5>
    <p>Marketing fills the intake. The build copies the spec into one config block at the top of each script. The next webinar starts as a new spec. The visit itself is the <a href="/projects/09-registration-path/">registration path</a>: the UTM survives the redirect, and the dataLayer records the view and the signup for that same campaign.</p>
    <h5 id="react">Shipped</h5>
    <p>CampaignKit holds that list. Open the kit opens the first card. Choosing an action marks it on the card and does not leave the page. Skip, Close, and Ship the page end the set. The first card has nowhere to go but forward.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Frontend

    - label: Employer
      value: Simpler Trading

    - label: Stack
      value: React

    - label: Focus
      value: Campaign launch kit

    - label: Status
      value: Production behavior, sample record
---
