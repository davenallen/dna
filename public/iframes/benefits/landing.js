(function () {
  var STEPS = campaign.quiz || [];
  var TOTAL = STEPS.length + 1;
  var step = 0;
  var answers = {};
  var note = "";
  var form = { first: "", last: "", email: "", phone: "", zip: "" };
  var error = "";
  var done = false;
  var saving = false;
  var formStarted = false;

  function nodes(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function fillText(field, value) {
    nodes('[data-field="' + field + '"]').forEach(function (node) {
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
    nodes('[data-list="checks"]').forEach(function (list) {
      list.textContent = "";
      (campaign.checks || []).forEach(function (item) {
        list.appendChild(el("li", "", item));
      });
    });

    nodes('[data-list="benefits"]').forEach(function (list) {
      list.textContent = "";
      (campaign.benefits || []).forEach(function (item) {
        var card = el("article");
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        list.appendChild(card);
      });
    });
    hideSection("benefits", !(campaign.benefits || []).length);

    nodes('[data-list="agenda"]').forEach(function (list) {
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

    nodes('[data-list="fit"]').forEach(function (list) {
      list.textContent = "";
      (campaign.fit || []).forEach(function (item) {
        var card = el("article");
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        list.appendChild(card);
      });
    });
    hideSection("fit", !(campaign.fit || []).length);

    nodes('[data-list="faqs"]').forEach(function (list) {
      list.textContent = "";
      (campaign.faqs || []).forEach(function (item, index) {
        var details = document.createElement("details");
        if (index === 0) details.open = true;
        details.appendChild(el("summary", "", item.q));
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

  function track(name, extra) {
    extra = extra || {};
    window.dnaCampaignEvent(name, {
      landing_name: "Disability Benefits Landing Page",
      landing_id: campaign.slug,
      form_name: name === "lead_view" || name === "landing_view" ? "" : "benefits_quiz",
      form_step: extra.form_step || extra.step || "",
      form_step_name: extra.form_step_name || "",
      lead_status: extra.lead_status || ""
    });
  }

  function markStart(stepName) {
    if (formStarted) return;
    formStarted = true;
    track("form_start", {
      lead_status: "started",
      form_step: step + 1,
      form_step_name: stepName || ""
    });
  }

  function calendarUrl() {
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: campaign.name,
      dates: campaign.starts + "/" + campaign.ends,
      details: campaign.calendarNote || "Sample briefing. The link stays in this browser."
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function downloadIcs() {
    var ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//David N Allen//Benefits Briefing//EN",
      "BEGIN:VEVENT",
      "DTSTART:" + campaign.starts,
      "DTEND:" + campaign.ends,
      "SUMMARY:" + campaign.name,
      "DESCRIPTION:" + (campaign.calendarNote || "Sample briefing. The link stays in this browser."),
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

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatUSPhone(value) {
    if (/[a-z]/i.test(value)) return value;
    var chars = digits(value);
    if (chars.length > 10 && chars.charAt(0) === "1") chars = chars.slice(1);
    chars = chars.slice(0, 10);
    if (!chars) return "";
    if (chars.length < 4) return "(" + chars;
    if (chars.length < 7) return "(" + chars.slice(0, 3) + ") " + chars.slice(3);
    return "(" + chars.slice(0, 3) + ") " + chars.slice(3, 6) + "-" + chars.slice(6);
  }

  function phoneCaret(raw, formatted, cursor) {
    if (/[a-z]/i.test(raw)) return cursor;
    var rawDigits = digits(raw);
    var before = digits(raw.slice(0, cursor));
    var count = before.length;
    if (rawDigits.length > 10 && rawDigits.charAt(0) === "1" && before.charAt(0) === "1") {
      count = Math.max(0, count - 1);
    }
    if (count <= 0) return 0;
    var seen = 0;
    var i;
    for (i = 0; i < formatted.length; i += 1) {
      if (/\d/.test(formatted.charAt(i))) seen += 1;
      if (seen === count) return i + 1;
    }
    return formatted.length;
  }

  function contactError() {
    if (!form.first.trim() || !form.last.trim()) return "Add a first and last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Add an email address.";
    if (digits(form.phone).length < 10) return "Add a 10-digit phone number.";
    if (digits(form.zip).length !== 5) return "Add a 5-digit ZIP code.";
    return "";
  }

  function progressValue() {
    return done ? TOTAL : Math.min(step + 1, TOTAL);
  }

  function go(next) {
    var forward = next > step;
    if (forward) markStart((STEPS[step] && STEPS[step].id) || "contact");
    error = "";
    step = next;
    if (forward) {
      track("lead_step", {
        form_step: next + 1,
        form_step_name: (STEPS[next] && STEPS[next].id) || "contact"
      });
    }
    paint();
  }

  function choose(value) {
    answers[STEPS[step].id] = value;
    go(step + 1);
  }

  function continueNote() {
    if (!note.trim()) {
      error = campaign.noteError || "Add a short note about the review.";
      paint();
      return;
    }
    go(step + 1);
  }

  function recordedRows() {
    var rows = [];
    STEPS.forEach(function (item) {
      if (!item.choices) return;
      var picked = "";
      item.choices.forEach(function (choice) {
        if (choice.value === answers[item.id]) picked = choice.label;
      });
      rows.push(item.label + ": " + (picked || "Skipped"));
    });
    if (note.trim()) rows.push("Review: " + note.trim());
    rows.push("First name: " + form.first.trim());
    rows.push("Last name: " + form.last.trim());
    rows.push("Email: " + String(form.email || "").trim());
    rows.push("Phone: " + (form.phone || ""));
    rows.push("ZIP code: " + (form.zip || ""));
    return rows;
  }

  function finish(event) {
    event.preventDefault();
    if (saving) return;
    var problem = contactError();
    if (problem) {
      error = problem;
      paint();
      return;
    }
    error = "";
    saving = true;
    var button = event.target.querySelector("button");
    if (button) button.disabled = true;
    var recorded = recordedRows().join("\n");
    window.dnaPostSheet({
      form: "benefits",
      page: location.pathname,
      name: (form.first + " " + form.last).trim(),
      email: String(form.email || "").trim(),
      phone: form.phone || "",
      message: recorded,
      description: recorded,
      detail: JSON.stringify({
        campaign: campaign.slug,
        zip: form.zip,
        note: note,
        answers: answers
      })
    }).then(function () {
      done = true;
      saving = false;
      track("lead_complete");
      paint();
    }).catch(function () {
      saving = false;
      error = "The form could not be saved. Try again.";
      paint();
    });
  }

  function restart() {
    step = 0;
    answers = {};
    note = "";
    form = { first: "", last: "", email: "", phone: "", zip: "" };
    error = "";
    done = false;
    paint();
  }

  function field(rootIndex, name, label, type, autoComplete, mode) {
    var id = "quiz-" + name + "-" + rootIndex;
    var wrap = el("label");
    wrap.htmlFor = id;
    wrap.appendChild(el("span", "", label));
    var input = document.createElement("input");
    input.id = id;
    input.name = name;
    input.type = type;
    input.autocomplete = autoComplete;
    input.value = form[name];
    if (mode) input.inputMode = mode;
    if (name === "zip") {
      input.maxLength = 5;
      input.value = digits(input.value).slice(0, 5);
    }
    if (name === "phone") {
      input.placeholder = "(222) 222-2222";
      input.value = formatUSPhone(input.value);
    }
    input.setAttribute("data-quiz-field", name);
    input.addEventListener("input", function (event) {
      markStart("contact");
      var value = event.target.value;
      var cursor = event.target.selectionStart || 0;
      if (name === "zip") {
        value = digits(value).slice(0, 5);
        cursor = Math.min(cursor, value.length);
      }
      if (name === "phone") {
        var formatted = formatUSPhone(value);
        cursor = phoneCaret(value, formatted, cursor);
        value = formatted;
      }
      event.target.value = value;
      if (name === "zip" || name === "phone") event.target.setSelectionRange(cursor, cursor);
      form[name] = value;
      error = "";
      nodes('[data-quiz-field="' + name + '"]').forEach(function (other) {
        if (other !== event.target) other.value = value;
      });
      nodes(".quiz-error").forEach(function (node) { node.hidden = true; });
    });
    var control = el("span", "field-control");
    control.appendChild(input);
    control.appendChild(fieldIcon(name));
    wrap.appendChild(control);
    return wrap;
  }

  function fieldIcon(name) {
    var marks = {
      first: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2c-4 0-7.5 2-7.5 4.5V20h15v-1.5C19.5 16 16 14 12 14z"/></svg>',
      last: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12zm0 2c-4 0-7.5 2-7.5 4.5V20h15v-1.5C19.5 16 16 14 12 14z"/></svg>',
      email: "@",
      phone: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6.6 3.8c.4-.4 1-.5 1.5-.3l2.4 1a1.2 1.2 0 0 1 .7 1.4L10.4 8.6a1.2 1.2 0 0 1-1.1.9c-.3 0-.5.1-.6.4a7.6 7.6 0 0 0 4.4 4.4c.3-.1.4-.3.4-.6a1.2 1.2 0 0 1 .9-1.1l2.7-.8a1.2 1.2 0 0 1 1.4.7l1 2.4c.2.5.1 1.1-.3 1.5l-1.4 1.4c-.5.5-1.2.7-1.9.6C9.6 17.6 5.4 13.4 4.6 7.1c-.1-.7.1-1.4.6-1.9l1.4-1.4z"/></svg>',
      zip: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/></svg>',
      focus: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-5 4V6a1 1 0 0 1 1-1z"/></svg>'
    };
    var icon = el("span", "field-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = marks[name] || marks.focus;
    return icon;
  }

  function renderResult(root) {
    var block = el("div", "quiz-result");
    block.appendChild(el("h2", "", campaign.resultTitle || "Sample result"));
    block.appendChild(el("p", "", (campaign.resultNote || "Form data is kept for demonstration purposes only and will not be sold or shared.") + " The visit is still " + visitLine() + "."));
    var list = document.createElement("ul");
    recordedRows().forEach(function (row) {
      list.appendChild(el("li", "", row));
    });
    block.appendChild(list);
    var again = el("button", "button button-ghost", campaign.restart || "Start over");
    again.type = "button";
    again.addEventListener("click", restart);
    block.appendChild(again);
    var cal = el("div", "cal");
    var google = el("a", "button button-ghost", "Google Calendar");
    google.href = calendarUrl();
    google.target = "_blank";
    google.rel = "noopener noreferrer";
    var ics = el("button", "button button-ghost", "Download .ics");
    ics.type = "button";
    ics.addEventListener("click", downloadIcs);
    cal.appendChild(google);
    cal.appendChild(ics);
    block.appendChild(cal);
    root.appendChild(block);
  }

  function renderQuiz(root, index) {
    root.textContent = "";
    var progress = el("div", "quiz-progress");
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuemin", "1");
    progress.setAttribute("aria-valuemax", String(TOTAL));
    progress.setAttribute("aria-valuenow", String(progressValue()));
    progress.setAttribute("aria-label", "Step " + progressValue() + " of " + TOTAL);
    var bar = el("span");
    bar.style.width = ((progressValue() / TOTAL) * 100) + "%";
    progress.appendChild(bar);
    root.appendChild(progress);

    if (done) {
      renderResult(root);
      return;
    }

    var question = STEPS[step];
    var onContact = step >= STEPS.length;
    root.appendChild(el("h2", "", onContact ? (campaign.contactPrompt || "Where should the result go?") : question.prompt));

    if (!onContact && question.hint) root.appendChild(el("p", "quiz-hint", question.hint));
    if (onContact) {
      root.appendChild(el("p", "quiz-hint", campaign.contactHint || "Form data is kept for demonstration purposes only and will not be sold or shared."));
    }

    if (!onContact && question.choices) {
      var group = el("div", "quiz-choices" + (question.choices.length === 2 ? " is-pair" : ""));
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", question.prompt);
      question.choices.forEach(function (choice) {
        var button = el("button", "quiz-choice" + (answers[question.id] === choice.value ? " is-picked" : ""), choice.label);
        button.type = "button";
        button.addEventListener("click", function () { choose(choice.value); });
        group.appendChild(button);
      });
      root.appendChild(group);
    }

    if (!onContact && question.text) {
      var noteWrap = el("div", "quiz-note");
      var id = "quiz-note-" + index;
      var label = el("label");
      label.htmlFor = id;
      label.appendChild(el("span", "", question.fieldLabel || "A sentence is enough"));
      var area = document.createElement("textarea");
      area.id = id;
      area.name = "focus";
      area.rows = 3;
      area.value = note;
      area.addEventListener("input", function (event) {
        note = event.target.value;
        error = "";
        nodes(".quiz textarea").forEach(function (other) {
          if (other !== event.target) other.value = note;
        });
        nodes(".quiz-error").forEach(function (node) { node.hidden = true; });
      });
      var noteControl = el("span", "field-control");
      noteControl.appendChild(area);
      noteControl.appendChild(fieldIcon("focus"));
      label.appendChild(noteControl);
      noteWrap.appendChild(label);
      var cont = el("button", "button", campaign.noteButton || "Continue");
      cont.type = "button";
      cont.addEventListener("click", continueNote);
      noteWrap.appendChild(cont);
      root.appendChild(noteWrap);
    }

    if (onContact) {
      var contact = document.createElement("form");
      contact.className = "quiz-form";
      contact.noValidate = true;
      contact.addEventListener("submit", finish);
      var fields = el("div", "quiz-fields");
      fields.appendChild(field(index, "first", "First name", "text", "given-name"));
      fields.appendChild(field(index, "last", "Last name", "text", "family-name"));
      fields.appendChild(field(index, "email", "Email", "email", "email", "email"));
      fields.appendChild(field(index, "phone", "Phone", "tel", "tel", "tel"));
      fields.appendChild(field(index, "zip", "ZIP code", "text", "postal-code", "numeric"));
      contact.appendChild(fields);
      var submit = el("button", "button", campaign.contactButton || "See the sample result");
      submit.type = "submit";
      contact.appendChild(submit);
      root.appendChild(contact);
    }

    if (error) {
      var alert = el("p", "quiz-error", error);
      alert.setAttribute("role", "alert");
      root.appendChild(alert);
    }

    if (step > 0) {
      var back = el("button", "quiz-back", "Back");
      back.type = "button";
      back.addEventListener("click", function () { go(step - 1); });
      root.appendChild(back);
    }
  }

  function paint() {
    nodes("[data-quiz]").forEach(renderQuiz);
    report();
  }

  function report() {
    if (window.parent === window) return;
    var height = Math.ceil(document.documentElement.scrollHeight);
    window.parent.postMessage({ source: "dna-embed", height: height }, "*");
  }

  document.title = campaign.title || campaign.name;
  fillText("brand", campaign.brand);
  fillText("brandNote", campaign.brandNote);
  fillText("disclaimer", campaign.disclaimer);
  fillText("eyebrow", campaign.eyebrow);
  fillText("headline", campaign.headline);
  fillText("subhead", campaign.subhead);
  fillText("button", campaign.button);
  fillText("quizKicker", campaign.quizKicker);
  fillText("whenLabel", campaign.whenLabel);
  fillText("timeLabel", campaign.timeLabel);
  fillText("length", campaign.length);
  fillText("where", campaign.where);
  fillText("closeHeadline", campaign.closeHeadline);
  fillText("closeLede", campaign.closeLede);
  fillText("footer", campaign.footer);
  fillText("sectionBenefits", campaign.sections.benefits);
  fillText("sectionAgenda", campaign.sections.agenda);
  fillText("sectionFit", campaign.sections.fit);
  fillText("sectionFaq", campaign.sections.faq);
  fillLists();
  paint();
  track("lead_view");

  window.addEventListener("load", report);
  window.addEventListener("resize", report);
  if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
  window.setTimeout(report, 50);
  window.setTimeout(report, 400);
})();
