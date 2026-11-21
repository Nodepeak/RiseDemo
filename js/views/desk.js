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

function renderStat({ label, value, note, href, alert = false, glyph, attrs = "" }) {
  return `<a class="stat ${alert ? "stat--alert" : ""}" href="${href}" ${attrs}>
    <span>${icon(glyph)}${label}</span><b>${value}</b><small>${note}</small>${icon("arrow", "stat-go")}
  </a>`;
}

function renderAgendaItem(meeting) {
  const date = new Date(meeting.date + "T00:00:00Z");
  const route = { view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id };
  return `<a class="agenda-item" href="${pageHref(route)}" data-action="action-meeting" data-id="${meeting.id}">
    <span class="agenda-date"><small>${deskWeekday.format(date).replace(".", "")}</small><b>${date.getUTCDate()}</b></span>
    <span><b class="t">${escapeHtml(meeting.title)}</b><em>${escapeHtml(findProject(meeting.project).name)} · ${meeting.time ?? ""}${meeting.place ? " · " + escapeHtml(meeting.place) : ""}</em></span>
  </a>`;
}

function renderDesk() {
  const n = deskNumbers();
  const visible = n.open.slice(0, 4);
  const totalSignals = n.open.length + n.extraSignals;
  const otherCount = totalSignals - visible.length;
  const projectCount = n.portfolio.length;
  const nextMeeting = n.upcoming[0];

  return `<section class="desk">
    <header class="desk-head">
      <div class="desk-hello">
        <p class="kicker">${deskDay.format(new Date(demoTodayIso + "T00:00:00Z"))}</p>
        <h1>${deskGreeting()}, ${profile.first}</h1>
        <p class="lede">Rise las <b>14 nieuwe stukken</b> in je ${projectCount === 4 ? "vier" : projectCount} projecten. ${totalSignals ? `${totalSignals === 1 ? "Eén signaal vraagt" : `${totalSignals} signalen vragen`} om een besluit.` : "Er vraagt niets om een besluit."}</p>
      </div>
    </header>

    <div class="desk-ask">
      <h2><label for="ta-home">Waar wil je mee beginnen?</label></h2>
      ${renderComposer("home", { big: true, placeholder: "Vraag Rise iets over je projecten, of geef een opdracht…" })}
      <div class="desk-suggest">${deskSuggestions.map((text) => `<button type="button" data-action="desk-suggest" data-text="${escapeHtml(text)}">${icon("spark")}${escapeHtml(text)}</button>`).join("")}</div>
    </div>

    <div class="desk-stats">${withDataState(
      () => `<div class="stats">
      ${renderStat({ label: "Open signalen", value: totalSignals, note: `${n.open.filter((s) => signalUrgency(signalActions[s.id]?.by) === "Hoog").length} met hoge urgentie`, href: pageHref({ view: "projecten" }), glyph: "pulse", attrs: 'data-action="tab" data-view="projecten"' })}
      ${renderStat({ label: "Acties deze week", value: n.dueThisWeek.length, note: n.late.length ? `${n.late.length} over de deadline` : "Alles op schema", alert: n.late.length > 0, href: pageHref({ view: "acties" }), glyph: "task", attrs: 'data-action="nav" data-view="acties"' })}
      ${renderStat({ label: "Overleggen deze week", value: n.thisWeek.length, note: nextMeeting ? `Eerstvolgende: ${escapeHtml(nextMeeting.title)}, ${formatIsoDate(nextMeeting.date)}` : "Geen overleg gepland", href: nextMeeting ? pageHref({ view: "project", projectId: nextMeeting.project, section: "vergaderingen", meetingId: nextMeeting.id }) : "#", glyph: "cal", attrs: nextMeeting ? `data-action="action-meeting" data-id="${nextMeeting.id}"` : "" })}
      ${renderStat({ label: "Mijlpalen onder druk", value: `${n.pressured.length}<small> / ${projectCount}</small>`, note: "projecten met een risico", href: pageHref({ view: "projecten" }), glyph: "gantt", attrs: 'data-action="tab" data-view="projecten"' })}
    </div>`,
      { empty: { title: "Nog geen projecten gekoppeld", text: "Koppel een SharePoint-map of Outlook-agenda. Rise leest de stukken en toont hier wat aandacht vraagt.", glyph: "layers", action: '<button class="btn btn--sm btn--rise" data-action="toast" data-text="Bronnen koppelen (niet in deze demo)">Bron koppelen</button>' }, rows: 1, wrap: "signal-register" },
    )}</div>

    <div class="desk-grid">
      <section class="outlook" aria-labelledby="outlook-title">
        <header class="outlook-head">
          <div><h2 id="outlook-title">Signalen</h2><p>Op volgorde van het eerstvolgende actiemoment</p></div>
          ${otherCount > 0 ? `<a class="btn btn--quiet btn--sm" data-action="tab" data-view="projecten" href="${pageHref({ view: "projecten" })}">Alle ${totalSignals} bekijken ${icon("chev")}</a>` : ""}
        </header>
        ${renderHiddenSignals()}
        ${withDataState(
          () => visible.length
            ? `<div class="signal-register">${visible.map(renderSignalCard).join("")}</div>`
            : renderState({ title: "Niets dat nu aandacht vraagt", text: "Rise meldt het zodra een stuk afwijkt van een afspraak of een mijlpaal raakt.", glyph: "check" }),
          { empty: { title: "Geen open signalen", text: "Rise meldt het zodra een stuk afwijkt van een afspraak of een mijlpaal raakt.", glyph: "check" }, rows: 4 },
        )}
      </section>

      <aside class="desk-side">
        <section aria-labelledby="agenda-title">
          <header class="outlook-head"><div><h2 id="agenda-title">Komende overleggen</h2></div></header>
          ${withDataState(
            () => n.upcoming.length
              ? `<div class="agenda-list">${n.upcoming.slice(0, 4).map(renderAgendaItem).join("")}</div>`
              : renderState({ title: "Geen overleg gepland", glyph: "cal" }),
            { empty: { title: "Geen overleg gepland", text: "Gekoppelde agenda’s verschijnen hier.", glyph: "cal" }, rows: 3, wrap: "agenda-list" },
          )}
        </section>
        <section aria-labelledby="health-title">
          <header class="outlook-head"><div><h2 id="health-title">Projecten</h2></div>
            ${projectCount > 6 ? `<a class="btn btn--quiet btn--sm" data-action="tab" data-view="projecten" href="${pageHref({ view: "projecten" })}">Alle ${projectCount} ${icon("chev")}</a>` : ""}</header>
          ${withDataState(
            () => `<div class="health">${n.portfolio.slice(0, 6).map(({ project, status }) => {
              const real = projects.includes(project);
              const route = { view: "project", projectId: project.id, section: "planning" };
              return `<a href="${real ? pageHref(route) : "#"}" ${real ? `data-action="nav" data-view="project" data-project="${project.id}" data-section="planning"` : 'data-action="scale-item"'}>
                <span class="np-mono">${escapeHtml((real ? project.id : project.name.slice(0, 2)).toUpperCase())}</span>
                <span><b>${escapeHtml(project.name)}</b><em>${escapeHtml(project.phase)} · ${escapeHtml(project.place)}</em></span>
                ${renderMilestoneStatus(status)}
              </a>`;
            }).join("")}</div>`,
            { empty: { title: "Geen projecten", glyph: "grid" }, rows: 4, wrap: "health" },
          )}
        </section>
      </aside>
    </div>
  </section>`;
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest('[data-action="desk-suggest"]');
  if (!trigger) return;
  state.comp.home.text = trigger.dataset.text;
  state.comp.home.projects = projectsFromMentions(trigger.dataset.text);
  submitComposer("home");
});
