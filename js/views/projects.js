function renderProjects() {
  return `<section class="page">
    <header class="page-head"><div><h1>Projecten</h1><p>${projects.length + (isScaled() ? scaleData().extraProjects.length : 0)} lopende projecten. Kies een project om het te openen.</p></div><button class="btn btn--ghost" data-action="toast" data-text="Project toevoegen (niet in deze demo)">${icon("plus")}Project toevoegen</button></header>
    ${withDataState(() => `<div class="tracking-table-wrap"><table class="ptable"><thead><tr><th>Project</th><th>Fase</th><th>Woningen</th><th>Volgende mijlpaal</th><th>Signalen</th></tr></thead><tbody>
    ${projects
      .map((e) => {
        const n = e.id === attentionProjectId ? openSignals().filter((signal) => signal.project === e.id) : [];
        const next = primaryProjectMilestone(e.id);
        const planningHref = pageHref({
          view: "project",
          projectId: e.id,
          section: "planning",
        });
        return `<tr data-action="nav" data-view="project" data-project="${e.id}" data-section="signalen">
        <td><span class="np-mono np-mono--light">${e.id.toUpperCase()}</span><a href="${pageHref({ view: "project", projectId: e.id, section: "signalen" })}" data-action="nav" data-view="project" data-project="${e.id}" data-section="signalen"><b>${e.name}</b></a><em>${e.place}</em></td>
        <td>${e.phase}</td><td class="tabular">${e.homes}</td><td class="project-next"><a href="${planningHref}" data-action="nav" data-view="project" data-project="${e.id}" data-section="planning">${e.next} · ${formatPlanDate(next.date)}</a>
          <span>${renderMilestoneStatus(next.status)} <small>${milestoneDateNote(next)}</small></span></td>
        <td>${n.length ? `${n.map((a) => `<span class="mini-cert cert--${a.level}" title="${a.title}"></span>`).join("")} <span class="muted">${n.length}</span>` : ""}</td></tr>`;
      })
      .join("")}
    ${renderScaledProjectRows()}
    </tbody></table>${isScaled() ? `<div class="list-foot"><span>${projects.length + scaleData().extraProjects.length} projecten</span><span>Gesorteerd op naam</span></div>` : ""}</div>`,
    { empty: { title: "Nog geen projecten", text: "Voeg een project toe of koppel een projectmap. Rise begint direct met lezen.", glyph: "grid", action: '<button class="btn btn--sm btn--rise" data-action="toast" data-text="Project toevoegen (niet in deze demo)">' + icon("plus") + 'Project toevoegen</button>' }, rows: 5, wrap: "tracking-table-wrap" })}
  </section>`;
}

function renderProjectHeader(project, title, description = "") {
  return `<header class="page-head page-head--project">
    <div><p class="kicker">${project.name} · ${project.place} · ${project.homes} woningen · ${project.phase}</p><h1>${title}</h1>${description ? `<p>${description}</p>` : ""}</div>
  </header>`;
}

function renderProjectSignals(project) {
  const all = sortSignalsByAction(
    signals.filter((signal) => signal.project === project.id && !state.dismissed[signal.id]),
  );
  const selected = state.sigFilter[project.id] ?? "alle";
  const visible = all.filter((signal) => selected === "alle" || signal.level === selected);

  return `<section class="page">
    ${renderProjectHeader(project, "Signalen", "Op volgorde van het eerstvolgende actiemoment.")}
    <div class="legend" role="group" aria-label="Filter op zekerheid">${["alle", "vast", "vermoed", "check"].map((level) => `<button id="signal-filter-${level}" class="filter ${selected === level ? "is-on" : ""}" data-action="sig-filter" data-k="${level}" aria-pressed="${selected === level}">${level === "alle" ? "Alle" : certaintyBadge(level)} <em>${level === "alle" ? all.length : all.filter((signal) => signal.level === level).length}</em></button>`).join("")}</div>
    ${renderHiddenSignals(project.id)}
    ${withDataState(() => visible.length ? `<div class="signal-register">${visible.map(renderSignalEntry).join("")}</div>` : renderState({ title: "Geen signalen in deze selectie", text: "Kies een ander filter of bekijk alle signalen.", glyph: "pulse" }), { empty: { title: "Geen signalen voor dit project", text: "Rise vergelijkt nieuwe stukken met afspraken en planning. Zodra iets afwijkt, verschijnt het hier.", glyph: "pulse" }, rows: 3 })}
  </section>`;
}

const timelineRange = [[8, 1, 2026], [3, 1, 2027]];
const timelineMonths = ["sep", "okt", "nov", "dec", "jan", "feb", "mrt"].map((label, index) => ({
  label,
  date: [(8 + index) % 12, 1, index < 4 ? 2026 : 2027],
}));

function timelinePosition(date) {
  const [start, end] = timelineRange;
  return Math.max(0, Math.min(100, planDaysBetween(start, date) / planDaysBetween(start, end) * 100));
}

function renderSchedule(project) {
  const schedule = schedules[project.id];
  const approved = state.planDraft[project.id] === "approved";
  const version = approved
    ? schedule.version.split(" · ")[0] + " · gewijzigd op " + formatPlanDate(demoToday)
    : schedule.version;
  return `<section class="page">
    ${renderProjectHeader(project, "Planning", version)}
    ${renderMilestoneOverview(project.id)}
    <section class="schedule" aria-labelledby="schedule-title">
      <header class="section-header"><h2 id="schedule-title">Tijdlijn</h2>${approved ? '<span class="action-state" data-status="Afgerond">Wijziging verwerkt</span>' : ""}</header>
      <div class="gantt" tabindex="0" role="region" aria-label="Projectplanning september 2026 tot en met maart 2027">
        <div class="g-head" aria-hidden="true"><span class="g-label"></span><div class="g-track">${timelineMonths.map(({ label, date }) => `<span class="g-month" style="left:${timelinePosition(date)}%">${label}</span>`).join("")}<span class="g-today" style="left:${timelinePosition(demoToday)}%"><em>vandaag</em></span></div></div>
        ${schedule.rows.map((row) => {
          const dates = scheduleDates(row, approved);
          const { start, end, milestone } = dates;
          return `<div class="g-row ${row.key ? "is-key" : ""}">
            <div class="g-label"><b>${row.name}</b><em>${renderScheduleDates(dates)}${row.who ? " · " + row.who : ""}${row.dep ? " · na " + row.dep : ""}</em>
              <button class="ask" data-action="ask-about" data-label="${escapeHtml(row.name)}" aria-label="Vraag Vicki over ${escapeHtml(row.name)}" title="Vraag Vicki over ${escapeHtml(row.name)}">${vickiIcon()}</button>
            </div>
            <div class="g-track" aria-hidden="true">
              ${timelineMonths.map(({ date }) => `<i class="g-grid" style="left:${timelinePosition(date)}%"></i>`).join("")}
              <i class="g-today-line" style="left:${timelinePosition(demoToday)}%"></i>
              ${start ? `<span class="bar ${row.done ? "is-done" : ""}" style="left:${timelinePosition(start)}%;width:${Math.max(0.6, timelinePosition(end) - timelinePosition(start))}%"></span>` : ""}
              ${milestone ? `<span class="ms ${row.key ? "is-key" : ""}" title="${formatPlanDate(milestone)}" style="left:${timelinePosition(milestone)}%"></span>` : ""}
            </div>
          </div>`;
        }).join("")}
        <div class="g-legend"><span><i class="lg-bar"></i>Gepland</span><span><i class="lg-ms"></i>Mijlpaal</span><span><i class="lg-today"></i>Vandaag in de demo</span></div>
      </div>
    </section>
  </section>`;
}

function renderScaledProjectRows() {
  if (!isScaled()) return "";
  return scaleData()
    .extraProjects.map((project) => `<tr data-action="scale-item">
      <td><span class="np-mono np-mono--light">${escapeHtml(project.name.slice(0, 2))}</span><b>${escapeHtml(project.name)}</b><em>${escapeHtml(project.place)}</em></td>
      <td>${escapeHtml(project.phase)}</td><td class="tabular">${project.homes}</td>
      <td class="project-next"><a>${escapeHtml(project.next)} · ${formatPlanDate(project.date)}</a><span>${renderMilestoneStatus(project.status)}</span></td>
      <td></td>
    </tr>`)
    .join("");
}
