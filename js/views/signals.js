function renderSignalFacts(signal) {
  const deadline = signalActions[signal.id]?.by;
  return `<dl class="signal-facts">
    <div><dt>Zekerheid</dt><dd>${certaintyBadge(signal.level)}</dd></div>
    <div><dt>Urgentie</dt><dd>${renderSignalUrgency(deadline)}</dd></div>
    <div><dt>Actie uiterlijk</dt><dd>${renderDueDate(deadline && planDateIso(deadline))}</dd></div>
  </dl>`;
}

function renderSignalUrgency(deadline) {
  const urgency = signalUrgency(deadline);
  return `<span class="signal-urgency" data-urgency="${urgency}">${urgency}</span>`;
}

function renderImmediateSignalAction(signal, { compact = false } = {}) {
  const proposed = signalActions[signal.id];
  if (!proposed || signalFollowup(signal.id).status === "Afgerond") return "";
  const index = signal.steps.findIndex((step) => step.primary);
  const step = signal.steps[index];
  const button = step ? `<button type="button" class="btn btn--ghost btn--sm signal-immediate-button" data-action="signal-step" data-id="${signal.id}" data-i="${index}">${escapeHtml(step.cta ?? step.label)} ${icon("chev")}</button>` : "";
  if (compact) return button;
  return `<div class="signal-immediate"><p>${escapeHtml(proposed.action)}</p>${button}</div>`;
}

function renderSignalCard(signal) {
  const description = approvedAcoustics(signal)
    ? `De vergunningaanvraag staat op ${formatPlanDate(deKadeForecast.permit)}`
    : signal.hook;
  return `<article class="signal-entry signal-entry--compact">
    <div class="signal-summary">
      <div class="signal-copy">
        <p class="signal-project">${escapeHtml(findProject(signal.project).name)}</p>
        <h3><button id="overview-${signal.id}" class="signal-open" data-action="open-signal" data-id="${signal.id}">${escapeHtml(signal.title)} ${icon("arrow")}</button></h3>
        <p>${escapeHtml(description)}</p>
        ${renderImmediateSignalAction(signal, { compact: true })}
      </div>
      ${renderSignalFacts(signal)}
    </div>
  </article>`;
}

function approvedAcoustics(signal) {
  return signal.id === "s-dk" && state.planDraft.dk === "approved";
}

function signalDescription(signal) {
  if (!approvedAcoustics(signal)) return signal;
  return {
    what: `Akoestiek Zuid verwacht het rapport op ${formatPlanDate(deKadeForecast.report)}. De aangepaste planning gebruikt deze datum.`,
    why: "De spoorgevel en de aanvraagbundeling blijven afhankelijk van het rapport.",
  };
}

function renderSignalSummary(signal) {
  const status = signalFollowup(signal.id).status;
  const { what, why } = signalDescription(signal);
  return `<div class="signal-summary">
    <div class="signal-copy">
      <h2>${escapeHtml(signal.title)}${status === "Afgerond" ? ' <span class="action-state" data-status="Afgerond">Afgerond</span>' : ""}</h2>
      <dl class="signal-explanation">
        <div><dt>Samenvatting</dt><dd>${escapeHtml(what)}</dd></div>
        <div><dt>Waarom Rise dit toont</dt><dd>${escapeHtml(why)}</dd></div>
      </dl>
    </div>
    ${renderSignalFacts(signal)}
  </div>`;
}

function renderSignalEntry(signal) {
  const expanded = state.selSignal[signal.project] === signal.id;
  return `<article class="signal-entry" id="${signal.id}">
    ${renderSignalSummary(signal)}
    ${renderImmediateSignalAction(signal)}
    <button class="signal-disclosure" id="signal-toggle-${signal.id}" data-action="select-signal" data-id="${signal.id}" aria-expanded="${expanded}" aria-controls="signal-detail-${signal.id}">
      ${expanded ? "Sluit details" : "Bronnen en voorgestelde acties"} ${icon("chev")}
    </button>
    <div id="signal-detail-${signal.id}"${expanded ? "" : " hidden"}>
      ${expanded ? renderSignalDetail(signal) : ""}
    </div>
  </article>`;
}

function renderSource(doc, passage) {
  const source = documents[doc];
  return `<a class="src" href="${sourceHref(doc, passage)}" data-action="open-doc" data-doc="${doc}" data-passage="${passage ?? ""}">${icon("doc")}<span><b>${escapeHtml(source.title)}</b><em>${source.kind} · ${source.date}${source.project ? "" : " · " + dossierGroups[source.dossier].name}</em></span>${icon("arrow", "src-go")}</a>`;
}

function renderSignalPlanDraft() {
  const changedRows = deKadeRows.filter((row) => row.ghostStart || row.ghostEnd || row.ghostMilestone);
  return `<div class="signal-draft">
    <h4>Conceptwijziging voor De Kade</h4>
    <table class="signal-draft-table">
      <thead><tr><th scope="col">Onderdeel</th><th scope="col">Huidig</th><th scope="col">Concept</th></tr></thead>
      <tbody>${changedRows.map((row) => `<tr>
        <th scope="row">${escapeHtml(row.name)}</th>
        <td>${renderScheduleDates(scheduleDates(row))}</td>
        <td>${renderScheduleDates(scheduleDates(row, true))}</td>
      </tr>`).join("")}</tbody>
    </table>
    <div class="followup-actions"><button class="btn btn--rise btn--sm" data-action="plan-approve" data-id="dk">Goedkeuren</button><button class="btn btn--ghost btn--sm" data-action="plan-reject" data-id="dk">Afwijzen</button></div>
  </div>`;
}

function renderSignalSteps(signal) {
  return `<div class="steps">${signal.steps.map((step, index) => `<button class="step" data-action="signal-step" data-id="${signal.id}" data-i="${index}">${step.primary ? riseIcon : icon("chev")}<span>${escapeHtml(step.label)}</span></button>`).join("")}</div>
    ${signal.id === "s-dk" && state.planDraft.dk === true ? renderSignalPlanDraft() : ""}`;
}

function renderSignalEvidence(signal) {
  return `<ul class="claims">${signal.claims.map(([level, claim, doc]) => {
      const text = signal.id === "s-dk" && doc === "dk-plan"
        ? `De basisplanning v7 rekent met ${formatPlanDate(deKadeReport.end)}.` : claim;
      const passage = signal.sources.find(([id]) => id === doc)?.[1];
      return `<li><span>${escapeHtml(text)}${doc ? ` <a class="claim-src" href="${sourceHref(doc, passage)}" data-action="open-doc" data-doc="${doc}" data-passage="${passage ?? ""}">Bekijk bron</a>` : ""}</span>${certaintyBadge(level)}</li>`;
    }).join("")}</ul>
    <div class="srcs">${signal.sources.map(([doc, passage]) => renderSource(doc, passage)).join("")}</div>`;
}

function renderSignalImpact(signal) {
  const affected = projectMilestones(signal.project).find(
    (milestone) => milestone.name === signal.milestone,
  );
  const approved = state.planDraft.dk === "approved";
  const consequence = signal.id === "s-dk"
    ? [
        ["Akoestisch rapport", formatPlanDate(deKadeForecast.report)],
        ["DO gereed", formatPlanDate(deKadeForecast.design)],
        ["Aanvraag omgevingsvergunning", formatPlanDate(deKadeForecast.permit)],
      ]
    : signal.id === "s-dk2" && approved
      ? [signal.consequence[0], ["DO gereed", formatPlanDate(deKadeForecast.design)]]
      : signal.consequence;
  return `${affected ? `<p class="signal-milestone">${escapeHtml(affected.name)} <strong>${renderDueDate(planDateIso(affected.date))}</strong></p>` : ""}
    ${signal.id === "s-dk" ? `<p class="sd-note">${icon("gantt")} ${deKadeImpactLine()}</p>` : ""}
    <div class="chain">${consequence.map(([label, date], index) => `<div class="chain-step ${index === consequence.length - 1 ? "is-end" : ""}"><span>${escapeHtml(label)}</span><b>${escapeHtml(date)}</b></div>`).join("")}</div>`;
}

function renderSignalDetail(signal) {
  return `<div class="signal-detail">
    <section class="signal-section">
      <h3>Voorgestelde acties</h3>
      ${renderSignalSteps(signal)}
      <button class="btn btn--link btn--sm signal-discuss" data-action="discuss-signal" data-id="${signal.id}">${riseIcon}Bespreek met Rise</button>
    </section>
    <section class="signal-section">
      <h3>Herkomst en onderbouwing</h3>
      ${renderSignalEvidence(signal)}
    </section>
    <section class="signal-section">
      <h3>Gevolg voor de planning</h3>
      ${renderSignalImpact(signal)}
    </section>
    ${renderSignalFollowup(signal)}
  </div>`;
}

function renderSignalDrawerSection(key, label, content, hint = "") {
  const expanded = state.drawerSection === key;
  return `<section class="drawer-section">
    <h3><button type="button" class="drawer-section-toggle" id="drawer-toggle-${key}" data-action="drawer-section" data-section="${key}" aria-expanded="${expanded}" aria-controls="drawer-section-${key}">
      <span>${label}</span>${hint ? `<small>${hint}</small>` : ""}${icon("chev")}
    </button></h3>
    <div class="drawer-section-body" id="drawer-section-${key}"${expanded ? "" : " hidden"}>${content}</div>
  </section>`;
}

function renderSignalDrawer() {
  const signal = findSignal(state.drawer);
  if (!signal) return "";
  const project = findProject(signal.project);
  const route = { view: "project", projectId: project.id, section: "signalen" };
  const { what, why } = signalDescription(signal);
  const proposed = signalActions[signal.id];
  const deadline = proposed?.by;
  const done = signalFollowup(signal.id).status === "Afgerond";
  const sourceCount = signal.sources.length;

  return `<div class="scrim" data-action="close-drawer"></div>
  <aside class="drawer" role="dialog" aria-labelledby="signal-drawer-title">
    <header class="drawer-head">
      <span class="drawer-project">${riseIcon}${escapeHtml(project.name)}</span>
      <button id="close-signal-drawer" class="icon-btn" data-action="close-drawer" aria-label="Sluit signaal">${icon("x")}</button>
    </header>
    <div class="drawer-overview">
      <h2 id="signal-drawer-title">${escapeHtml(signal.title)}</h2>
      <p class="drawer-summary">${escapeHtml(what)}</p>
      <div class="drawer-reason"><strong>Waarom Rise dit toont</strong><p>${escapeHtml(why)}</p></div>
      <dl class="drawer-assessment">
        <div><dt>Zekerheid</dt><dd>${certaintyBadge(signal.level)} <small>${escapeHtml(signal.certaintyScope)}</small></dd></div>
        <div><dt>Urgentie</dt><dd>${renderSignalUrgency(deadline)}</dd></div>
      </dl>
    </div>
    ${done ? renderActionStatus("Afgerond") : proposed ? `<section class="drawer-next" aria-labelledby="drawer-next-heading">
      <div class="drawer-next-head"><h3 id="drawer-next-heading">Eerste stap</h3>${deadline ? `<span class="drawer-deadline">Uiterlijk ${renderDueDate(planDateIso(deadline))}</span>` : ""}</div>
      <p>${escapeHtml(proposed.action)}</p>
      ${renderImmediateSignalAction(signal, { compact: true })}
    </section>` : ""}
    <div class="drawer-sections">
      ${renderSignalDrawerSection("sources", "Bronnen en onderbouwing", renderSignalEvidence(signal), `${sourceCount} ${sourceCount === 1 ? "bron" : "bronnen"}`)}
      ${renderSignalDrawerSection("impact", "Gevolg voor de planning", renderSignalImpact(signal))}
      ${renderSignalDrawerSection("followup", "Acties en opvolging", renderSignalSteps(signal) + renderSignalFollowup(signal, true))}
    </div>
    <div class="drawer-footer">
      <button class="btn btn--rise btn--sm" data-action="discuss-signal" data-id="${signal.id}">${riseIcon}Bespreek met Rise</button>
      <a class="btn btn--link btn--sm" href="${pageHref(route)}" data-action="nav" data-view="project" data-project="${project.id}" data-section="signalen">Alle projectsignalen</a>
    </div>
  </aside>`;
}

function renderSignalFollowup(signal, inDrawer) {
  const { id } = signal;
  const scope = inDrawer ? "drawer-" + id : id;
  const followup = signalFollowup(id);
  const linkedActions = projectActions(signal.project).filter(
    (action) => action.signal?.id === id,
  );
  const actionsRoute = {
    view: "project",
    projectId: signal.project,
    section: "acties",
  };
  const check = followup.check ? formatIsoDate(followup.check) : "";
  return `<section class="signal-followup">
    <h3>Opvolging</h3>
    <p><strong>${followup.status}</strong>${followup.owner ? " · " + escapeHtml(followup.owner) : ""}${check ? " · Volgende controle " + check : ""}</p>
    ${
      linkedActions.length
        ? `<ul class="signal-actions">
      ${linkedActions.map((action) => `<li><span>${escapeHtml(action.title)}</span><small>${escapeHtml(action.status)}</small></li>`).join("")}
    </ul><a class="btn btn--link btn--sm" href="${pageHref(actionsRoute)}" data-action="signal-actions" data-id="${id}">Bekijk gekoppelde acties ${icon("arrow")}</a>`
        : ""
    }
    <div class="followup-actions">
      <button id="followup-${scope}" class="btn btn--ghost btn--sm" data-action="edit-followup" data-id="${id}" aria-expanded="${state.editFollowup === id}">Opvolging aanpassen</button>
      ${(id === "s-pz" || id === "s-dk") && !followup.note && followup.status !== "Afgerond" ? `<button class="btn btn--link btn--sm" data-action="preset-followup" data-id="${id}">${id === "s-pz" ? "Leg controle met Joost vast" : "Leg navraag bij Ruben vast"}</button>` : ""}
      <button id="feedback-${scope}" class="btn btn--link btn--sm" data-action="show-signal-feedback" data-id="${id}" aria-expanded="${state.signalFeedback === id}">Niet relevant</button>
    </div>
    ${
      state.editFollowup === id
        ? `<form class="tracking-form" id="followup-form-${scope}" data-action-submit="signal-followup" data-id="${id}" data-return-focus="followup-${scope}">
      <label>Status <select id="followup-status-${scope}" name="status">${followupStatuses.map((status) => `<option ${status === followup.status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
      <label>Eigenaar <input id="followup-owner-${scope}" name="owner" value="${escapeHtml(followup.owner)}"></label>
      <label>Deadline <input id="followup-deadline-${scope}" name="deadline" type="date" value="${escapeHtml(followup.deadline)}"></label>
      <label>Volgende controle <input id="followup-check-${scope}" name="check" type="date" value="${escapeHtml(followup.check)}"></label>
      <label>Afspraak <input id="followup-note-${scope}" name="note" value="${escapeHtml(followup.note)}"></label>
      <button class="btn btn--rise btn--sm">Sla opvolging op</button>
    </form>`
        : ""
    }
    ${
      state.signalFeedback === id
        ? `<form class="tracking-form" id="feedback-form-${scope}" data-action-submit="signal-feedback" data-id="${id}">
      <label>Reden (optioneel) <select id="feedback-reason-${scope}" name="reason"><option value="">Geen reden</option>${feedbackReasons.map((reason) => `<option>${reason}</option>`).join("")}</select></label>
      <button class="btn btn--ghost btn--sm">Verberg signaal</button>
    </form>`
        : ""
    }
  </section>`;
}

function renderHiddenSignals(project) {
  const hidden = signals.filter(
    (signal) => state.dismissed[signal.id] && (!project || signal.project === project),
  );
  return hidden.length
    ? `<details class="hidden-signals" id="hidden-signals">
    <summary>Verborgen signalen (${hidden.length})</summary>
    ${hidden
      .map(
        (
          signal,
        ) => `<div><span>${escapeHtml(signal.title)}${typeof state.dismissed[signal.id] === "string" ? " · " + escapeHtml(state.dismissed[signal.id]) : ""}</span>
      <button class="btn btn--link btn--sm" data-action="restore-signal" data-id="${signal.id}">Maak verbergen ongedaan</button></div>`,
      )
      .join("")}
  </details>`
    : "";
}
