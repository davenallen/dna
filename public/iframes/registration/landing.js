(function () {
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var email = "";
  var phone = "";
  var recorded = [];
  var started = false;
  var phase = "email";
  var onboardIndex = 0;
  var onboardOpen = false;
  var onboardDone = false;
  var onboardPicked = "";
  var onboardViewed = false;
  var ONBOARD_CARDS = [
    {
      id: "sessions",
      eyebrow: "Live Session",
      title: "What the live sessions cover",
      body: "Sessions run on a set schedule. The room is where the day's work and the reasoning are walked through.",
      action: "View the schedule"
    },
    {
      id: "alerts",
      eyebrow: "Get our App",
      title: "Don't miss the alerts",
      body: "Alerts go to the app during market hours.",
      stores: ["App Store", "Google Play"]
    },
    {
      id: "recordings",
      eyebrow: "Registered members",
      title: "Watch the recordings",
      body: "The archive keeps the live sessions, so a missed day can be watched later.",
      action: "Open the recordings"
    },
    {
      id: "overview",
      eyebrow: "Live Session",
      title: "See how the approach works",
      body: "A short overview of the method sits with the rest of the session.",
      action: "View the overview"
    }
  ];

  function nodes(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function fillText(field, value) {
    nodes('[data-field="' + field + '"]').forEach(function (node) {
      if (node.tagName === "IMG") {
        if (value) {
          node.src = value;
          node.alt = campaign.name || "";
          node.hidden = false;
        } else {
          node.removeAttribute("src");
          node.alt = "";
          node.hidden = true;
        }
        return;
      }
      node.textContent = value || "";
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function hideSection(name, empty) {
    var section = document.querySelector('[data-section="' + name + '"]');
    if (section) section.hidden = empty;
  }

  function fillLists() {
    var checks = nodes('[data-list="checks"]');
    checks.forEach(function (list) {
      list.textContent = "";
      (campaign.checks || []).forEach(function (item) {
        list.appendChild(el("li", "", item));
      });
    });

    var benefits = nodes('[data-list="benefits"]');
    benefits.forEach(function (list) {
      list.textContent = "";
      (campaign.benefits || []).forEach(function (item) {
        var card = el("article");
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        list.appendChild(card);
      });
    });
    hideSection("benefits", !(campaign.benefits || []).length);

    var agenda = nodes('[data-list="agenda"]');
    agenda.forEach(function (list) {
      list.textContent = "";
      (campaign.agenda || []).forEach(function (item) {
        var row = el("li");
        var time = el("time", "", item.time);
        time.dateTime = item.time;
        var copy = el("div");
        copy.appendChild(el("h3", "", item.title));
        copy.appendChild(el("p", "", item.body));
        row.appendChild(time);
        row.appendChild(copy);
        list.appendChild(row);
      });
    });
    hideSection("agenda", !(campaign.agenda || []).length);

    var fit = nodes('[data-list="fit"]');
    fit.forEach(function (list) {
      list.textContent = "";
      (campaign.fit || []).forEach(function (item) {
        var card = el("article");
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        list.appendChild(card);
      });
    });
    hideSection("fit", !(campaign.fit || []).length);

    var faqs = nodes('[data-list="faqs"]');
    faqs.forEach(function (list) {
      list.textContent = "";
      (campaign.faqs || []).forEach(function (item, index) {
        var details = document.createElement("details");
        if (index === 0) details.open = true;
        var summary = el("summary", "", item.q);
        details.appendChild(summary);
        details.appendChild(el("p", "", item.a));
        list.appendChild(details);
      });
    });
    hideSection("faq", !(campaign.faqs || []).length);
  }

  function visitLine() {
    var params = new URLSearchParams(window.location.search);
    var source = (params.get("utm_source") || "direct").trim() || "direct";
    var medium = (params.get("utm_medium") || "none").trim() || "none";
    var name = (params.get("utm_campaign") || "none").trim() || "none";
    return source + " / " + medium + " / " + name;
  }

  function payload(name) {
    var params = new URLSearchParams(window.location.search);
    var data = {
      event: name,
      module: "registration-landing",
      campaign: campaign.slug,
      visit_source: (params.get("utm_source") || "direct").trim() || "direct",
      visit_medium: (params.get("utm_medium") || "").trim(),
      visit_campaign: (params.get("utm_campaign") || "").trim()
    };
    Object.keys(data).forEach(function (key) {
      if (data[key] === "") delete data[key];
    });
    return data;
  }

  function track(name, extra) {
    var data = payload(name);
    if (extra) {
      Object.keys(extra).forEach(function (key) {
        if (extra[key] === "" || extra[key] == null) return;
        data[key] = extra[key];
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    if (typeof window.gtag === "function") {
      window.gtag("event", name, data);
    }
  }

  function calendarUrl() {
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: campaign.name,
      dates: campaign.starts + "/" + campaign.ends,
      details: "Sample session. The link arrives in the confirmation email."
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function downloadIcs() {
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//David N Allen//Registration Landing//EN",
      "BEGIN:VEVENT",
      "DTSTART:" + campaign.starts,
      "DTEND:" + campaign.ends,
      "SUMMARY:" + campaign.name,
      "DESCRIPTION:Sample session. The link arrives in the confirmation email.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = campaign.slug + ".ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function paint() {
    nodes(".lead-form").forEach(function (form) {
      form.hidden = phase !== "email";
      var input = form.querySelector("input");
      if (input && input.value !== email) input.value = email;
      var error = form.querySelector(".form-error");
      if (error) error.hidden = true;
    });
    nodes(".remind-form").forEach(function (form) {
      form.hidden = phase !== "remind";
      var input = form.querySelector("input");
      if (input && input.value !== phone) input.value = phone;
      var error = form.querySelector(".form-error");
      if (error) error.hidden = true;
    });
    nodes(".done").forEach(function (panel) {
      panel.hidden = phase !== "done";
    });
    if (phase !== "done") return;
    nodes(".done-email").forEach(function (node) {
      node.textContent = email + " is on the list for " + campaign.name + ".";
    });
    nodes(".done-list").forEach(function (list) {
      list.textContent = "";
      recorded.forEach(function (row) {
        var item = document.createElement("li");
        item.textContent = row;
        list.appendChild(item);
      });
    });
    nodes(".done-note").forEach(function (node) {
      node.textContent = "Form data is kept for demonstration purposes only and will not be sold or shared. This sample still has " + visitLine() + " attached.";
    });
    nodes("[data-calendar]").forEach(function (node) {
      node.href = calendarUrl();
    });
    paintOnboard();
  }

  function onboardButton(className, label) {
    var button = el("button", className, label);
    button.type = "button";
    return button;
  }

  function paintOnboard() {
    nodes("[data-onboard]").forEach(function (root) {
      root.textContent = "";
      if (phase !== "done") return;
      if (!onboardOpen) {
        var idle = el("div", "onboard-idle");
        idle.appendChild(el("p", "onboard-lead", onboardDone
          ? "You're set. The next page would be the dashboard."
          : "A new member of the membership starts here."));
        var again = onboardButton("button", onboardDone ? "See the cards again" : "Get started");
        again.addEventListener("click", function () { startOnboarding(again); });
        idle.appendChild(again);
        root.appendChild(idle);
        return;
      }

      var card = ONBOARD_CARDS[onboardIndex];
      var last = onboardIndex === ONBOARD_CARDS.length - 1;
      var panel = el("div", "onboard-card");
      if (onboardIndex > 0) {
        var close = onboardButton("onboard-close", "×");
        close.setAttribute("aria-label", "Close");
        close.addEventListener("click", function () { finishOnboard("close"); });
        panel.appendChild(close);
      }
      var thanks = el("p", "onboard-thanks");
      thanks.appendChild(document.createTextNode("Thank you for signing up for the"));
      thanks.appendChild(el("strong", "", "the live session"));
      panel.appendChild(thanks);

      var nav = el("div", "onboard-nav");
      if (onboardIndex > 0) {
        var back = onboardButton("onboard-arrow", "Back");
        back.addEventListener("click", function () { goOnboard(onboardIndex - 1); });
        nav.appendChild(back);
      } else {
        nav.appendChild(el("span"));
      }
      if (last) {
        var dash = onboardButton("button", "Finished");
        dash.addEventListener("click", function () { finishOnboard("dashboard"); });
        nav.appendChild(dash);
      } else {
        var next = onboardButton("onboard-arrow", "Next");
        next.addEventListener("click", function () { goOnboard(onboardIndex + 1); });
        nav.appendChild(next);
      }
      panel.appendChild(nav);
      panel.appendChild(el("p", "onboard-eyebrow", card.eyebrow));
      panel.appendChild(el("h3", "onboard-title", card.title));
      panel.appendChild(el("div", "onboard-figure", (onboardIndex + 1) + " / " + ONBOARD_CARDS.length));
      panel.appendChild(el("p", "onboard-body", card.body));

      if (card.stores) {
        var stores = el("div", "onboard-stores");
        card.stores.forEach(function (label) {
          var store = onboardButton("button button-ghost", label);
          store.addEventListener("click", function () { pickOnboard(label); });
          stores.appendChild(store);
        });
        panel.appendChild(stores);
      } else {
        var action = onboardButton("button", card.action);
        action.addEventListener("click", function () { pickOnboard(card.action); });
        panel.appendChild(action);
      }

      if (onboardPicked) {
        panel.appendChild(el("p", "onboard-picked", onboardPicked + " stays on this card. It does not leave the page."));
      }
      if (onboardIndex > 0) {
        var skip = onboardButton("onboard-skip", "Skip and continue");
        skip.addEventListener("click", function () { finishOnboard("skip"); });
        panel.appendChild(skip);
      }
      root.appendChild(panel);
    });
  }

  function startOnboarding(origin) {
    onboardOpen = true;
    onboardDone = false;
    onboardPicked = "";
    onboardIndex = 0;
    if (!onboardViewed) {
      onboardViewed = true;
      track("onboarding_view", { module: "onboarding" });
    }
    track("onboarding_open", { module: "onboarding" });
    paint();
    var card = origin && origin.closest ? origin.closest(".card") : null;
    var target = card ? card.querySelector("[data-onboard]") : document.querySelector("[data-onboard]");
    if (target) target.scrollIntoView({ block: "nearest" });
    report();
  }

  function goOnboard(next) {
    var clamped = Math.max(0, Math.min(ONBOARD_CARDS.length - 1, next));
    onboardPicked = "";
    onboardIndex = clamped;
    track("onboarding_step", { module: "onboarding", step: clamped + 1, card: ONBOARD_CARDS[clamped].id });
    paintOnboard();
    report();
  }

  function pickOnboard(choice) {
    var card = ONBOARD_CARDS[onboardIndex];
    onboardPicked = choice;
    track("onboarding_step", { module: "onboarding", step: onboardIndex + 1, card: card.id, choice: choice });
    paintOnboard();
  }

  function finishOnboard(how) {
    onboardOpen = false;
    onboardDone = true;
    track("onboarding_finish", { module: "onboarding", how: how });
    paintOnboard();
    report();
  }

  function enterDone(origin) {
    phase = "done";
    startOnboarding(origin);
  }

  function onFocus() {
    if (started) return;
    started = true;
    track("signup_start");
  }

  function onInput(event) {
    email = event.target.value;
    nodes(".lead-form input").forEach(function (input) {
      if (input !== event.target) input.value = email;
    });
    var error = event.target.form.querySelector(".form-error");
    if (error) error.hidden = true;
  }

  function formatUSPhone(value) {
    if (/[a-z]/i.test(value)) return value;
    var digits = value.replace(/\D/g, "");
    if (digits.length > 10 && digits.charAt(0) === "1") digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (!digits) return "";
    if (digits.length < 4) return "(" + digits;
    if (digits.length < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function phoneCaret(raw, formatted, cursor) {
    if (/[a-z]/i.test(raw)) return cursor;
    var rawDigits = raw.replace(/\D/g, "");
    var before = raw.slice(0, cursor).replace(/\D/g, "");
    var count = before.length;
    if (rawDigits.length > 10 && rawDigits.charAt(0) === "1" && before.charAt(0) === "1") {
      count = Math.max(0, count - 1);
    }
    if (count <= 0) return 0;
    var seen = 0;
    var i;
    for (i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted.charAt(i))) seen += 1;
      if (seen === count) return i + 1;
    }
    return formatted.length;
  }

  function onPhoneInput(event) {
    var input = event.target;
    var raw = input.value;
    var cursor = input.selectionStart || 0;
    var formatted = formatUSPhone(raw);
    var pos = phoneCaret(raw, formatted, cursor);
    phone = formatted;
    nodes(".remind-form input").forEach(function (field) {
      field.value = formatted;
    });
    input.setSelectionRange(pos, pos);
    var error = input.form.querySelector(".form-error");
    if (error) error.hidden = true;
  }

  function burst(form) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var section = form.closest("section");
    var card = form.closest(".card");
    if (!section || !card) return;
    var previous = section.querySelector(".confetti");
    if (previous) previous.remove();
    var canvas = document.createElement("canvas");
    canvas.className = "confetti";
    canvas.setAttribute("aria-hidden", "true");
    section.insertBefore(canvas, section.firstChild);
    var sectionBox = section.getBoundingClientRect();
    var cardBox = card.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(sectionBox.width * dpr));
    canvas.height = Math.max(1, Math.round(sectionBox.height * dpr));
    var context = canvas.getContext("2d");
    context.scale(dpr, dpr);
    var originX = cardBox.left - sectionBox.left + cardBox.width / 2;
    var originY = cardBox.top - sectionBox.top + cardBox.height / 2;
    var colors = section.classList.contains("close")
      ? ["#ffffff", "#b7ebd4", "#8fe0bf", "#e7f6ef"]
      : ["#0e9f6e", "#046348", "#0b1f33", "#8fe0bf", "#ffffff"];
    var pieces = [];
    var count = 110;
    var localX = cardBox.left - sectionBox.left;
    var localY = cardBox.top - sectionBox.top;
    var i;
    for (i = 0; i < count; i++) {
      var side = i % 4;
      var along = Math.random();
      var x = localX + cardBox.width / 2;
      var y = localY + cardBox.height / 2;
      if (side === 0) {
        x = localX + along * cardBox.width;
        y = localY;
      } else if (side === 1) {
        x = localX + cardBox.width;
        y = localY + along * cardBox.height;
      } else if (side === 2) {
        x = localX + along * cardBox.width;
        y = localY + cardBox.height;
      } else {
        x = localX;
        y = localY + along * cardBox.height;
      }
      var angle = Math.atan2(y - originY, x - originX) + (Math.random() - 0.5) * 0.9;
      var speed = 160 + Math.random() * 420;
      pieces.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 90,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 10,
        color: colors[i % colors.length]
      });
    }
    var start = 0;
    var last = 0;
    function frame(now) {
      if (!start) start = now;
      var dt = Math.min(0.034, last ? (now - last) / 1000 : 0.016);
      last = now;
      var life = 1 - (now - start) / 2100;
      context.clearRect(0, 0, sectionBox.width, sectionBox.height);
      if (life <= 0) {
        canvas.remove();
        return;
      }
      pieces.forEach(function (piece) {
        piece.vy += 780 * dt;
        piece.vx *= 0.985;
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.rot += piece.spin * dt;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rot);
        context.globalAlpha = Math.max(0, life);
        context.fillStyle = piece.color;
        context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h * 0.55);
        context.restore();
      });
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function finishEmail(form) {
    if (!started) {
      started = true;
      track("signup_start");
    }
    track("signup_complete");
    if (campaign.remind) {
      phase = "remind";
      phone = "";
      track("reminder_view");
      paint();
      report();
    } else {
      enterDone(form);
    }
    burst(form);
  }

  function onSubmit(event) {
    event.preventDefault();
    var value = email.trim();
    if (!EMAIL.test(value)) {
      var error = event.target.querySelector(".form-error");
      if (error) error.hidden = false;
      return;
    }
    email = value;
    finishEmail(event.target);
  }

  function showPhoneError(form) {
    var error = form.querySelector(".form-error");
    if (error) error.hidden = false;
  }

  function showSaveError(origin) {
    var form = origin && origin.closest ? (origin.closest("form") || origin) : null;
    var error = form ? form.querySelector(".form-error") : null;
    if (!error) return;
    error.textContent = "The form could not be saved. Try again.";
    error.hidden = false;
  }

  function setBusy(origin, busy) {
    var form = origin && origin.closest ? (origin.closest("form") || origin) : null;
    if (!form) return;
    Array.prototype.forEach.call(form.querySelectorAll("button"), function (button) {
      button.disabled = busy;
    });
  }

  function recordedLines(reminder, phoneValue) {
    var remind = campaign.remind || {};
    return [
      "Email: " + email,
      "SMS reminder: " + (reminder === "optin" ? (remind.button || "Send me an SMS") : (remind.skip || "No thanks")),
      "Mobile number: " + (reminder === "optin" ? phoneValue : "Skipped"),
      "Campaign: " + campaign.name
    ];
  }

  function saveRegistration(reminder, phoneValue, origin) {
    var lines = recordedLines(reminder, phoneValue);
    var text = lines.join("\n");
    setBusy(origin, true);
    window.dnaPostSheet({
      form: "registration",
      page: location.pathname,
      email: email,
      phone: phoneValue,
      message: text,
      description: text,
      detail: JSON.stringify({ campaign: campaign.slug, reminder: reminder })
    }).then(function () {
      recorded = lines;
      phone = "";
      track(reminder === "optin" ? "reminder_optin" : "reminder_skip");
      enterDone(origin);
    }).catch(function () {
      setBusy(origin, false);
      showSaveError(origin);
    });
  }

  function onRemindSubmit(event) {
    event.preventDefault();
    var value = phone.trim();
    if (!value) {
      showPhoneError(event.target);
      return;
    }
    saveRegistration("optin", value, event.target);
  }

  function onSkip(event) {
    saveRegistration("skip", "", event.currentTarget);
  }

  function report() {
    if (window.parent === window) return;
    var height = Math.ceil(document.documentElement.scrollHeight);
    window.parent.postMessage({ source: "dna-embed", height: height }, "*");
  }

  function bind() {
    nodes(".lead-form").forEach(function (form) {
      form.addEventListener("submit", onSubmit);
      var input = form.querySelector("input");
      input.addEventListener("focus", onFocus);
      input.addEventListener("input", onInput);
    });
    nodes(".remind-form").forEach(function (form) {
      form.addEventListener("submit", onRemindSubmit);
      form.querySelector("input").addEventListener("input", onPhoneInput);
    });
    nodes("[data-remind-skip]").forEach(function (button) {
      button.addEventListener("click", onSkip);
    });
    nodes("[data-ics]").forEach(function (button) {
      button.addEventListener("click", downloadIcs);
    });
  }

  document.title = campaign.title || campaign.name;
  fillText("mark", campaign.mark);
  fillText("eyebrow", campaign.eyebrow);
  fillText("headline", campaign.headline);
  fillText("subhead", campaign.subhead);
  fillText("button", campaign.button);
  fillText("note", campaign.note);
  fillText("whenLabel", campaign.whenLabel);
  fillText("timeLabel", campaign.timeLabel);
  fillText("length", campaign.length);
  fillText("where", campaign.where);
  fillText("closeHeadline", campaign.closeHeadline);
  fillText("closeLede", campaign.closeLede);
  fillText("footer", campaign.footer);
  if (campaign.remind) {
    fillText("remindHeadline", campaign.remind.headline);
    fillText("remindLede", campaign.remind.lede);
    fillText("remindLabel", campaign.remind.label);
    fillText("remindButton", campaign.remind.button);
    fillText("remindSkip", campaign.remind.skip);
    fillText("remindEmpty", campaign.remind.empty);
    fillText("remindNote", campaign.remind.note);
    nodes(".remind-form input").forEach(function (input) {
      input.placeholder = campaign.remind.placeholder || "(303) 555-0100";
    });
  }
  fillText("sectionBenefits", campaign.sections.benefits);
  fillText("sectionAgenda", campaign.sections.agenda);
  fillText("sectionFit", campaign.sections.fit);
  fillText("sectionFaq", campaign.sections.faq);
  fillLists();
  bind();
  paint();
  track("signup_view");

  window.addEventListener("load", report);
  window.addEventListener("resize", report);
  if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
  window.setTimeout(report, 50);
  window.setTimeout(report, 400);
})();
