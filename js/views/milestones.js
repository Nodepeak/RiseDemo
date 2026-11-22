function renderMilestoneStatus(status) {
  return `<span class="milestone-status" data-status="${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function renderRequirements(milestone) {
  return `<ul class="milestone-requirements">
    ${milestone.requirements
      .map(
        ([label, status, owner, doc, passage]) => `<li>
      <div><b>${escapeHtml(label)}</b><small>${escapeHtml(status)}${owner ? ` · ${escapeHtml(owner)}` : ""}</small></div>
      ${doc ? `<a class="btn btn--link btn--sm" href="${sourceHref(doc, passage)}" data-action="open-doc" data-doc="${doc}" data-passage="${passage ?? ""}">Bekijk bron ${icon("arrow")}</a>` : ""}
    </li>`,
      )
      .join("")}
  </ul>`;
}

function renderMilestoneSignals(milestone) {
  const visible = milestone.signalIds.filter((id) => !state.dismissed[id]);
  return visible.length
    ? `<div class="milestone-signals">${visible
        .map(
          (id) =>
            `<button class="btn btn--link btn--sm" data-action="open-signal" data-id="${id}">${escapeHtml(findSignal(id).title)} ${icon("arrow")}</button>`,
        )
        .join("")}</div>`
    : "";
}

function renderMilestoneOverview(projectId) {
  return `<section class="milestones" aria-labelledby="milestones-heading">
    <h2 id="milestones-heading">Mijlpalen</h2>
    ${projectMilestones(projectId)
      .map((milestone, index) => {
        const open = state.milestoneOpen[projectId] === index;
        return `<div class="milestone-row">
        <button id="milestone-toggle-${index}" class="milestone-toggle" data-action="milestone-toggle" data-id="${projectId}" data-index="${index}" aria-expanded="${open}" aria-controls="milestone-detail-${index}">
          <span><b>${escapeHtml(milestone.name)}</b></span>
          <span class="milestone-date"><b>${renderDueDate(planDateIso(milestone.date))}</b>${milestone.forecast && !milestone.approved ? `<em class="ms-shift" title="Mogelijk later volgens Vicki">→ ${formatPlanDate(milestone.forecast)}</em>` : ""}</span>
          ${renderMilestoneStatus(milestone.status)}${icon("chev")}
        </button>
        ${
          open
            ? `<div class="milestone-detail" id="milestone-detail-${index}">
          ${milestone.owner ? `<p>Verantwoordelijke: <strong>${escapeHtml(milestone.owner)}</strong></p>` : ""}
          ${renderRequirements(milestone)}
          ${renderMilestoneSignals(milestone)}
          <button class="btn btn--rise btn--sm" data-action="ask-about" data-label="${escapeHtml(milestone.name)}">${vickiIcon()}Vraag Vicki over deze mijlpaal</button>
        </div>`
            : ""
        }
      </div>`;
      })
      .join("")}
  </section>`;
}

function renderDossierMilestone(projectId) {
  const milestones = projectMilestones(projectId);
  const index =
    state.dossierMilestone[projectId] ??
    milestones.indexOf(primaryProjectMilestone(projectId, milestones));
  const milestone = milestones[index] ?? milestones[0];
  const summary = [
    ["Niet gevonden in het dossier", "niet gevonden"],
    ["Concept · wacht op vaststelling", "wacht op vaststelling"],
    ["Te bevestigen", "te bevestigen"],
  ]
    .flatMap(([status, label]) => {
      const count = milestone.requirements.filter(
        ([, value]) => value === status,
      ).length;
      return count ? [`${count} ${label}`] : [];
    })
    .join(" · ");
  const open = Boolean(state.dossierRequirementsOpen[projectId]);

  return `<section class="dossier-milestone" aria-label="Documenten voor een mijlpaal">
    <div class="dossier-milestone-bar">
      <label>Mijlpaal <select id="dossier-milestone-select" data-project="${projectId}">
        ${milestones.map(({ name }, position) => `<option value="${position}" ${position === index ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
      </select></label>
      <button id="dossier-requirements-toggle" class="btn btn--link" data-action="dossier-requirements" data-id="${projectId}" aria-expanded="${open}" aria-controls="dossier-requirements">
        ${summary || "Bekijk de benodigde stukken"} ${icon("chev")}
      </button>
    </div>
    ${open ? `<div id="dossier-requirements">${renderRequirements(milestone)}${renderMilestoneSignals(milestone)}</div>` : ""}
  </section>`;
}
