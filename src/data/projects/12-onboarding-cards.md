---
#preview
title: Onboarding Cards
module: onboarding
module_grid: column
image: /img/works/original-size/12-onboard.png
category: UI Elements
category_slug: ui-elements
summary: The cards a new member sees after signup. One step at a time, a store pair in place of a button on the alerts card, and an exit only after the first card. Shown here with a generic membership.

#full details
description:
  title: Case study
  content: |
    <p><strong>Role:</strong> Frontend</p>
    <p><strong>Context:</strong> Simpler Trading. After someone joins or buys, a short set of cards points them at the schedule, alerts, the lists, and other media. This is that production behavior, rebuilt here with a generic membership. Names, room links, and the original art stay off this page.</p>
    <h5>The decision</h5>
    <p>A new member should see one next step, not a dashboard full of links. The first card has nowhere to go but forward. Later cards can go back, skip, or close. The last card is the way out.</p>
    <h5>What I owned</h5>
    <ul>
      <li>The card list: an eyebrow, a headline, a figure, the copy, and one action.</li>
      <li>The alerts card, which swaps that action for two store buttons.</li>
      <li>The chrome: Back, Skip, and Close stay hidden on the first card. The last card replaces Next with Go to the dashboard.</li>
    </ul>
    <h5>Design system pieces</h5>
    <p>The live module uses <a href="/system/">the system this site ships from</a>. The actions are the shared button. Type, accent, and the card surface come from the tokens. The preview uses a generic membership. Names, room links, and the original art stay off this page.</p>
    <h5>How someone else reuses it</h5>
    <p>A new membership passes a product name and a list of cards. A card is a headline, a sentence, and either one action or a pair of store buttons. The first-card lock and the last-card exit stay.</p>
    <h5 id="react">Shipped</h5>
    <p>OnboardingCards holds that list. Get started opens the first card. Choosing an action marks it on the card and does not leave the page. Skip, Close, and Go to the dashboard end the set. The same pattern of keeping a campaign attached to a path is the <a href="/projects/09-registration-path/">registration path</a>.</p>

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
      value: Post-signup cards

    - label: Status
      value: Production behavior, sample record
---
