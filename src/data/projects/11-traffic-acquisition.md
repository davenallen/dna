---
#preview
title: Session Information
module: traffic
category: Web System
category_slug: web-system
masonrySize: horizontal
summary: Session information in this site's system, using sources already recorded on the property. Session counts stay in GA.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Front-end</p>
    <p><strong>Context:</strong> This site. Session information redraws the sources in the GA4 report so they can sit with the other interface work.</p>
    <h5>The decision</h5>
    <p>Session information has to read in the same type and color as the rest of the site, and each row has to say how that visit arrived. The session totals stay in GA.</p>
    <h5>What I owned</h5>
    <ul>
      <li>The layout: a dimension switch, one row per source, and a note for the row you select.</li>
      <li>The rows already in the property: (direct) / (none), copy_link / page_share, new.express.adobe.com / referral, and ig / social.</li>
      <li>The switch between source / medium, source, and medium. The same rows render in each view. Below 900px they stack as cards.</li>
    </ul>
    <h5>Design system pieces</h5>
    <p>The live module uses <a href="/system/">the system this site ships from</a>. The dimension switch is the same pill control as the pricing periods. Type, accent, and surfaces come from the tokens.</p>
    <h5>How someone else reuses it</h5>
    <p>A new report passes a new list of sources. Each source is a source, a medium, and one sentence about how it arrived. The tabs, the table, and the note stay.</p>
    <h5 id="react">Shipped</h5>
    <p>TrafficReport takes those rows. Selecting a row explains the arrival. copy_link / page_share is this site's Copy link button. The Adobe row is a referrer with no UTM. ig / social is a tagged link, and it is not the Instagram share button on this site, which would read instagram / page_share. The production version of keeping a campaign on a path is the <a href="/projects/09-registration-path/">registration path</a>.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: Front-end

    - label: Surface
      value: This site

    - label: Stack
      value: React, GA4

    - label: Focus
      value: Session information

    - label: Status
      value: On this site
---
