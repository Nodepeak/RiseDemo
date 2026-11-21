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
    ${visible.length ? `<div class="signal-register">${visible.map(renderSignalEntry).join("")}</div>` : '<p class="empty">Geen signalen in deze selectie.</p>'}
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
              <button class="ask" data-action="ask-about" data-label="${escapeHtml(row.name)}" aria-label="Vraag Rise over ${escapeHtml(row.name)}" title="Vraag Rise over ${escapeHtml(row.name)}">${riseIcon}</button>
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
