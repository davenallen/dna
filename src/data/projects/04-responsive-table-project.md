---
#preview
title: Responsive Offer Table
image: /img/works/thumbnail/5-1.png
iframe: /iframes/responsive-table/index.html
module: offer-table
category: UI Elements
category_slug: ui-elements
masonrySize: horizontal
summary: Built a scalable, mobile-first pricing table for packages, bonuses, and retail pricing that marketing can reuse across product types.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> UI design + front-end implementation</p>
    <p><strong>Context:</strong> Buyers comparing packages on an offer page, on a desktop or a phone. Marketing needed one pricing table it could reuse across product types. I designed it and built it in HTML, CSS, and JavaScript.</p>
    <h5>The decision</h5>
    <p>A buyer comparing packages has to scan name, price, retail price, bonuses, and what is included, and still be able to do that on a phone.</p>
    <h5>Before</h5>
    <p class="dna-case-figure dna-case-figure--swap" tabindex="0">
      <span class="dna-case-figure-stack">
        <img src="/img/works/offer-table/before.png" alt="Before: three offer cards">
        <img class="dna-case-figure-hover" src="/img/works/offer-table/before-annotated.png" alt="" aria-hidden="true">
      </span>
    </p>
    <p>The old module was three cards with the same build: a plan name, a small divider icon, the price, a Limited Time Offer badge, an Included list of checked features, and an orange Sign Up Now button. The two bonus items are only labeled in text. Recreated here with generic packages and prices.</p>
    <ol>
      <li>Each card lists only what it includes, so to see what a higher package adds you have to compare the lists line by line across cards.</li>
      <li>Nothing marks a best value or shows savings. The bigger packages only show a bigger number.</li>
      <li>Every card repeats the same badge and the same button, so no package stands out.</li>
    </ol>
    <p class="dna-case-figure dna-case-figure--phone dna-case-figure--swap" tabindex="0">
      <span class="dna-case-figure-stack">
        <img src="/img/works/offer-table/before-mobile.png" alt="Before at phone width: the three cards stacked">
        <img class="dna-case-figure-hover" src="/img/works/offer-table/before-mobile-annotated.png" alt="" aria-hidden="true">
      </span>
    </p>
    <p><em>Phone width (390px), same callouts.</em></p>
    <h5>What I owned</h5>
    <ul>
      <li>The layout: a table on a wide screen, stacked cards on a narrow one, with the same package information in both.</li>
      <li>The hierarchy inside each package: a colored header with the name, the price, and the retail value under it. Bonus items carry a ★ BONUS tag, and every row shows a check or an × so each package contents can be compared line by line.</li>
      <li>The actions: one package is marked Best Value, and each package ends in its own Buy Now button.</li>
      <li>The JavaScript that chooses the table or the cards from the width. The switch happens below 900px, which is the breakpoint this UI already uses. A Cards / Table toggle can force either view at any width.</li>
    </ul>
    <h5>Built within the constraints</h5>
    <ul>
      <li>Plain HTML, CSS, and JavaScript. One list of packages renders both views, so the table and the cards cannot drift apart.</li>
      <li>No new breakpoint: the switch reuses the 900px one already in the UI.</li>
      <li>Concept to a delivered, previewable component took about three days.</li>
    </ul>
    <h5>Design system pieces</h5>
    <p>The live module is built from <a href="/system/">the system this site ships from</a>. Package headers, the Best Value pill, and the Buy Now button use that accent, those surfaces, and the shared button. A check and the bonus tag use the success color. An × uses the danger color. The patterns stay the package header, the bonus tag, the Best Value pill, the check or × row, and one action per package.</p>
    <h5>How someone else reuses it</h5>
    <p>A new product fills in packages, bonuses, and prices. The table, the cards, and the breakpoint stay. Operators do not commission a new layout for each offer.</p>
    <h5 id="react">Shipped</h5>
    <p>OfferTable takes the packages. Each package has a name, a price, a retail price, bonuses, and the features it includes. At 900px and wider the component renders a table. Below that it renders stacked cards. A new product is a new list of packages passed into the same component. The preview on this page uses this site system for type, color, surfaces, and the button.</p>
    <h5>After</h5>
    <p class="dna-case-figure dna-case-figure--swap" tabindex="0">
      <span class="dna-case-figure-stack">
        <img src="/img/works/offer-table/after.png" alt="After: the offer table at desktop width">
        <img class="dna-case-figure-hover" src="/img/works/offer-table/after-annotated.png" alt="" aria-hidden="true">
      </span>
    </p>
    <p>The same three packages in the offer table at desktop width:</p>
    <ol>
      <li>Check and × rows, plus ★ BONUS tags, show what each package adds.</li>
      <li>Package 3 carries a Best Value pill, and every price sits above its retail value.</li>
      <li>Each package gets its own colored header and its own Buy Now button.</li>
    </ol>
    <p class="dna-case-figure dna-case-figure--phone dna-case-figure--swap" tabindex="0">
      <span class="dna-case-figure-stack">
        <img src="/img/works/offer-table/after-mobile.png" alt="After at phone width: the same packages as stacked cards">
        <img class="dna-case-figure-hover" src="/img/works/offer-table/after-mobile-annotated.png" alt="" aria-hidden="true">
      </span>
    </p>
    <p><em>Phone width (390px), same callouts. Below 900px, the same list of packages renders as stacked cards.</em></p>
    <h5>On the offer page</h5>
    <!--shots-->
    <h5>What I would do next</h5>
    <p>Run a few moderated sessions with buyers on phones to check that comparing packages in the card view is as quick as in the table.</p>
    <p><em>Skills demonstrated:</em> Responsive design, front-end implementation, component design, marketing operations.</p>

details:
  title: Project snapshot
  items:
    - label: Role
      value: UI + front-end

    - label: Stack
      value: HTML, CSS, JavaScript

    - label: Focus
      value: Responsive pricing UI

    - label: Timeline
      value: ~3 days concept → delivery

    - label: Status
      value: Completed

carousel:
  - image: /img/works/offer-table/live-page.png
    alt: Full desktop offer page, from the header through the membership choices to the footer.
    caption: Full desktop page. Scroll inside the frame.
    fit: page

  - image: /img/works/offer-table/live-desktop.png
    alt: Desktop offer table with three memberships, a price, and a buy action on each.
    caption: Offer table on desktop.
    fit: module

  - image: /img/works/offer-table/live-mobile.png
    alt: Phone width, the same three memberships as stacked cards.
    caption: The same packages at a 390px phone width.
    fit: phone
---
