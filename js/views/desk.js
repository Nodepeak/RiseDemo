const deskHour = new Intl.DateTimeFormat("nl-NL", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  hourCycle: "h23",
});
const deskDay = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const deskWeekday = new Intl.DateTimeFormat("nl-NL", { weekday: "short", timeZone: "UTC" });

function deskGreeting(now = new Date()) {
  const hour = Number(deskHour.format(now));
  if (hour < 6) return "Goedenacht";
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

const isoPlusDays = (iso, days) => new Date(Date.parse(iso + "T00:00:00Z") + days * dayMs).toISOString().slice(0, 10);

const deskSuggestions = [
  "Wat vraagt deze week mijn aandacht?",
  "Welke acties lopen achter?",
  "Bereid Bouwteam #7 van @Parkzijde voor",
];

function deskNumbers() {
  const open = sortSignalsByAction(openSignals());
  const weekEnd = isoPlusDays(demoTodayIso, 7);
  const actions = [...projectActions(), ...scaledActions()].filter((action) => action.status !== "Afgerond");
  const dueThisWeek = actions.filter((action) => action.deadline && action.deadline <= weekEnd);
  const late = dueThisWeek.filter((action) => action.deadline < demoTodayIso);
  const upcoming = meetings.filter((meeting) => meeting.date >= demoTodayIso).sort((a, b) => a.date.localeCompare(b.date));
  const thisWeek = upcoming.filter((meeting) => meeting.date <= weekEnd);
  const extra = isScaled() ? scaleData().extraProjects : [];
  const portfolio = [
    ...projects.map((project) => ({ project, status: primaryProjectMilestone(project.id)?.status ?? "Op koers" })),
    ...extra.map((project) => ({ project, status: project.status })),
  ];
  const pressured = portfolio.filter(({ status }) => status !== "Op koers");
  const extraSignals = extra.reduce((sum, project) => sum + project.signals, 0);
  return { open, extraSignals, actions, dueThisWeek, late, upcoming, thisWeek, portfolio, pressured };
}

/* ---------- Overzicht: briefing, één ding eerst, wat klaarligt ---------- */
const deskDaysLeft = (deadline) => (deadline ? planDaysBetween(demoToday, deadline) : null);
const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1);
const deskWeekdayLong = new Intl.DateTimeFormat("nl-NL", { weekday: "long", timeZone: "UTC" });

function deskCountLabel(days) {
  if (days == null) return "geen deadline";
  if (days < 0) return Math.abs(days) === 1 ? "dag te laat" : "dagen te laat";
  if (days === 0) return "vandaag";
  return days === 1 ? "dag" : "dagen";
}

/* Wat voor soort actie stelt Vicki voor? Bepaalt icoon, woord en knop. */
function signalActionKind(step) {
  const intent = step?.intent ?? "";
  if (intent.startsWith("meeting")) return { kind: "agenda", glyph: "cal", noun: "Agendapunt", verb: "Zet op de agenda" };
  if (intent.startsWith("draft")) return { kind: "mail", glyph: "send", noun: "Conceptmail", verb: "Bekijk concept" };
  if (intent.startsWith("vooruitwerken")) return { kind: "planning", glyph: "forward", noun: "Vooruitwerken", verb: "Reken de tijdwinst door" };
  if (intent === "planning") return { kind: "planning", glyph: "gantt", noun: "Planning", verb: "Reken door" };
  return { kind: "check", glyph: "search", noun: "Controle", verb: "Laat Vicki controleren" };
}

function nextProjectMeeting(projectId) {
  return meetings.filter((m) => m.project === projectId && m.date >= demoTodayIso).sort((a, b) => a.date.localeCompare(b.date))[0];
}

function signalSteps(signal) {
  return signal.steps.map((step, index) => ({ step, index })).filter(({ step }) => !step.go)
    .sort((a, b) => Number(Boolean(b.step.primary)) - Number(Boolean(a.step.primary)));
}

/* Rechterhelft van een signaal: wat Rise voorstelt te doen */
function renderSignalAction(signal) {
  const [main, ...more] = signalSteps(signal);
  if (!main) return "";
  const kind = signalActionKind(main.step);
  const meeting = kind.kind === "agenda" ? nextProjectMeeting(signal.project) : null;
  const placed = state.onAgenda?.[signal.id];
  return `<div class="sa sa--${kind.kind} ${placed ? "is-done" : ""}">
    <p class="sa-kind">${vickiIcon()}<span>Vicki stelt voor · ${kind.noun}</span></p>
    <p class="sa-what">${escapeHtml(main.step.label)}</p>
    ${meeting ? `<p class="sa-where">${escapeHtml(meeting.title)} · ${deskWeekday.format(new Date(meeting.date + "T00:00:00Z")).replace(".", "")} ${formatIsoDate(meeting.date)}</p>` : ""}
    ${placed
      ? `<p class="sa-done">${icon("check")}Op de agenda gezet</p><a class="btn btn--link btn--sm" href="${pageHref({ view: "project", projectId: signal.project, section: "vergaderingen", meetingId: placed })}" data-action="action-meeting" data-id="${placed}">Bekijk agenda ${icon("arrow")}</a>`
      : `<button type="button" class="btn sa-go" data-action="signal-step" data-id="${signal.id}" data-i="${main.index}">${kind.verb}</button>`}
    ${more.length && !placed ? `<details class="sa-more"><summary>Nog ${more.length} ${more.length === 1 ? "voorstel" : "voorstellen"}</summary>${more.map(({ step, index }) => `<button type="button" class="sa-alt" data-action="signal-step" data-id="${signal.id}" data-i="${index}">${icon(signalActionKind(step).glyph)}${escapeHtml(step.label)}</button>`).join("")}</details>` : ""}
  </div>`;
}

function renderFirst(signal) {
  const deadline = signalActions[signal.id]?.by;
  const days = deskDaysLeft(deadline);
  const { what, why } = signalDescription(signal);
  const title = escapeHtml(signal.title);
  return `<article class="first" aria-labelledby="first-title-${signal.id}">
    <div class="first-signal">
      <p class="first-meta">
        <span class="first-count" data-urgency="${signalUrgency(deadline)}"><b>${days == null ? "–" : Math.abs(days)}</b> ${deskCountLabel(days)}</span>
        <span>${escapeHtml(findProject(signal.project).name)}</span>${signalLinkChip(signal)}
      </p>
      <h2 id="first-title-${signal.id}">${title}</h2>
      <p class="first-what">${escapeHtml(what)}</p>
      <p class="first-why">${escapeHtml(why)}</p>
      <div class="first-links">
        <button type="button" id="overview-${signal.id}" class="btn btn--link btn--sm" data-action="open-signal" data-id="${signal.id}" aria-label="Onderbouwing voor ${title}">Onderbouwing</button>
        <button type="button" class="vicki-ask" data-action="discuss-signal" data-id="${signal.id}" aria-label="Bespreek met Vicki" title="Bespreek met Vicki">${vickiIcon()}</button>
        ${state.triage ? "" : renderVerdict(signal)}
      </div>
    </div>
    ${renderSignalAction(signal)}
  </article>`;
}

/* Eerst dit als slider: het belangrijkste staat vooraan, de rest schuift erachter. */
const triageLabels = { ok: "Opgepakt", "Klopt niet": "Klopt niet", "Al geregeld": "Al geregeld", "Ga ik niets mee doen": "Laat je liggen" };

function renderTriageBar(list) {
  const t = state.triage;
  const done = list.filter((signal) => t.verdicts[signal.id]).length;
  if (done === list.length) {
    const count = (match) => list.filter((signal) => match(t.verdicts[signal.id])).length;
    const parts = [
      [count((v) => v === "ok"), "pak je op"],
      [count((v) => v === "Klopt niet"), "klopte niet"],
      [count((v) => v === "Al geregeld"), "al geregeld"],
      [count((v) => v === "Ga ik niets mee doen"), "laat je liggen"],
    ].filter(([n]) => n).map(([n, text]) => `${n} ${text}`);
    return `<div class="triage-bar is-done" role="status">
      <img class="brief-vicki" src="${localPath("assets/vicki.svg")}" width="26" height="26" alt="">
      <p><b>Klaar, alles doorlopen.</b> ${parts.join(" · ")}. Ik neem je oordeel mee in wat ik je voortaan laat zien.</p>
      <button type="button" class="btn btn--pill" data-action="triage-stop">Sluit</button>
    </div>`;
  }
  const current = list[Math.min(state.deskSlide || 0, list.length - 1)];
  const verdict = t.verdicts[current.id];
  return `<div class="triage-bar">
    <img class="brief-vicki" src="${localPath("assets/vicki.svg")}" width="26" height="26" alt="">
    <p>${verdict ? `Gemarkeerd als <b>${escapeHtml(triageLabels[verdict] ?? verdict)}</b>. Wil je het anders?` : "Klopt dit signaal?"}</p>
    <div class="triage-choices">
      <button type="button" class="triage-btn is-ok ${verdict === "ok" ? "is-on" : ""}" data-action="triage" data-v="ok">${icon("check")}Klopt, pak ik op</button>
      <button type="button" class="triage-btn ${verdict === "Klopt niet" ? "is-on" : ""}" data-action="triage" data-v="Klopt niet">Klopt niet</button>
      <button type="button" class="triage-btn ${verdict === "Ga ik niets mee doen" ? "is-on" : ""}" data-action="triage" data-v="Ga ik niets mee doen">Laat liggen</button>
    </div>
    <button type="button" class="triage-stop" data-action="triage-stop" aria-label="Stop met doorlopen" title="Stop">${icon("x")}</button>
  </div>`;
}

function renderFirstSlider(list, total) {
  const n = list.length;
  const at = Math.min(state.deskSlide || 0, n - 1);
  const label = state.triage ? `Samen doorlopen` : at === 0 ? "Eerst dit" : "Daarna";
  return `<section class="slider ${state.triage ? "is-triage" : ""}" aria-roledescription="carrousel" aria-label="Signalen, belangrijkste eerst">
    <header class="slider-head">
      <p class="desk-label ${at && !state.triage ? "is-later" : ""}" ${state.triage ? "" : "data-slide-label"}>${label}</p>
      <div class="slider-nav">
        ${!state.triage && n > 1 ? `<button type="button" class="slider-walk" data-action="triage-start" title="Loop de signalen samen met Vicki door">${vickiIcon()}<span>Samen doorlopen</span></button>` : ""}
        ${n > 1 ? `<span class="slider-pos" aria-hidden="true"><b data-slide-pos>${at + 1}</b>/${n}</span>
        <span class="slider-dots">${list.map((s, i) => `<button type="button" class="slider-dot ${i === at ? "is-on" : ""}" data-slide-to="${i}" aria-label="Signaal ${i + 1} van ${n}" ${i === at ? 'aria-current="true"' : ""}></button>`).join("")}</span>
        <button type="button" class="icon-btn icon-btn--soft slider-arrow" data-slide-dir="-1" aria-label="Vorig signaal" ${at === 0 ? "disabled" : ""}>${icon("back")}</button>
        <button type="button" class="icon-btn icon-btn--soft slider-arrow" data-slide-dir="1" aria-label="Volgend signaal" ${at === n - 1 ? "disabled" : ""}>${icon("chev")}</button>` : ""}
        ${total > n ? `<a class="desk-more" data-action="tab" data-view="projecten" href="${pageHref({ view: "projecten" })}" aria-label="Alle ${total} signalen">Alle ${total}${icon("chev")}</a>` : ""}
      </div>
    </header>
    <div class="slider-track" tabindex="0" data-slider>
      ${list.map((signal, i) => { const v = state.triage?.verdicts[signal.id]; return `<div class="slide ${i === at ? "is-active" : ""} ${v ? "is-judged" : ""}" data-verdict="${v ?? ""}" role="group" aria-roledescription="dia" aria-label="${i + 1} van ${n}" ${i === at ? "" : "inert"}>${v ? `<span class="slide-stamp">${v === "ok" ? icon("check") : ""}${escapeHtml(triageLabels[v] ?? v)}</span>` : ""}${renderFirst(signal)}</div>`; }).join("")}
    </div>
    ${state.triage ? renderTriageBar(list) : ""}
  </section>`;
}

function syncSlider(track) {
  const slides = [...track.children];
  if (!slides.length) return;
  const max = track.scrollWidth - track.clientWidth;
  let at = 0, best = Infinity;
  slides.forEach((slide, i) => {
    const target = Math.min(slide.offsetLeft - slides[0].offsetLeft, max);
    const d = Math.abs(target - track.scrollLeft);
    if (d < best) { best = d; at = i; }
  });
  if (state.deskSlide === at && track.dataset.synced) return;
  track.dataset.synced = "1";
  state.deskSlide = at;
  if (state.triage) return render();
  const root = track.closest(".slider");
  slides.forEach((slide, i) => { slide.classList.toggle("is-active", i === at); slide.toggleAttribute("inert", i !== at); });
  root.querySelectorAll("[data-slide-to]").forEach((dot, i) => { dot.classList.toggle("is-on", i === at); dot.toggleAttribute("aria-current", i === at); });
  const pos = root.querySelector("[data-slide-pos]"); if (pos) pos.textContent = at + 1;
  const label = root.querySelector("[data-slide-label]");
  if (label) { label.textContent = at === 0 ? "Eerst dit" : "Daarna"; label.classList.toggle("is-later", at > 0); }
  const [prev, next] = root.querySelectorAll("[data-slide-dir]");
  if (prev) prev.disabled = at === 0;
  if (next) next.disabled = at === slides.length - 1;
}

function slideTo(track, index) {
  const slides = [...track.children];
  const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
  if (!slide) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.scrollTo({ left: slide.offsetLeft - slides[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
}

document.addEventListener("scroll", (event) => {
  if (event.target instanceof Element && event.target.matches("[data-slider]")) syncSlider(event.target);
}, true);

document.addEventListener("click", (event) => {
  const control = event.target.closest("[data-slide-to], [data-slide-dir]");
  const peek = !control && event.target.closest(".slide:not(.is-active)");
  if (!control && !peek) return;
  const root = (control || peek).closest(".slider");
  const track = root?.querySelector("[data-slider]");
  if (!track) return;
  event.preventDefault();
  event.stopPropagation();
  if (peek) return slideTo(track, [...track.children].indexOf(peek));
  if (control.dataset.slideTo != null) return slideTo(track, Number(control.dataset.slideTo));
  slideTo(track, (state.deskSlide || 0) + Number(control.dataset.slideDir));
}, true);

function renderPrepared(meeting) {
  const date = new Date(meeting.date + "T00:00:00Z");
  const agenda = agendaOf(meeting);
  const adopted = agenda.stage === "sent";
  const count = agenda.items.length + 3;
  const route = { view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id };
  return `<a class="prep" href="${pageHref(route)}" data-action="action-meeting" data-id="${meeting.id}" title="${adopted ? "Agenda verstuurd" : agenda.stage === "final" ? "Agenda definitief, nog niet verstuurd" : `Concept-agenda met ${count} punten`}">
    <span class="prep-date"><small>${deskWeekday.format(date).replace(".", "")}</small><b>${date.getUTCDate()}</b></span>
    <span class="prep-body"><b>${escapeHtml(meeting.title)}</b><em>${escapeHtml(findProject(meeting.project).name)}</em></span>
    <span class="prep-state ${adopted ? "is-done" : ""}" aria-hidden="true">${adopted ? icon("check") : `<i>${count}</i>`}</span>
  </a>`;
}

/* Signaalregel: links het signaal, rechts de voorgestelde actie */
function renderSignalLine(signal) {
  const deadline = signalActions[signal.id]?.by;
  const days = deskDaysLeft(deadline);
  const [main] = signalSteps(signal);
  const kind = main ? signalActionKind(main.step) : null;
  const placed = state.onAgenda?.[signal.id];
  return `<li class="line">
    <button type="button" class="line-signal" data-action="open-signal" data-id="${signal.id}" id="overview-${signal.id}">
      <span class="line-count" data-urgency="${signalUrgency(deadline)}"><b>${days == null ? "–" : Math.abs(days)}</b><small>${deskCountLabel(days)}</small></span>
      <span class="line-body"><b>${escapeHtml(signal.title)}</b><em><span class="mini-cert cert--${signal.level}"></span>${escapeHtml(findProject(signal.project).name)} · ${certaintyLabels[signal.level]}</em></span>
    </button>
    ${main ? placed
      ? `<span class="line-action is-done">${icon("check")}<span>Op de agenda</span></span>`
      : `<button type="button" class="line-action" data-action="signal-step" data-id="${signal.id}" data-i="${main.index}" title="${escapeHtml(kind.verb)}">${icon(kind.glyph)}<span>${escapeHtml(main.step.label)}</span><i class="line-go">${icon("chev")}</i></button>` : ""}
  </li>`;
}

/* Vooruit: mijlpalen en signaaldeadlines per project, komende vier maanden */
function renderForward() {
  const start = Date.parse(demoTodayIso + "T00:00:00Z");
  const span = 120 * dayMs;
  const pos = (date) => Math.max(0, Math.min(100, ((planDateTime(date) - start) / span) * 100));
  const inRange = (date) => planDateTime(date) >= start && planDateTime(date) <= start + span;
  const months = [];
  for (let i = 0; i < 5; i += 1) {
    const d = new Date(start); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + i + 1);
    const x = ((d - start) / span) * 100;
    if (x < 100) months.push(`<span style="left:${x.toFixed(2)}%">${new Intl.DateTimeFormat("nl-NL", { month: "short", timeZone: "UTC" }).format(d).replace(".", "")}</span>`);
  }
  const key = { "Onder druk": "druk", "Aandacht nodig": "aandacht", "Op koers": "koers" };
  const lanes = projects.map((project) => {
    const ms = projectMilestones(project.id).filter((m) => inRange(m.date) || (m.forecast && inRange(m.forecast)));
    const sigs = openSignals().filter((s) => s.project === project.id && signalActions[s.id]?.by && inRange(signalActions[s.id].by));
    const status = primaryProjectMilestone(project.id)?.status ?? "Op koers";
    const route = { view: "project", projectId: project.id, section: "planning" };
    let lastLabel = -100;
    return `<a class="fw-lane" href="${pageHref(route)}" data-action="nav" data-view="project" data-project="${project.id}" data-section="planning">
      <span class="fw-name"><span class="np-dot" data-status="${escapeHtml(status)}"></span>${escapeHtml(project.name)}</span>
      <span class="fw-track">
        ${sigs.map((s) => `<i class="fw-sig" style="left:${pos(signalActions[s.id].by).toFixed(2)}%" title="${escapeHtml(s.title)} · uiterlijk ${formatPlanDate(signalActions[s.id].by)}"></i>`).join("")}
        ${ms.sort((a, b) => planDateTime(a.date) - planDateTime(b.date)).map((m) => {
          const x = pos(m.date);
          const showLabel = x - lastLabel > 22;
          if (showLabel) lastLabel = x;
          const slip = m.forecast && !m.approved && planDateTime(m.forecast) > planDateTime(m.date);
          return `${slip ? `<i class="fw-slip" style="left:${pos(m.date).toFixed(2)}%;width:${(pos(m.forecast) - pos(m.date)).toFixed(2)}%"></i><i class="fw-ms fw-ms--ghost" style="left:${pos(m.forecast).toFixed(2)}%" title="Mogelijk ${formatPlanDate(m.forecast)}"></i>` : ""}
          <i class="fw-ms" data-s="${key[m.status] ?? "koers"}" style="left:${pos(m.date).toFixed(2)}%" title="${escapeHtml(m.name)} · ${formatPlanDate(m.date)} · ${escapeHtml(m.status)}"></i>
          ${showLabel ? `<em class="fw-label" style="left:${x.toFixed(2)}%">${escapeHtml(m.name)}</em>` : ""}`;
        }).join("")}
      </span>
    </a>`;
  }).join("");
  return `<div class="fw" aria-label="Mijlpalen en signalen in de komende vier maanden">
    <div class="fw-axis"><span class="fw-now">Nu</span>${months.join("")}</div>
    ${lanes}
    <div class="fw-key" aria-hidden="true"><span><i class="fw-ms" data-s="druk"></i>Mijlpaal onder druk</span><span><i class="fw-ms fw-ms--ghost"></i>Mogelijk later</span><span><i class="fw-sig"></i>Signaal: uiterlijk handelen</span></div>
  </div>`;
}

function deskBriefing(n, first, second) {
  if (!first) return "Er vraagt deze week niets om een besluit. Vicki houdt de stukken bij en meldt zich als er iets verandert.";
  const days = deskDaysLeft(signalActions[first.id]?.by);
  const kans = openSignals().find((signal) => signalLinks[signal.id]?.soort === "vooruitwerken");
  const slip = projects.map((p) => ({ p, m: primaryProjectMilestone(p.id) })).find(({ m }) => m?.forecast && !m.approved);
  const parts = [
    `Het belangrijkste deze week: ${lowerFirst(first.title)} bij <b>${escapeHtml(findProject(first.project).name)}</b>${days != null ? `, nog ${days} ${days === 1 ? "dag" : "dagen"}` : ""}.`,
    kans ? `Vooruitwerken: bij <b>${escapeHtml(findProject(kans.project).name)}</b> ${signalLinks[kans.id].brief}` : second ? `Daarna ${lowerFirst(second.title)} bij <b>${escapeHtml(findProject(second.project).name)}</b>.` : "",
    slip ? `Vooruitkijkend: ${lowerFirst(slip.m.name)} van <b>${escapeHtml(slip.p.name)}</b> schuift mogelijk van ${formatPlanDate(slip.m.date)} naar ${formatPlanDate(slip.m.forecast)}.` : "",
  ];
  return parts.filter(Boolean).join(" ");
}

function renderDesk() {
  const n = deskNumbers();
  const live = !["laden", "leeg", "fout"].includes(currentScenario());
  const first = live ? n.open[0] : null;
  const totalSignals = n.open.length + n.extraSignals;
  const prepared = n.upcoming.filter((m) => m.proposal?.length).slice(0, 3);

  return `<section class="desk">
    <h1 class="visually-hidden">Overzicht</h1>

    <section class="brief" aria-labelledby="brief-title">
      <div class="brief-head">
        <img class="brief-vicki" src="${localPath("assets/vicki.svg")}" width="28" height="28" alt="">
        <h2 id="brief-title">Je briefing</h2>
        <span class="brief-src">${deskDay.format(new Date(demoTodayIso + "T00:00:00Z"))} · 14 nieuwe stukken gelezen</span>
      </div>
      ${withDataState(
        () => `<p class="brief-text">${deskBriefing(n, first, n.open[1])}</p>`,
        { empty: { title: "Nog geen projecten gekoppeld", text: "Koppel een SharePoint-map of Outlook-agenda. Vicki leest de stukken en maakt hier je briefing.", glyph: "layers", action: '<button class="btn btn--sm btn--rise" data-action="toast" data-text="Bronnen koppelen (niet in deze demo)">Bron koppelen</button>' }, rows: 2, wrap: "brief-text" },
      )}
      <div class="desk-ask">
        <h2><label for="ta-home">Vraag door</label></h2>
        ${renderComposer("home", { placeholder: "Vraag door op je briefing…" })}
      </div>
    </section>

    ${first || state.triage ? `${renderFirstSlider(state.triage ? state.triage.ids.map(findSignal) : n.open, totalSignals)}${state.triage ? "" : renderHiddenSignals()}` : `<section class="desk-block" aria-labelledby="later-title">
      <header class="desk-sec"><h2 id="later-title">Signalen</h2></header>
      ${renderHiddenSignals()}
      ${withDataState(
        () => renderState({ title: "Niets dat nu aandacht vraagt", text: "Vicki meldt het zodra een stuk afwijkt van een afspraak of een mijlpaal raakt.", glyph: "check", plain: true }),
        { empty: { title: "Geen open signalen", text: "Vicki meldt het zodra een stuk afwijkt van een afspraak of een mijlpaal raakt.", glyph: "check" }, rows: 3, wrap: "line-list" },
      )}
    </section>`}

    <section class="desk-block" aria-labelledby="fw-title">
      <header class="desk-sec"><h2 id="fw-title">Vooruit</h2><span class="desk-hint">Komende vier maanden</span></header>
      ${withDataState(() => renderForward(), { empty: { title: "Nog geen planning", text: "Koppel een planning, dan ziet Vicki welke mijlpalen in de knel komen.", glyph: "gantt" }, rows: 4, wrap: "fw" })}
    </section>

    ${prepared.length && live ? `<section class="desk-block desk-block--quiet" aria-labelledby="prep-title">
      <header class="desk-sec"><h2 id="prep-title">Vicki heeft voorbereid</h2></header>
      <div class="prep-list">${prepared.map(renderPrepared).join("")}</div>
    </section>` : ""}
  </section>`;
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest('[data-action="desk-suggest"]');
  if (!trigger) return;
  state.comp.home.text = trigger.dataset.text;
  state.comp.home.projects = projectsFromMentions(trigger.dataset.text);
  submitComposer("home");
});

/* Na een oordeel schuift de slider naar het volgende signaal dat nog niet is beoordeeld. */
function triageAdvance() {
  const t = state.triage;
  if (!t) return;
  const next = t.ids.findIndex((id, i) => i > (state.deskSlide || 0) && !t.verdicts[id]);
  const fallback = t.ids.findIndex((id) => !t.verdicts[id]);
  const to = next >= 0 ? next : fallback;
  if (to < 0) return;
  setTimeout(() => {
    const track = document.querySelector("[data-slider]");
    if (track) slideTo(track, to);
  }, 380);
}
