const deskHour = new Intl.DateTimeFormat("nl-NL", {
  timeZone: "Europe/Amsterdam",
  hour: "2-digit",
  hourCycle: "h23",
});

function deskGreeting(now = new Date()) {
  const hour = Number(deskHour.format(now));
  if (hour < 6) return "Goedenacht";
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

function renderDesk() {
  const open = sortSignalsByAction(openSignals());
  const visible = open.slice(0, 3);
  const otherCount = open.length - visible.length;
  return `<section class="desk">
    <div class="desk-hero ${state.deskComposerExpanded ? "desk-hero--expanded" : ""}">
      <img class="desk-watermark" src="${localPath("assets/beeldmerk.svg")}" alt="">
      <div class="desk-hello">
        <h1>${deskGreeting()}, ${profile.first}.</h1>
        <p class="lede">Rise heeft 14 nieuwe stukken gelezen in je vier projecten.</p>
      </div>
      <div class="desk-ask">
        <h2><label for="ta-home">Waar wil je mee beginnen?</label></h2>
        ${renderComposer("home", { big: true, placeholder: "Stel je vraag aan Rise." })}
      </div>
    </div>
    <section class="outlook">
      <header class="outlook-head">
        <div><h2>Signalen</h2><p>Op volgorde van het eerstvolgende actiemoment.</p></div>
        ${otherCount ? `<a class="btn btn--link" data-action="tab" data-view="projecten" href="${pageHref({ view: "projecten" })}">${otherCount} andere signalen in je projecten</a>` : ""}
      </header>
      ${renderHiddenSignals()}
      ${visible.length ? `<div class="signal-register">${visible.map(renderSignalCard).join("")}</div>` : '<p class="empty">Niets dat nu aandacht vraagt.</p>'}
    </section>
  </section>`;
}

function renderProjects() {
  return `<section class="page">
    <header class="page-head"><h1>Projecten</h1><p>${projects.length} lopende projecten. Kies een project om het te openen.</p><button class="btn btn--ghost" data-action="toast" data-text="Project toevoegen (niet in deze demo)">${icon("plus")}Project toevoegen</button></header>
    <div class="tracking-table-wrap"><table class="ptable"><thead><tr><th>Project</th><th>Fase</th><th>Woningen</th><th>Volgende mijlpaal</th><th>Signalen</th></tr></thead><tbody>
    ${projects
      .map((e) => {
        let n = signals.filter(
          (a) => a.project === e.id && !state.dismissed[a.id],
        );
        const next = primaryProjectMilestone(e.id);
        const planningHref = pageHref({
          view: "project",
          projectId: e.id,
          section: "planning",
        });
        return `<tr data-action="nav" data-view="project" data-project="${e.id}" data-section="signalen">
        <td><span class="np-mono np-mono--light">${e.id.toUpperCase()}</span><a href="${pageHref({ view: "project", projectId: e.id, section: "signalen" })}" data-action="nav" data-view="project" data-project="${e.id}" data-section="signalen"><b>${e.name}</b></a><em>${e.place}</em></td>
        <td>${e.phase}</td><td class="num">${e.homes}</td><td class="project-next"><a href="${planningHref}" data-action="nav" data-view="project" data-project="${e.id}" data-section="planning">${e.next} · ${formatPlanDate(next.date)}</a>
          <span>${renderMilestoneStatus(next.status)} <small>${milestoneDateNote(next)}</small></span></td>
        <td>${n.map((a) => `<span class="mini-cert cert--${a.level}" title="${a.title}"></span>`).join("")} <span class="muted">${n.length}</span></td></tr>`;
      })
      .join("")}
    </tbody></table></div>
  </section>`;
}
