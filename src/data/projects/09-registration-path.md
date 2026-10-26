---
#preview
title: Registration Path
image: /img/works/original-size/9.jpg
cover: true
iframe: /iframes/registration/index.html
module: signup
module_grid: false
category: Web System
category_slug: web-system
summary: The production path from a campaign visit to a signup. The UTM stays intact through the redirect, and the dataLayer records the view and the completion. Shown here with a sample record.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Front-end and CRO</p>
    <p><strong>Context:</strong> Simpler Trading — membership and webinar registration. The behavior shipped. The page on this site uses a sample record.</p>
    <h5>Before</h5>
    <p>A campaign visit reached the registration page, then a redirect. The redirect dropped utm_source, utm_medium, and utm_campaign. The signup was recorded as direct. Paid and email traffic could not be told apart after the hop.</p>
    <h5>What changed</h5>
    <p>One helper reads those values on arrival, writes them onto the next URL, and puts the same values on the page view, the form start, the completed signup, and the SMS choice.</p>
    <h5>What that made possible</h5>
    <p>A new webinar reused the path. Marketing changed the offer and the destination. The handoff and the events stayed. Someone with the dashboard could compute signup rate by campaign. I owned the page, the test implementation, and the events. The conversion rate belonged to the company, and it is not mine to publish.</p>
    <h5>What the dashboard would show</h5>
    <ul>
      <li>Signup completion by campaign.</li>
      <li>Drop-off between the email step and the SMS choice.</li>
      <li>The share of signups whose source survived the redirect, against signups recorded as direct.</li>
    </ul>
    <h5>What I owned</h5>
    <ul>
      <li>The layout of the registration pages on that path.</li>
      <li>The helper, the redirect, and the dataLayer events above.</li>
      <li>The release, on the same weekly cadence as the rest of the frontend.</li>
    </ul>
    <h5>On this page</h5>
    <p>The email field is the form. After a valid email, the next step asks for an SMS 30 minutes before the session. Any phone number is accepted. Form data is kept for demonstration purposes only and will not be sold or shared. The visit line keeps source, medium, and campaign in view.</p>
    <h5>Design system pieces</h5>
    <p>The live module uses <a href="/system/">the system this site ships from</a>. The actions are the shared button. Type, accent, and the card surface come from the tokens. The preview uses a sample session.</p>
    <h5>How someone else reuses it</h5>
    <p>A new webinar or membership offer uses the same path. Marketing changes the offer and the destination. The redirect, the parameter handoff, and the events stay put. The calendar invite, the timed handoff, and the modules on the page come from one campaign record, written up as the <a href="/projects/10-campaign-launch-kit/">campaign launch kit</a>.</p>
    <h5 id="react">In React and Next.js</h5>
    <p>The path is a few routes that share one campaign helper. The helper reads the UTM on arrival, writes it onto the next URL when the page redirects, and puts the same values on each dataLayer push. The form is a component. The events fire from the page view, the first field interaction, and the success state. A new offer is a new route and a new destination, on that same helper.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Front-end + CRO

    - label: Employer
      value: Simpler Trading

    - label: Stack
      value: JavaScript, GTM, redirects

    - label: Focus
      value: Registration path

    - label: Status
      value: Production behavior, sample record
---
