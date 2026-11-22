const meetingIsUpcoming = ({ date }) => date >= demoTodayIso;
const meetingDayLong = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const meetingDayShort = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const meetingDay = (iso, format = meetingDayLong) => format.format(new Date(iso + "T00:00:00Z")).replace(".", "");

function meetingsForProject(projectId, upcoming) {
  return meetings
    .filter((meeting) => meeting.project === projectId && meetingIsUpcoming(meeting) === upcoming)
    .sort((first, second) => {
      const order = first.date.localeCompare(second.date) || first.time.localeCompare(second.time);
      return (upcoming ? order : -order) || first.id.localeCompare(second.id);
    });
}

const meetingSeries = (meeting) => meeting.title.split(/\s+#?/)[0].toLowerCase();

/* Het vorige overleg van dezelfde reeks (bouwteam #6 bij bouwteam #7) */
function previousMeeting(meeting) {
  return meetings
    .filter((other) => other.project === meeting.project && other.date < meeting.date && other.doc && meetingSeries(other) === meetingSeries(meeting))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function nextMeetingAfter(meeting) {
  return meetings
    .filter((other) => other.project === meeting.project && other.date > meeting.date && meetingSeries(other) === meetingSeries(meeting))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

/* ── Agenda-toestand ─────────────────────────────────────────────
   concept → (Vicki controleert) → definitief → verstuurd.
   Punten komen gaandeweg binnen: van Vicki, uit signalen of handmatig. */
function agendaOf(meeting) {
  state.agenda ??= {};
  if (!state.agenda[meeting.id]) {
    state.agenda[meeting.id] = {
      stage: "concept",
      seq: 0,
      items: [],
      actions: [],
      late: [],
      rondvraag: [],
    };
    for (const [title, note, source] of meeting.proposal ?? []) addAgendaItem(meeting, { title, note, source, by: "vicki" }, true);
  }
  return state.agenda[meeting.id];
}

function addAgendaItem(meeting, item, quiet = false) {
  const agenda = state.agenda[meeting.id] ?? agendaOf(meeting);
  if (item.source && agenda.items.some((other) => other.source === item.source)) return null;
  const entry = { id: `${meeting.id}-${++agenda.seq}`, title: item.title, note: item.note ?? "", source: item.source ?? null, by: item.by ?? "jij" };
  agenda.items.push(entry);
  if (!quiet) saveTrackingProgress();
  return entry;
}

function agendaOrigin(meeting, item) {
  if (item.late) return { glyph: "plus", text: "Aanvulling" };
  if (item.by === "gesprek") return { glyph: "talk", text: "Uit gesprek met Vicki" };
  if (item.source?.startsWith("s-")) return { glyph: "pulse", text: "Signaal" };
  if (item.source && meetings.some((other) => other.doc === item.source)) return { glyph: "cal", text: "Uit vorig overleg" };
  if (item.source) return { glyph: "doc", text: "Uit het dossier" };
  return { glyph: "task", text: "Door jou" };
}

/* Wat Vicki nog zou toevoegen: open signalen en acties die nog nergens staan */
function agendaSuggestions(meeting) {
  const agenda = agendaOf(meeting);
  const projectSignals = sortSignalsByAction(openSignals()).filter((signal) => signal.project === meeting.project);
  const points = projectSignals
    .filter((signal) => !agenda.items.some((item) => item.source === signal.id))
    .map((signal) => ({ kind: "punt", id: signal.id, title: signal.title, note: signalDescription(signal).why }));
  const linked = new Set(Object.values(actionSignalLinks));
  const actions = projectSignals
    .filter((signal) => signalActions[signal.id] && !linked.has(signal.id) && !agenda.actions.includes(signal.id))
    .map((signal) => ({ kind: "actie", id: signal.id, title: signalActions[signal.id].action, note: signalActions[signal.id].owner }));
  return [...points, ...actions];
}

function meetingActionRows(meeting) {
  const byId = new Map(projectActions(meeting.project).map((action) => [action.id, action]));
  const carried = (meeting.actions ?? []).map(([, title]) => byId.get(meetingActionId(meeting.project, title))).filter(Boolean);
  const proposed = (meetingIsUpcoming(meeting) ? agendaOf(meeting).actions : []).map((id) => ({
    id: "vicki:" + id,
    title: signalActions[id].action,
    owner: signalActions[id].owner,
    deadline: planDateIso(signalActions[id].by),
    status: "Nieuw",
    proposed: true,
  }));
  return [...carried, ...proposed];
}

function meetingAttachments(meeting) {
  const agenda = agendaOf(meeting);
  const docs = [previousMeeting(meeting)?.doc, ...agenda.items.map((item) => item.source).filter((source) => source && documents[source])];
  return [...new Set(docs.filter(Boolean))];
}

function agendaOutline(meeting) {
  const agenda = agendaOf(meeting);
  const previous = previousMeeting(meeting);
  return [
    previous ? `Opening en verslag ${previous.title.toLowerCase()}` : "Opening",
    ...agenda.items.map((item) => item.title),
    "Actielijst",
    "Rondvraag en sluiting",
  ];
}

/* ── Pagina ─────────────────────────────────────────────────── */
function renderMeetings(project) {
  const selected = findMeeting(state.selMeeting[project.id]);
  if (selected && selected.project === project.id) return renderMeetingPage(project, selected);
  return `<section class="page meetings-page">
    ${renderProjectHeader(project)}
    ${renderMeetingGroup(project, true)}
    ${renderMeetingGroup(project, false)}
  </section>`;
}

function renderMeetingGroup(project, upcoming) {
  const group = meetingsForProject(project.id, upcoming);
  const id = upcoming ? "upcoming-meetings" : "past-meetings";
  return `<section class="meeting-group" aria-labelledby="${id}">
    <header class="section-header"><h2 id="${id}">${upcoming ? "Komend" : "Geweest"}</h2><span class="group-count">${group.length}</span></header>
    ${group.length ? `<div class="meeting-rows">${group.map(renderMeetingRow).join("")}</div>` : `<p class="empty">${upcoming ? "Er staan geen vergaderingen gepland." : "Er zijn nog geen vergaderingen met een verslag."}</p>`}
  </section>`;
}

const agendaStages = [
  ["concept", "Concept"],
  ["final", "Definitief"],
  ["sent", "Verstuurd"],
];

function meetingStatus(meeting) {
  if (!meetingIsUpcoming(meeting)) {
    const open = meetingActionRows(meeting).filter((action) => action.status !== "Afgerond").length;
    return { tone: "past", html: `${meeting.decisions.length} ${meeting.decisions.length === 1 ? "besluit" : "besluiten"}${open ? ` · <em>${open} ${open === 1 ? "actie" : "acties"} open</em>` : ""}` };
  }
  const agenda = agendaOf(meeting);
  const late = agenda.late.length;
  if (agenda.stage === "sent") return { tone: "sent", html: `${icon("lock")}Verstuurd${late ? " · aanvulling klaar" : ""}` };
  if (agenda.stage === "final") return { tone: "final", html: `${icon("check")}Definitief` };
  return { tone: "concept", html: `<i class="ml-dot"></i>Concept · ${agenda.items.length + 3} punten` };
}

function renderMeetingRow(meeting) {
  const upcoming = meetingIsUpcoming(meeting);
  const days = Math.round((Date.parse(meeting.date + "T00:00:00Z") - planDateTime(demoToday)) / dayMs);
  const weeksAgo = Math.max(1, Math.round(-days / 7));
  const relative = upcoming ? (days === 0 ? "vandaag" : days === 1 ? "morgen" : `over ${days} dagen`) : `${weeksAgo} ${weeksAgo === 1 ? "week" : "weken"} geleden`;
  const status = meetingStatus(meeting);
  const route = { view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id };
  return `<a class="meeting-link" id="${meeting.id}" href="${pageHref(route)}" data-action="open-meeting" data-id="${meeting.id}">
    <time class="meeting-date" datetime="${meeting.date}T${meeting.time}"><b>${meetingDay(meeting.date, meetingDayShort)}</b><small>${relative}</small></time>
    <span class="meeting-name"><b>${escapeHtml(meeting.title)}</b><small>${meeting.time} · ${escapeHtml(meeting.place)}</small></span>
    <span class="meeting-status" data-tone="${status.tone}">${status.html}</span>
    ${icon("chev")}
  </a>`;
}

function renderMeetingPage(project, meeting) {
  const upcoming = meetingIsUpcoming(meeting);
  return `<section class="page meetings-page meeting-page">
    <nav class="m-back"><button type="button" data-action="close-meeting" data-id="${project.id}">${icon("back")}<span>${escapeHtml(project.name)} · Vergaderingen</span></button></nav>
    <header class="m-head">
      <div>
        <h1>${escapeHtml(meeting.title)}</h1>
        <p class="m-when">${meetingDay(meeting.date)} · ${meeting.time} · ${escapeHtml(meeting.place)}</p>
      </div>
      ${upcoming ? renderAgendaStepper(agendaOf(meeting).stage) : `<span class="m-past-tag">Geweest</span>`}
    </header>
    <div class="m-layout">
      <div class="m-main">${upcoming ? renderAgendaSheet(meeting) : renderMinutesSheet(meeting)}</div>
      <aside class="m-aside">${upcoming ? renderAgendaAside(meeting) : renderMinutesAside(meeting)}</aside>
    </div>
    ${upcoming ? renderAgendaLockDialog(meeting) + renderAgendaMail(meeting) : ""}
  </section>`;
}

function renderAgendaStepper(stage) {
  const at = agendaStages.findIndex(([key]) => key === stage);
  return `<ol class="m-steps" aria-label="Status van de agenda">${agendaStages.map(([key, label], index) => `<li class="${index < at ? "is-done" : index === at ? "is-now" : ""}"${index === at ? ' aria-current="step"' : ""}><i></i>${label}</li>`).join("")}</ol>`;
}

/* De agenda zoals hij straks verstuurd wordt: een vel papier */
function renderAgendaSheet(meeting) {
  const agenda = agendaOf(meeting);
  const editable = agenda.stage === "concept";
  const previous = previousMeeting(meeting);
  const actions = meetingActionRows(meeting);
  const outlineCount = agenda.items.length + 3;
  let n = 0;
  const fixed = (title, body = "") => `<li class="m-item is-fixed"><span class="agenda-n">${++n}</span><div><b>${escapeHtml(title)}</b>${body}</div></li>`;
  return `<article class="m-sheet" data-stage="${agenda.stage}" aria-labelledby="sheet-title-${meeting.id}">
    <header class="m-sheet-head">
      <div><span class="m-kicker">Agenda</span><h2 id="sheet-title-${meeting.id}">${escapeHtml(meeting.title)} · ${escapeHtml(findProject(meeting.project).name)}</h2>
      <p>${meetingDay(meeting.date)} · ${meeting.time} · ${escapeHtml(meeting.place)}</p></div>
      ${agenda.stage === "sent" ? `<span class="m-stamp">${icon("lock")}Verstuurd ${meetingDay(agenda.sentAt ?? demoTodayIso, meetingDayShort)}</span>` : agenda.stage === "final" ? `<span class="m-stamp is-final">${icon("check")}Definitief</span>` : `<span class="m-stamp is-concept">Concept</span>`}
    </header>
    <ol class="m-items">
      ${fixed(previous ? `Opening en verslag ${previous.title.toLowerCase()}` : "Opening", previous ? `<p>Verslag van ${meetingDay(previous.date, meetingDayShort)} ter vaststelling.</p>` : "")}
      ${agenda.items.map((item) => renderAgendaItem(meeting, item, ++n, editable)).join("")}
      ${fixed("Actielijst", actions.length ? `<ul class="m-actions">${actions.map(renderAgendaAction).join("")}</ul>` : '<p>Geen openstaande acties.</p>')}
      ${fixed("Rondvraag en sluiting", agenda.rondvraag.length ? `<ul class="m-rondvraag">${agenda.rondvraag.map((title) => `<li>${escapeHtml(title)}</li>`).join("")}</ul>` : "")}
    </ol>
    ${editable ? `<form class="m-add" data-action-submit="agenda-add" data-id="${meeting.id}">
      <label class="visually-hidden" for="agenda-add-${meeting.id}">Agendapunt toevoegen</label>
      ${icon("plus")}<input id="agenda-add-${meeting.id}" name="title" autocomplete="off" placeholder="Punt toevoegen">
      <button type="submit" class="m-add-go" aria-label="Voeg toe">${icon("enter")}</button>
    </form>` : agenda.stage === "sent" ? `<button type="button" class="m-add m-add--locked" data-action="agenda-locked" data-id="${meeting.id}">${icon("lock")}<span>Nog iets toevoegen</span></button>` : ""}
    <footer class="m-sheet-foot"><span class="m-count">${outlineCount} punten</span>${meetingAttachments(meeting).length ? `<span>${icon("clip")}${meetingAttachments(meeting).map((doc) => `<a href="${sourceHref(doc)}" data-action="open-doc" data-doc="${doc}">${escapeHtml(documents[doc].title)}</a>`).join(", ")}</span>` : ""}</footer>
  </article>`;
}

function renderAgendaItem(meeting, item, number, editable) {
  const origin = agendaOrigin(meeting, item);
  const link = item.source?.startsWith("s-")
    ? `<button type="button" class="m-src" data-action="open-signal" data-id="${item.source}">${icon(origin.glyph)}${origin.text}</button>`
    : item.source ? `<a class="m-src" href="${sourceHref(item.source)}" data-action="open-doc" data-doc="${item.source}">${icon(origin.glyph)}${origin.text}</a>`
    : `<span class="m-src">${icon(origin.glyph)}${origin.text}</span>`;
  return `<li class="m-item${item.late ? " is-late" : ""}" id="item-${item.id}">
    <span class="agenda-n">${number}</span>
    <div><b>${escapeHtml(item.title)}</b>${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}${link}</div>
    ${editable ? `<button type="button" class="m-remove" data-action="agenda-remove" data-id="${meeting.id}" data-item="${item.id}" aria-label="Haal weg: ${escapeHtml(item.title)}" title="Haal weg">${icon("x")}</button>` : ""}
  </li>`;
}

function renderAgendaAction(action) {
  const late = action.deadline && action.deadline < demoTodayIso && action.status !== "Afgerond";
  return `<li class="${action.proposed ? "is-proposed" : ""}">
    <span class="m-check" data-status="${escapeHtml(action.status)}">${action.status === "Afgerond" ? icon("check") : ""}</span>
    <span class="m-action-title">${escapeHtml(action.title)}</span>
    <span class="m-action-meta">${escapeHtml(action.owner.replace(/\s*\(.*\)/, ""))}${action.deadline ? ` · <span class="${late ? "is-late" : ""}">${formatIsoDate(action.deadline)}</span>` : ""}</span>
  </li>`;
}

/* Rechterkolom: één ding om te doen, plus wat Vicki nog voorstelt */
function renderAgendaAside(meeting) {
  const agenda = agendaOf(meeting);
  const checking = state.agendaCheck?.id === meeting.id;
  const suggestions = checking ? [] : agenda.stage === "concept" ? agendaSuggestions(meeting) : agenda.stage === "sent" ? agendaSuggestions(meeting).filter((suggestion) => suggestion.kind === "punt") : [];
  return `${renderAgendaStageCard(meeting)}
    ${suggestions.length ? `<section class="m-card m-suggest" aria-labelledby="suggest-${meeting.id}">
      <h3 id="suggest-${meeting.id}">${vickiIcon()}<span>Vicki stelt voor</span></h3>
      <ul>${suggestions.map((suggestion) => `<li>
        <span class="m-sg-kind">${icon(suggestion.kind === "punt" ? "pulse" : "task")}${suggestion.kind === "punt" ? "Agendapunt" : "Actiepunt"}</span>
        <b>${escapeHtml(suggestion.title)}</b>
        <small>${escapeHtml(suggestion.kind === "punt" ? suggestion.note : suggestion.note)}</small>
        <button type="button" class="m-sg-add" data-action="agenda-suggest" data-id="${meeting.id}" data-kind="${suggestion.kind}" data-signal="${suggestion.id}" aria-label="Zet op de agenda: ${escapeHtml(suggestion.title)}">${icon("plus")}<span>${suggestion.kind === "punt" ? "Zet erop" : "Neem op"}</span></button>
      </li>`).join("")}</ul>
    </section>` : ""}
    <section class="m-card m-people" aria-label="Deelnemers">
      <h3>${meeting.people.length} deelnemers</h3>
      <ul>${meeting.people.map((person) => `<li><i>${escapeHtml(personInitials(person))}</i><span>${escapeHtml(person)}</span></li>`).join("")}</ul>
    </section>
    <button type="button" class="m-ask" data-action="meeting-prep" data-id="${meeting.id}">${vickiIcon()}<span>Werk de agenda uit met Vicki</span>${icon("chev")}</button>`;
}

function personInitials(person) {
  return person.replace(/\s*\(.*\)/, "").split(/\s+/).filter((word) => /^[A-Z]/.test(word)).map((word) => word[0]).slice(0, 2).join("") || person[0];
}

function renderAgendaStageCard(meeting) {
  const agenda = agendaOf(meeting);
  const check = state.agendaCheck?.id === meeting.id ? state.agendaCheck : null;
  if (check) return renderAgendaCheck(meeting, check);
  if (agenda.stage === "concept") {
    return `<section class="m-card m-stage">
      <h3>Concept</h3>
      <p>Voeg gaandeweg punten toe. Ben je klaar, dan loopt Vicki het dossier en het vorige overleg nog één keer na.</p>
      <button type="button" class="btn btn--pill" data-action="agenda-finalize" data-id="${meeting.id}">Maak definitief</button>
    </section>`;
  }
  if (agenda.stage === "final") {
    return `<section class="m-card m-stage m-stage--send">
      <h3>Klaar om te versturen</h3>
      <p>Naar ${meeting.people.length} deelnemers, met ${meetingAttachments(meeting).length} ${meetingAttachments(meeting).length === 1 ? "bijlage" : "bijlagen"}.</p>
      <button type="button" class="btn btn--pill" data-action="agenda-send" data-id="${meeting.id}">${icon("send")}Verstuur via Rise</button>
      <div class="m-stage-alt">
        <button type="button" data-action="agenda-pdf" data-id="${meeting.id}">${icon("download")}Download pdf</button>
        <button type="button" data-action="agenda-mail" data-id="${meeting.id}" aria-expanded="${state.agendaMail === meeting.id}">${icon("mail")}Conceptmail</button>
      </div>
      <button type="button" class="m-link" data-action="agenda-reopen" data-id="${meeting.id}">Toch nog iets wijzigen</button>
    </section>`;
  }
  const late = agenda.late.length;
  return `<section class="m-card m-stage m-stage--sent">
    <h3>${icon("lock")}Agenda staat vast</h3>
    <p>Verstuurd op ${meetingDay(agenda.sentAt ?? demoTodayIso, meetingDayShort)} aan ${meeting.people.length} deelnemers.</p>
    ${late ? `<p class="m-late-note"><b>${late} ${late === 1 ? "aanvulling" : "aanvullingen"}</b> nog niet verstuurd.</p>
      <button type="button" class="btn btn--pill" data-action="agenda-send-late" data-id="${meeting.id}">${icon("send")}Verstuur aanvulling</button>` : ""}
    <div class="m-stage-alt">
      <button type="button" data-action="agenda-pdf" data-id="${meeting.id}">${icon("download")}Download pdf</button>
      <button type="button" data-action="agenda-mail" data-id="${meeting.id}" aria-expanded="${state.agendaMail === meeting.id}">${icon("mail")}${late ? "Mail aanvulling" : "Verstuurde mail"}</button>
    </div>
  </section>`;
}

/* Vicki loopt alles nog één keer na voordat de agenda vastgaat */
function agendaCheckFindings(meeting) {
  const previous = previousMeeting(meeting);
  const projectDocs = Object.values(documents).filter((doc) => doc.project === meeting.project).length;
  const openProjectSignals = openSignals().filter((signal) => signal.project === meeting.project);
  const openActions = meetingActionRows(meeting).filter((action) => action.status !== "Afgerond");
  const steps = [
    ["Projectdossier doorgelezen", `${projectDocs} stukken`],
    previous ? [`Vergeleken met ${previous.title.toLowerCase()}`, meetingDay(previous.date, meetingDayShort)] : ["Geen vorig overleg in deze reeks", ""],
    ["Open signalen nagelopen", String(openProjectSignals.length)],
    ["Actielijst bijgewerkt", `${openActions.length} open`],
  ];
  const findings = [
    ...agendaSuggestions(meeting).filter((suggestion) => suggestion.kind === "punt").map((suggestion) => ({
      text: `<b>${escapeHtml(suggestion.title)}</b> staat nog niet op de agenda.`,
      add: suggestion,
    })),
  ];
  const due = openActions.filter((action) => !action.proposed && action.deadline && action.deadline <= meeting.date);
  if (due.length) findings.push({
    text: `${due.length === 1 ? "Eén actie moet af" : `${due.length} acties moeten af`} vóór dit overleg en ${due.length === 1 ? "staat" : "staan"} nog open: ${due.map((action) => `<b>${escapeHtml(action.title.charAt(0).toLowerCase() + action.title.slice(1))}</b> (${escapeHtml(action.owner.replace(/\s*\(.*\)/, ""))})`).join(" en ")}. Ze staan op de actielijst.`,
  });
  return { steps, findings };
}

function renderAgendaCheck(meeting, check) {
  const { steps, findings } = agendaCheckFindings(meeting);
  const done = check.step >= steps.length;
  return `<section class="m-card m-stage m-check-card" aria-live="polite">
    <h3>${vickiIcon()}<span>${done ? "Vicki heeft alles nagelopen" : "Vicki loopt alles na"}</span></h3>
    <ul class="m-check-steps">${steps.map(([label, meta], index) => `<li class="${index < check.step ? "is-done" : index === check.step ? "is-now" : ""}"><i>${index < check.step ? icon("check") : ""}</i><span>${escapeHtml(label)}</span><small>${index < check.step ? escapeHtml(meta) : ""}</small></li>`).join("")}</ul>
    ${done ? `${findings.length ? `<ul class="m-findings">${findings.map((finding) => `<li><p>${finding.text}</p>${finding.add ? `<button type="button" class="m-sg-add" data-action="agenda-suggest" data-id="${meeting.id}" data-kind="punt" data-signal="${finding.add.id}">${icon("plus")}<span>Zet erop</span></button>` : ""}</li>`).join("")}</ul>` : `<p class="m-ok">${icon("check")}Niets gemist. De agenda is compleet.</p>`}
      <button type="button" class="btn btn--pill" data-action="agenda-confirm" data-id="${meeting.id}">Maak definitief</button>
      <button type="button" class="m-link" data-action="agenda-check-cancel">Terug naar concept</button>` : ""}
  </section>`;
}

function agendaMailText(meeting, lateOnly = false) {
  const agenda = agendaOf(meeting);
  const when = `${meetingDay(meeting.date)} om ${meeting.time}`;
  const attachments = meetingAttachments(meeting).map((doc) => documents[doc].title);
  if (lateOnly) {
    return {
      subject: `Aanvulling agenda ${meeting.title} · ${meetingDay(meeting.date, meetingDayShort)}`,
      body: `Beste allen,\n\nAan de agenda van ${meeting.title.toLowerCase()} van ${when} voeg ik nog toe:\n\n${agenda.late.map((id) => `- ${agenda.items.find((item) => item.id === id)?.title ?? ""}`).join("\n")}\n\nDe rest van de agenda blijft zoals verstuurd.\n\nGroet,\n${profile.first}`,
    };
  }
  return {
    subject: `Agenda ${meeting.title} · ${meetingDay(meeting.date, meetingDayShort)}, ${meeting.time}`,
    body: `Beste allen,\n\nHierbij de agenda voor ${meeting.title.toLowerCase()} van ${when} (${meeting.place}).\n\n${agendaOutline(meeting).map((title, index) => `${index + 1}. ${title}`).join("\n")}\n\n${attachments.length ? `Bijlagen: ${attachments.join(", ")}.\n\n` : ""}Vul gerust aan als ik iets mis.\n\nGroet,\n${profile.first}`,
  };
}

function renderAgendaMail(meeting) {
  if (state.agendaMail !== meeting.id) return "";
  const agenda = agendaOf(meeting);
  const { subject, body } = agendaMailText(meeting, agenda.stage === "sent" && agenda.late.length > 0);
  return `<div class="m-scrim" data-action="agenda-mail" data-id="${meeting.id}"></div>
  <section class="m-dialog m-dialog--mail" role="dialog" aria-modal="true" aria-label="Conceptmail">
    <button type="button" class="m-dialog-close" data-action="agenda-mail" data-id="${meeting.id}" aria-label="Sluit">${icon("x")}</button>
    <div class="draft">
    <div class="draft-head"><span>${vickiIcon()}Vicki heeft een mail klaargezet · niet verstuurd</span><b>Aan: ${escapeHtml(meeting.people.map((person) => person.replace(/\s*\(.*\)/, "")).join(", "))}</b><b>Onderwerp: ${escapeHtml(subject)}</b></div>
    <pre>${escapeHtml(body)}</pre>
    <div class="b-actions">
      <button type="button" class="btn btn--rise btn--sm" data-action="copy-draft">Kopieer</button>
      <a class="btn btn--ghost btn--sm" href="mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">Open in je mailprogramma</a>
    </div>
    </div>
  </section>`;
}

/* Na versturen staat de agenda vast: een wijziging vraagt een keuze */
function renderAgendaLockDialog(meeting) {
  const pending = state.agendaLock?.id === meeting.id ? state.agendaLock : null;
  if (!pending) return "";
  return `<div class="m-scrim" data-action="agenda-lock-cancel"></div>
  <div class="m-dialog" role="dialog" aria-modal="true" aria-labelledby="lock-title">
    <span class="m-dialog-icon">${icon("lock")}</span>
    <h2 id="lock-title">De agenda is al verstuurd</h2>
    <p>${pending.title ? `Wat wil je met <b>${escapeHtml(pending.title)}</b> doen?` : "Alle deelnemers hebben de agenda al. Hoe wil je iets toevoegen?"}</p>
    ${pending.title ? "" : `<label class="visually-hidden" for="lock-title-input">Nieuw punt</label><input id="lock-title-input" class="m-dialog-input" placeholder="Wat wil je toevoegen?" autocomplete="off">`}
    <div class="m-dialog-options">
      <button type="button" data-action="agenda-lock-choice" data-choice="late"><b>Stuur als aanvulling</b><small>Vicki zet een korte mail klaar met alleen dit punt.</small></button>
      <button type="button" data-action="agenda-lock-choice" data-choice="rondvraag"><b>Bewaar voor de rondvraag</b><small>Komt onder de rondvraag, zonder nieuwe mail.</small></button>
      <button type="button" data-action="agenda-lock-choice" data-choice="reopen"><b>Heropen de agenda</b><small>Terug naar concept. Daarna verstuur je hem opnieuw.</small></button>
    </div>
    <button type="button" class="m-link" data-action="agenda-lock-cancel">Annuleer</button>
  </div>`;
}

/* ── Geweest: verslag dat laat zien wat er sindsdien gebeurde ─────────── */
function renderMinutesSheet(meeting) {
  const actions = meetingActionRows(meeting);
  return `<article class="m-sheet m-sheet--minutes" aria-labelledby="sheet-title-${meeting.id}">
    <header class="m-sheet-head">
      <div><span class="m-kicker">Verslag</span><h2 id="sheet-title-${meeting.id}">${escapeHtml(meeting.title)} · ${escapeHtml(findProject(meeting.project).name)}</h2>
      <p>${meetingDay(meeting.date)} · ${escapeHtml(meeting.people.map((person) => person.replace(/\s*\(.*\)/, "")).join(", "))}</p></div>
    </header>
    ${meeting.doc ? `<section class="m-block"><h3>${vickiIcon()}<span>In het kort</span></h3><p class="m-summary">${escapeHtml(documents[meeting.doc].summary)}</p></section>` : ""}
    <section class="m-block"><h3>Besluiten</h3>
      ${meeting.decisions.length ? `<ol class="m-decisions">${meeting.decisions.map((decision) => `<li><i>${icon("check")}</i><span>${escapeHtml(decision)}</span></li>`).join("")}</ol>` : '<p class="muted">Geen besluiten vastgelegd.</p>'}
    </section>
    <section class="m-block"><h3>Actiepunten <span class="m-block-meta">stand van vandaag</span></h3>
      ${actions.length ? `<ul class="m-actions">${actions.map(renderAgendaAction).join("")}</ul>` : '<p class="muted">Geen actiepunten vastgelegd.</p>'}
    </section>
    ${meeting.doc ? `<footer class="m-sheet-foot"><span>${icon("clip")}<a href="${sourceHref(meeting.doc)}" data-action="open-doc" data-doc="${meeting.doc}">${escapeHtml(documents[meeting.doc].title)}</a></span></footer>` : ""}
  </article>`;
}

function renderMinutesAside(meeting) {
  const actions = meetingActionRows(meeting);
  const open = actions.filter((action) => action.status !== "Afgerond");
  const next = nextMeetingAfter(meeting);
  return `<section class="m-card m-since">
      <h3>Sindsdien</h3>
      <p class="m-since-big"><b>${actions.length - open.length}</b><span>van ${actions.length} acties afgerond</span></p>
      <div class="m-progress" aria-hidden="true"><i style="width:${actions.length ? ((actions.length - open.length) / actions.length) * 100 : 0}%"></i></div>
      ${next ? `<p>${open.length ? `${open.length === 1 ? "De open actie komt" : `De ${open.length} open acties komen`} terug op de actielijst van` : "Volgende overleg:"}</p>
        <a class="m-next" href="${pageHref({ view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: next.id })}" data-action="open-meeting" data-id="${next.id}"><span><b>${escapeHtml(next.title)}</b><small>${meetingDay(next.date, meetingDayShort)}</small></span>${icon("chev")}</a>` : ""}
    </section>
    <button type="button" class="m-ask" data-action="meeting-notes" data-id="${meeting.id}">${vickiIcon()}<span>Vraag Vicki naar dit overleg</span>${icon("chev")}</button>`;
}

function meetingNotesReply(meeting) {
  const actions = projectActions(meeting.project).filter((action) => action.meeting?.id === meeting.id);
  return {
    title: `Notulen van ${meeting.title}`,
    blocks: [
      {
        type: "text",
        html: `<p>${escapeHtml(documents[meeting.doc].summary)}</p><p><strong>Besluiten</strong></p><ul>${meeting.decisions.map((decision) => `<li>${escapeHtml(decision)}</li>`).join("")}</ul>`,
      },
      {
        type: "table",
        head: ["Actie", "Eigenaar", "Deadline", "Status"],
        rows: actions.map(({ title, owner, deadline, status }) =>
          [title, owner, deadline ? formatIsoDate(deadline) : "Geen deadline", status].map(escapeHtml),
        ),
      },
      { type: "sources", items: [[meeting.doc, null]] },
      { type: "actions", items: [{
        label: "Open vergadering",
        go: { view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id },
      }] },
    ],
  };
}
