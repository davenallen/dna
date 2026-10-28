(function () {
  var ICONS = {
    vehicle: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M8 30l3-9h26l3 9v8H8v-8zm6 4a2 2 0 110-4 2 2 0 010 4zm20 0a2 2 0 110-4 2 2 0 010 4zM14 18l2-6h16l2 6H14z"/></svg>',
    personal: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="16" r="7" fill="currentColor"/><path fill="currentColor" d="M10 38c2-8 8-12 14-12s12 4 14 12H10z"/></svg>',
    work: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M8 22h32v4H8v-4zm4-6c0-6 4-10 12-10s12 4 12 10v6H12v-6zm-2 14h28l-2 10H12l-2-10z"/></svg>'
  };

  var pathId = "";
  var step = 0;
  var answers = {};
  var error = "";
  var done = false;
  var saving = false;
  var motion = "";
  var progressFrom = 0;
  var formStarted = false;

  function nodes(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function pathById(id) {
    return (campaign.paths || []).filter(function (item) { return item.id === id; })[0] || null;
  }

  function currentPath() {
    return pathById(pathId);
  }

  function fillText(field, value) {
    nodes('[data-field="' + field + '"]').forEach(function (node) {
      node.textContent = value || "";
    });
  }

  function fillPage() {
    document.title = campaign.title || document.title;
    ["brand", "brandNote", "headlineLead", "headline", "subhead", "sectionHow", "sectionHowLead", "sectionGuide", "footer"].forEach(function (field) {
      fillText(field, campaign[field]);
    });
    nodes("[data-field-src]").forEach(function (node) {
      var key = node.getAttribute("data-field-src");
      if (campaign[key]) {
        node.src = campaign[key];
        node.alt = campaign.brand || "";
      }
    });
    var hero = document.querySelector("[data-hero]");
    if (hero && campaign.hero) hero.style.backgroundImage = "url(" + campaign.hero + ")";

    nodes('[data-list="how"]').forEach(function (list) {
      list.textContent = "";
      (campaign.how || []).forEach(function (item) {
        var card = el("article");
        card.appendChild(el("h3", "", item.title));
        card.appendChild(el("p", "", item.body));
        list.appendChild(card);
      });
    });

    nodes('[data-list="guide"]').forEach(function (list) {
      list.textContent = "";
      (campaign.guide || []).forEach(function (item) {
        list.appendChild(el("li", "", item));
      });
    });

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

    renderPaths();
  }

  function icon(id) {
    var wrap = document.createElement("span");
    wrap.innerHTML = ICONS[id] || "";
    return wrap.firstChild;
  }

  function renderPaths() {
    nodes("[data-paths]").forEach(function (list) {
      var mode = list.getAttribute("data-paths");
      list.textContent = "";
      (campaign.paths || []).forEach(function (item) {
        var button = el("button", mode === "hero" ? "path" : "");
        button.type = "button";
        var mark = icon(item.id);
        if (mark) button.appendChild(mark);
        button.appendChild(el("span", "", mode === "hero" ? item.label : item.nav));
        if (item.id === pathId) button.setAttribute("aria-current", "true");
        button.addEventListener("click", function () { openPath(item.id); });
        list.appendChild(button);
      });
    });
  }

  function stepName(index) {
    var path = currentPath();
    var item = path && path.steps[index];
    if (!item) return "";
    return item.name || item.kind || "";
  }

  function track(name, extra) {
    extra = extra || {};
    window.dnaCampaignEvent(name, {
      landing_name: "Injury Evaluation Landing Page",
      landing_id: campaign.slug,
      form_name: name === "landing_view" || name === "lead_view" ? "" : "injury_evaluation",
      form_step: extra.form_step || extra.step || "",
      form_step_name: extra.form_step_name || "",
      form_path: pathId,
      lead_status: extra.lead_status || ""
    });
  }

  function openPath(id) {
    pathId = id;
    step = 0;
    answers = {};
    error = "";
    done = false;
    motion = "forward";
    progressFrom = 0;
    if (!formStarted) {
      formStarted = true;
      track("form_start", { form_step: 1, form_step_name: stepName(0), lead_status: "started" });
    }
    track("lead_step", { step: 1, form_step_name: stepName(0) });
    paint();
    var quiz = document.querySelector("[data-quiz]");
    if (quiz) quiz.scrollIntoView({ block: "nearest" });
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

  function problemFor(current, form) {
    if (current.kind === "note" && !String(form.description || "").trim()) return "Add a short description.";
    if (current.kind === "zip" && digits(form.zip).length !== 5) return "Add a 5-digit ZIP code.";
    if (current.kind === "name") {
      if (String(form.first || "").trim().length < 2 || String(form.last || "").trim().length < 2) return "Add a first and last name.";
    }
    if (current.kind === "contact") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || "").trim())) return "Add an email address.";
      if (digits(form.phone).length < 10) return "Add a 10-digit phone number.";
    }
    return "";
  }

  function readForm(form) {
    var data = {};
    Array.prototype.forEach.call(form.elements, function (field) {
      if (field.name) data[field.name] = field.value;
    });
    return data;
  }

  function goForward(form) {
    var path = currentPath();
    var current = path.steps[step];
    var data = form ? readForm(form) : {};
    var problem = problemFor(current, data);
    if (problem) {
      error = problem;
      paint();
      return;
    }
    Object.keys(data).forEach(function (key) { answers[key] = data[key]; });
    error = "";
    motion = "forward";
    if (step >= path.steps.length - 1) {
      if (form) {
        var button = form.querySelector("button");
        if (button) button.disabled = true;
      }
      complete();
      return;
    }
    step += 1;
    track("lead_step", { step: step + 1, form_step_name: stepName(step) });
    paint();
  }

  function recordedText(path) {
    return answerRows(path).map(function (row) {
      var label = String(row.label || "").replace(/[?:.\s]+$/, "");
      return label + ": " + row.value;
    }).join("\n");
  }

  function complete() {
    if (saving) return;
    saving = true;
    var path = currentPath();
    var recorded = recordedText(path);
    window.dnaPostSheet({
      form: "injury",
      page: location.pathname,
      name: ((answers.first || "") + " " + (answers.last || "")).trim(),
      email: answers.email || "",
      phone: answers.phone || "",
      message: recorded,
      description: recorded,
      detail: JSON.stringify({ campaign: campaign.slug, path: path && path.id, answers: answers })
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

  function choose(value) {
    var path = currentPath();
    answers[path.steps[step].name] = value;
    error = "";
    motion = "forward";
    if (step >= path.steps.length - 1) {
      complete();
      return;
    }
    step += 1;
    track("lead_step", { step: step + 1, form_step_name: stepName(step) });
    paint();
  }

  function back() {
    motion = "back";
    if (step === 0) {
      pathId = "";
      done = false;
      answers = {};
      error = "";
      progressFrom = 0;
      paint();
      return;
    }
    error = "";
    done = false;
    step -= 1;
    paint();
  }

  function field(name, label, type) {
    var wrap = el("label");
    wrap.appendChild(el("span", "", label));
    var input = document.createElement(type === "textarea" ? "textarea" : "input");
    if (type !== "textarea") input.type = type || "text";
    input.name = name;
    if (answers[name]) input.value = answers[name];
    if (name === "zip") {
      input.inputMode = "numeric";
      input.autocomplete = "postal-code";
      input.maxLength = 5;
      input.value = digits(input.value).slice(0, 5);
      input.addEventListener("input", function () {
        var next = digits(input.value).slice(0, 5);
        var cursor = Math.min(input.selectionStart || next.length, next.length);
        input.value = next;
        input.setSelectionRange(cursor, cursor);
      });
    }
    if (name === "phone") {
      input.inputMode = "tel";
      input.autocomplete = "tel";
      input.placeholder = "(222) 222-2222";
      input.value = formatUSPhone(input.value);
      input.addEventListener("input", function () {
        var raw = input.value;
        var cursor = input.selectionStart || 0;
        var formatted = formatUSPhone(raw);
        var pos = phoneCaret(raw, formatted, cursor);
        input.value = formatted;
        input.setSelectionRange(pos, pos);
      });
    }
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
      description: '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-5 4V6a1 1 0 0 1 1-1z"/></svg>'
    };
    var icon = el("span", "field-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = marks[name] || marks.description;
    return icon;
  }

  function answerRows(path) {
    var rows = [];
    path.steps.forEach(function (item) {
      if (item.kind === "choice") {
        var picked = "";
        (item.options || []).forEach(function (option) {
          if (option.value === answers[item.name]) picked = option.label;
        });
        rows.push({ label: item.label, value: picked });
      } else if (item.kind === "note") {
        rows.push({ label: item.label, value: answers.description || "" });
      } else if (item.kind === "zip") {
        rows.push({ label: item.label, value: answers.zip || "" });
      } else if (item.kind === "name") {
        rows.push({ label: "First name", value: answers.first || "" });
        rows.push({ label: "Last name", value: answers.last || "" });
      } else if (item.kind === "contact") {
        rows.push({ label: "Email", value: answers.email || "" });
        rows.push({ label: "Phone", value: answers.phone || "" });
      }
    });
    return rows;
  }

  function paintQuiz() {
    var root = document.querySelector("[data-quiz]");
    var direction = motion;
    motion = "";
    if (!root) return;
    var path = currentPath();
    root.hidden = !path;
    if (!path) {
      root.textContent = "";
      return;
    }
    root.textContent = "";
    root.appendChild(el("p", "quiz-kicker", path.label));

    if (done) {
      var doneBox = el("div", "done" + (direction === "forward" ? " anim-forward" : ""));
      doneBox.appendChild(el("h2", "", campaign.doneTitle));
      doneBox.appendChild(el("p", "", campaign.doneBody));
      var list = el("ul", "done-list");
      answerRows(path).forEach(function (row) {
        var label = String(row.label || "").replace(/[?:.\s]+$/, "");
        list.appendChild(el("li", "", label + ": " + row.value));
      });
      doneBox.appendChild(list);
      var again = el("button", "button", "Start over");
      again.type = "button";
      again.addEventListener("click", function () { openPath(path.id); });
      doneBox.appendChild(again);
      root.appendChild(doneBox);
      return;
    }

    var current = path.steps[step];
    var percent = Math.round(((step + 1) / path.steps.length) * 100);
    var progress = el("div", "progress");
    var bar = el("span", "anim-progress");
    var from = progressFrom;
    progressFrom = percent;
    bar.style.width = from + "%";
    progress.appendChild(bar);
    root.appendChild(progress);
    requestAnimationFrame(function () {
      bar.style.width = percent + "%";
    });

    var heading = el("h2", direction === "forward" ? "anim-forward" : "", current.label);
    var stage = direction === "back" ? el("div", "anim-back") : null;
    if (stage) stage.appendChild(heading);
    else root.appendChild(heading);

    if (current.kind === "choice") {
      var choices = el("div", "choices" + (direction === "back" ? "" : " anim-choices"));
      current.options.forEach(function (option) {
        var button = el("button", "choice", option.label);
        button.type = "button";
        button.addEventListener("click", function () { choose(option.value); });
        choices.appendChild(button);
      });
      (stage || root).appendChild(choices);
    } else {
      var form = el("form", "fields" + (direction === "forward" ? " anim-forward" : ""));
      form.noValidate = true;
      if (current.kind === "note") form.appendChild(field("description", "Description", "textarea"));
      if (current.kind === "zip") form.appendChild(field("zip", "ZIP code", "text"));
      if (current.kind === "name") {
        form.appendChild(field("first", "First name", "text"));
        form.appendChild(field("last", "Last name", "text"));
      }
      if (current.kind === "contact") {
        form.appendChild(field("email", "Email", "email"));
        form.appendChild(field("phone", "Phone", "tel"));
      }
      var next = el("button", "button", step === path.steps.length - 1 ? "See my results" : "Next");
      next.type = "submit";
      form.appendChild(next);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        goForward(form);
      });
      (stage || root).appendChild(form);
    }

    if (stage) root.appendChild(stage);

    var backRow = el("div", "quiz-actions");
    var previous = el("button", "button button-ghost", step === 0 ? "All paths" : "Back");
    previous.type = "button";
    previous.addEventListener("click", back);
    backRow.appendChild(previous);
    root.appendChild(backRow);
    if (error) root.appendChild(el("p", "quiz-error", error));
    root.appendChild(el("p", "quiz-note", campaign.sampleNote));
  }

  function reportHeight() {
    if (window.parent === window) return;
    window.parent.postMessage({ source: "dna-embed", height: document.documentElement.scrollHeight }, "*");
  }

  function paint() {
    renderPaths();
    paintQuiz();
    reportHeight();
  }

  fillPage();
  paint();
  track("landing_view", { lead_status: "viewed" });
  window.addEventListener("resize", reportHeight);
})();
