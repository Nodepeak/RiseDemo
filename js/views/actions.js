const actionSignalLinks = {
  "dk:Brandweeradvies trappenhuis opvragen": "s-dk2",
  "pz:Offertes bodemonderzoek opvragen": "s-pz",
  "mw:Toets de welstandseisen voor de haalbaarheidsstudie": "s-mw",
};

const meetingActionId = (project, title) => `${project}:${title}`;

function projectActions(projectId) {
  const meetingItems = new Map();
  for (const meeting of meetings) {
    if (projectId && meeting.project !== projectId) continue;
    for (const [owner, title, originalStatus, deadline] of meeting.actions) {
      const id = meetingActionId(meeting.project, title);
      const earlier = meetingItems.get(id);
      // Een terugkerend agendapunt behoudt het oorspronkelijke verslag als bron.
      if (earlier?.meeting.doc || (earlier && !meeting.doc)) continue;
      meetingItems.set(id, {
        id,
        title,
        owner,
        deadline: deadline ?? earlier?.deadline,
        project: meeting.project,
        meeting,
        signal: findSignal(actionSignalLinks[id]),
        status: state.actionStatus[id] ?? (originalStatus === "klaar" ? "Afgerond" : "Open"),
      });
    }
  }
  const followups = Object.keys(state.signalFollowups).flatMap((id) => {
    const signal = findSignal(id);
    if (!signal || (projectId && signal.project !== projectId)) return [];
    const { note, owner, status, deadline, check } = signalFollowup(id);
    return [{
      id: "followup:" + id,
      title: note || signal.title,
      owner,
      status,
      deadline,
      check,
      project: signal.project,
      signal,
    }];
  });

  return [...meetingItems.values(), ...followups].sort((first, second) =>
    Number(first.status === "Afgerond") - Number(second.status === "Afgerond") ||
    (first.deadline || "9999").localeCompare(second.deadline || "9999") ||
    first.id.localeCompare(second.id, "nl"),
  );
}

function actionFilterScope(projectId) {
  const signal = projectId && findSignal(state.actionSignal);
  if (signal && signal.project === projectId) return signal.id;
  return projectId ?? "all";
}

function actionOrigin(action) {
  return action.signal && !action.meeting?.doc ? "signal" : "meeting";
}

function renderActionStatus(status) {
  return `<span class="action-state" data-status="${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function renderActions(project = null) {
  const key = actionFilterScope(project?.id);
  const signal = project ? findSignal(key) : null;
  const origin = state.actionOrigins[key] ?? "all";
  const actions = [...projectActions(project?.id), ...(project ? [] : scaledActions())].filter((action) =>
    (!signal || action.signal?.id === signal.id) &&
    (origin === "all" || actionOrigin(action) === origin),
  );
  const openCount = actions.filter((action) => action.status !== "Afgerond").length;
  const filter = state.actionsFilter[key] ?? (signal ? "all" : "open");
  const visible = actions.filter((action) =>
    filter === "all" || (action.status === "Afgerond") === (filter === "done"),
  );
  const intro = project
    ? "Volg acties uit signalen en vergaderverslagen."
    : "Volg acties en deadlines uit alle projecten.";
  const header = project
    ? renderProjectHeader(project, "Acties", intro)
    : `<header class="page-head"><div><h1>Acties</h1><p>${intro}</p></div></header>`;

  return `<section class="page actions-page">${header}
    ${signal ? `<div class="action-signal-scope"><span>Bij signaal <strong>${escapeHtml(signal.title)}</strong></span>
      <button class="btn btn--link btn--sm" data-action="clear-action-signal">Toon alle projectacties</button></div>` : ""}
    <div class="action-toolbar">
      <div class="action-filters" role="group" aria-label="Filter op status">
        ${[
          ["open", "Openstaand", openCount],
          ["done", "Afgerond", actions.length - openCount],
          ["all", "Alles", actions.length],
        ].map(([value, label, count]) => `<button id="action-filter-${value}" class="filter ${filter === value ? "is-on" : ""}" type="button" data-action="actions-filter" data-key="${key}" data-value="${value}" aria-pressed="${filter === value}">${label} <em>${count}</em></button>`).join("")}
      </div>
      <label class="action-origin-filter">Herkomst <select id="action-origin-filter" data-key="${key}">
        ${[["all", "Alle herkomsten"], ["signal", "Signaal"], ["meeting", "Vergaderverslag"]].map(([value, label]) =>
          `<option value="${value}" ${origin === value ? "selected" : ""}>${label}</option>`,
        ).join("")}
      </select></label>
    </div>
    ${withDataState(() => visible.length ? `<div class="action-table-wrap"><table class="action-table">
      <thead><tr><th scope="col">Actie</th><th scope="col">Eigenaar</th><th scope="col">Deadline</th><th scope="col">Herkomst</th><th scope="col">Status</th><th scope="col"><span class="visually-hidden">Opvolging</span></th></tr></thead>
      <tbody>${visible.map((action, index) => renderProjectAction(action, index, Boolean(project))).join("")}</tbody>
    </table>${visible.length > 12 ? `<div class="list-foot"><span>${visible.length} acties</span><span>Op deadline, eerstvolgende eerst</span></div>` : ""}</div>` : renderState({ title: filter === "done" ? "Nog niets afgerond" : "Geen open acties", text: filter === "done" ? "Afgeronde acties verschijnen hier, met hun herkomst." : "Alles is opgepakt. Nieuwe acties uit verslagen en signalen komen hier binnen.", glyph: "task" }), { empty: { title: "Nog geen acties", text: "Rise haalt acties uit vergaderverslagen en signalen. Zodra er een verslag is, verschijnen ze hier.", glyph: "task" }, rows: 6, wrap: "action-table-wrap" })}
  </section>`;
}

function renderActionSource(action) {
  const { meeting, signal, project } = action;
  if (actionOrigin(action) === "signal") {
    const route = { view: "project", projectId: project, section: "signalen", signalId: signal.id };
    return `<small>Signaal</small><a class="source-link" href="${pageHref(route)}" data-action="open-signal" data-id="${signal.id}"><span>${escapeHtml(signal.title)}</span>${icon("arrow")}</a>`;
  }
  const route = { view: "project", projectId: project, section: "vergaderingen", meetingId: meeting.id };
  return `<small>${meeting.doc ? "Verslag van vergadering" : "Vergaderagenda"}</small><a class="source-link" href="${pageHref(route)}" data-action="action-meeting" data-id="${meeting.id}"><span>${escapeHtml(meeting.title)} (${formatIsoDate(meeting.date)})</span>${icon("arrow")}</a>`;
}

function renderProjectAction(action, index, scoped) {
  const { id, title, status, owner, deadline, check, project } = action;
  const complete = status === "Afgerond";
  const toggleLabel = complete ? "Heropen" : "Rond af";
  const late = deadline && deadline < demoTodayIso && !complete;
  return `<tr>
    <td class="action-title"><b>${escapeHtml(title)}</b>${scoped ? "" : `<small>${escapeHtml(findProject(project).name)}</small>`}</td>
    <td class="action-owner"><span class="mobile-cell-label">Eigenaar</span>${escapeHtml(owner || "Nog niet toegewezen")}</td>
    <td class="action-deadline ${late ? "is-late" : ""}"><span class="mobile-cell-label">Deadline</span>${renderDueDate(deadline)}${check ? `<small>Controle ${formatIsoDate(check)}</small>` : ""}</td>
    <td class="action-source"><span class="mobile-cell-label">Herkomst</span>${renderActionSource(action)}</td>
    <td class="action-status">${renderActionStatus(status)}</td>
    <td class="action-toggle"><button id="action-toggle-${index}" class="btn btn--ghost btn--sm" type="button" data-action="toggle-action" data-id="${escapeHtml(id)}" data-status="${escapeHtml(status)}" aria-label="${toggleLabel} ${escapeHtml(title)}">${toggleLabel}</button></td>
  </tr>`;
}

function actionsDemoReply(projectIds = []) {
  const open = projectActions().filter(({ project, status }) =>
    status !== "Afgerond" && (!projectIds.length || projectIds.includes(project)),
  );
  return {
    title: "Openstaande acties",
    blocks: open.length
      ? [{
          type: "table",
          head: ["Actie", "Project", "Eigenaar", "Deadline"],
          rows: open.map(({ title, project, owner, deadline }) =>
            [title, findProject(project).name, owner || "Nog niet toegewezen", deadline ? formatIsoDate(deadline) : "Geen deadline"].map(escapeHtml),
          ),
        }]
      : [{ type: "text", html: "<p>Er staan in dit overzicht geen acties open.</p>" }],
  };
}
