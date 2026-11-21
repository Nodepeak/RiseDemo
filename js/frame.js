function renderNavigation() {
  let e = (a, s) =>
      (state.view === "project" || state.view === "doc") &&
      state.projectId === a &&
      (!s || state.section === s),
    n = [
      ["signalen", "Signalen", icon("pulse")],
      ["acties", "Acties", icon("task")],
      ["planning", "Planning", icon("gantt")],
      ["vergaderingen", "Vergaderingen", icon("cal")],
      ["dossier", "Projectdossier", icon("doc")],
    ];
  return `<aside class="nav" id="demo-navigation">
    <a class="nav-logo" href="${pageHref({ view: "bureau" })}" data-action="nav" data-view="bureau" aria-label="Rise">${riseLogo}</a>
    <button class="nav-search" type="button" data-action="palette-open" aria-keyshortcuts="Meta+K Control+K">${icon("search")}<span>Zoeken</span><kbd class="kbd">⌘K</kbd></button>
    <nav class="nav-main" aria-label="Hoofdnavigatie">
      <a class="nav-item ${state.view === "bureau" ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "bureau" })}" data-view="bureau">${icon("desk")}<span>Overzicht</span></a>
      <a class="nav-item ${state.view === "gesprekken" ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "gesprekken" })}" data-view="gesprekken">${icon("talk")}<span>Gesprekken</span></a>
      <a class="nav-item ${state.view === "acties" ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "acties" })}" data-view="acties">${icon("task")}<span>Acties</span></a>
      <button class="nav-item ${state.view === "dossier" || (state.view === "doc" && !state.projectId) ? "is-in" : ""}" data-action="toggle-dossier" aria-expanded="${state.dossierOpen}">${icon("folder")}<span>Dossier</span>${icon("chev", "caret" + (state.dossierOpen ? " is-open" : ""))}</button>
      ${
        state.dossierOpen
          ? `<div class="nav-sub">${Object.entries(dossierGroups)
              .map(
                ([a, s]) =>
                  `<a class="nav-subitem ${(state.view === "dossier" || (state.view === "doc" && !state.projectId)) && state.dossierKey === a ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "dossier", dossierKey: a })}" data-view="dossier" data-dossier="${a}">${s.name}</a>`,
              )
              .join("")}</div>`
          : ""
      }
    </nav>
    <div class="nav-label"><span>Projecten</span><a data-action="tab" href="${pageHref({ view: "projecten" })}" data-view="projecten" ${state.view === "projecten" ? 'aria-current="page"' : ""}>Alle</a></div>
    <nav class="nav-projects" aria-label="Projecten">
      ${projects
        .map((a) => {
          let s = state.expanded[a.id],
            o = a.id === attentionProjectId ? openSignals().filter((signal) => signal.project === a.id).length : 0;
          return `<div class="np ${e(a.id) ? "is-current" : ""}">
          <button class="np-head" data-action="toggle-project" data-id="${a.id}" aria-expanded="${!!s}">
            <span class="np-mono">${a.id.toUpperCase()}</span><span class="np-name">${a.name}</span>
            ${o && !s ? `<span class="np-count">${o}</span>` : ""}${icon("chev", "caret" + (s ? " is-open" : ""))}
          </button>
          ${s ? `<div class="np-sub">${n.map(([r, i, d]) => `<a class="nav-subitem ${e(a.id, r) ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "project", projectId: a.id, section: r })}" data-view="project" data-project="${a.id}" data-section="${r}">${d}<span>${i}</span>${r === "signalen" && o ? `<em>${o}</em>` : ""}</a>`).join("")}</div>` : ""}
        </div>`;
        })
        .join("")}
      ${renderScaledNavProjects()}
    </nav>
    <div class="nav-foot">
      <a class="nav-item ${state.view === "instellingen" ? "is-on" : ""}" data-action="nav" href="${pageHref({ view: "instellingen" })}" data-view="instellingen">${icon("gear")}<span>Instellingen</span></a>
    </div>
  </aside>`;
}

function renderTopbar() {
  const page = findPage(state);
  let labels = [page.title];
  if (state.view === "project" || (state.view === "doc" && state.projectId)) {
    labels = [findProject(state.projectId).name, projectSections[state.section]];
  } else if (state.view === "dossier" || state.view === "doc") {
    labels = ["Dossier", dossierGroups[state.dossierKey].name];
  }
  if (state.view === "doc") labels.push(page.title);

  return `<header class="top">
    <button class="mobile-menu icon-btn" data-action="mobile-nav" aria-label="Navigatiemenu" aria-controls="demo-navigation" aria-expanded="${state.mobileNav}">${icon("menu")}</button>
    <div class="crumbs">${labels.map((label, index) => `<span class="${index === labels.length - 1 ? "is-last" : ""}">${escapeHtml(label)}</span>`).join(icon("chev"))}</div>
    <div class="top-actions">
      <button class="icon-btn top-search" type="button" data-action="palette-open" aria-label="Zoeken" title="Zoeken  ⌘K">${icon("search")}</button>
      <button class="icon-btn" type="button" data-action="theme" data-value="${resolvedTheme() === "dark" ? "light" : "dark"}" aria-label="${resolvedTheme() === "dark" ? "Licht thema" : "Donker thema"}" title="${resolvedTheme() === "dark" ? "Licht thema" : "Donker thema"}">${icon(resolvedTheme() === "dark" ? "sun" : "moon")}</button>
      <button class="avatar" id="account-trigger" aria-expanded="${state.pop?.type === "avatar"}" data-action="avatar" aria-label="Account van ${profile.name}">${profile.initials}</button>
    </div>
  </header>`;
}

const demoWalkthroughs = [
  [
    "Vraag op Overzicht, verder in gesprek",
    "Druk op Enter. Het gesprek gaat verder in Gesprekken.",
    () => {
      state.comp.home.text = "Wat vraagt deze week mijn aandacht?";
      state.nextFocus = "ta-home";
      navigate({ view: "bureau" });
    },
  ],
  [
    "Signaal openen en bespreken",
    "Lees de onderbouwing en kies een vervolgstap of “Bespreek met Vicki”.",
    () => {
      (navigate({ view: "bureau" }), (state.drawer = "s-dk"), render());
    },
  ],
  [
    "Assistent bij een projectonderdeel",
    "Rise weet dat je naar de planning van De Kade kijkt. Kies een vraag of klik op het Vicki-poppetje naast een taak.",
    () => {
      (navigate({ view: "project", projectId: "dk", section: "planning" }),
        (state.dock.open = !0),
        (state.dock.key = "p-dk-planning"),
        render());
    },
  ],
  [
    "Rise schakelt een agent in",
    "Kijk hoe de afsprakenagent werkt en wat hij van je nodig heeft.",
    () => {
      let e = startConversation({
        text: "Welke afspraken moet ik bewaken bij @Havenkwartier?",
      });
      navigate({ view: "gesprekken", convId: e.id });
    },
  ],
  [
    "Zelf skill en projecten toevoegen",
    "Kies “Skill” en typ @ om projecten toe te voegen. Probeer “Vergelijk de risico’s” met twee projecten.",
    () => {
      state.comp.chat = emptyComposer();
      state.nextFocus = "ta-chat";
      navigate({ view: "gesprekken", convId: null });
    },
  ],
  [
    "Bron openen vanuit een antwoord",
    "Klik op een bronnummer of op een bron onder het antwoord.",
    () => {
      navigate({ view: "gesprekken", convId: "c-1" });
    },
  ],
];

function normalizeChoice(text = "") {
  return text.toLocaleLowerCase("nl").normalize("NFD").replace(/\p{M}/gu, "");
}

function matchesChoice(query, ...values) {
  const text = normalizeChoice(values.join(" "));
  return normalizeChoice(query)
    .trim()
    .split(/\s+/)
    .every((word) => text.includes(word));
}

function matchingProjects(query) {
  return projects.filter(({ id, name, place, phase }) =>
    matchesChoice(query, name, name.replace(/\s/g, ""), place, phase, id),
  );
}

const contextFiles = [
  ["Bedrijfsdossier", "Werkwijzen en standaarden", "folder"],
  ["Beleidsdossier", "Beleid en normen", "folder"],
  ["Bestand uploaden", "PDF, Word, mail", "clip", "aantekeningen-overleg.docx"],
];

function renderChoice({
  label,
  detail,
  leading,
  action,
  attributes,
  selected,
  active,
}) {
  return `<button type="button" class="pop-item ${selected ? "is-on" : ""} ${active ? "is-active" : ""}" data-action="${action}" ${attributes} ${selected == null ? "" : `aria-pressed="${selected}"`}>
    ${leading ?? ""}<span><b>${escapeHtml(label)}</b>${detail ? `<em>${escapeHtml(detail)}</em>` : ""}</span>${selected ? icon("check") : ""}
  </button>`;
}

function renderChoicePopover(pop, title, placeholder, choices, description = "") {
  const position = `left:${pop.x}px;${pop.up ? `bottom:${pop.y}px` : `top:${pop.y}px`};--choice-space:${pop.space}px`;
  return `<div class="pop choice-pop" id="choice-popover" style="${position}" role="group" aria-label="${title}">
    <h6>${title}</h6>
    ${description ? `<p class="choice-description">${escapeHtml(description)}</p>` : ""}
    ${placeholder ? `<label class="choice-search">${icon("search")}<input id="choice-search" aria-label="${placeholder}" placeholder="${placeholder}" autocomplete="off" value="${escapeHtml(pop.q)}"></label>` : ""}
    <div class="choice-options">${choices.map(renderChoice).join("") || '<p class="empty" role="status">Geen resultaten gevonden.</p>'}</div>
  </div>`;
}

function renderPopover() {
  const e = state.pop;
  if (!e) return "";
  const query = e.q ?? "";
  if (e.type === "library") {
    const filters = state.library ?? defaultLibraryFilters();
    const title = libraryFilters.find(([key]) => key === e.key)[1];
    const choices = libraryOptions(e.key, filters)
      .filter(({ label, value }) => matchesChoice(query, label, value))
      .map(({ label, value }) => ({
        label,
        action: "choose-library",
        attributes: `data-value="${escapeHtml(value)}"`,
        selected: (filters[e.key] ?? "") === value,
      }));
    return renderChoicePopover(
      e,
      title,
      `Zoek in ${title.toLowerCase()}`,
      choices,
    );
  }
  if (e.type === "skill") {
    const current = state.comp[e.comp].skill;
    const choices = skills
      .filter(({ name, desc }) => matchesChoice(query, name, desc))
      .map(({ id, name, desc }) => ({
        label: name,
        detail: desc,
        leading: icon("spark"),
        action: "choose-skill",
        attributes: `data-id="${id}"`,
        selected: current === id,
      }));
    if (matchesChoice(query, "Automatisch Rise kiest zelf")) {
      choices.unshift({
        label: "Automatisch",
        detail: "Rise kiest wat bij je opdracht past",
        leading: icon("spark"),
        selected: !current,
        action: "choose-skill",
        attributes: 'data-id=""',
      });
    }
    return renderChoicePopover(
      e, "Skills", "Zoek een skill", choices,
      "Rise kiest standaard zelf de juiste skill. Kies er zelf een als je een specifieke aanpak wilt meegeven. Via Context kun je ook kaders toevoegen.",
    );
  }
  if (["context", "mention", "projects"].includes(e.type)) {
    const mention = e.type === "mention";
    const sourcesOnly = e.type === "context" && e.comp === "home";
    const projectsOnly = e.type === "projects";
    const selected = state.comp[e.comp].projects;
    const choices = (sourcesOnly ? [] : matchingProjects(query)).map(
      ({ id, name, phase, place }, index) => ({
        label: name,
        detail: `${phase} · ${place}`,
        leading: `<i class="np-mono np-mono--light">${id.toUpperCase()}</i>`,
        action: "choose-project",
        attributes: `data-id="${id}"`,
        selected: selected.includes(id),
        active: mention && index === (e.i ?? 0),
      }),
    );
    if (e.type === "context") {
      for (const [label, detail, glyph, filename = label] of contextFiles) {
        if (matchesChoice(query, label, detail)) {
          choices.push({
            label,
            detail,
            leading: icon(glyph),
            action: "choose-file",
            attributes: `data-name="${escapeHtml(filename)}"`,
          });
        }
      }
    }
    return renderChoicePopover(
      e,
      mention
        ? "Project vermelden"
        : projectsOnly
          ? "Projecten kiezen"
          : sourcesOnly
            ? "Bronnen toevoegen"
            : "Context toevoegen",
      mention
        ? ""
        : projectsOnly
          ? "Zoek een project"
          : sourcesOnly
            ? "Zoek een bron"
            : "Zoek project of bron",
      choices,
    );
  }
  return e.type === "avatar"
    ? `<div class="pop pop--right" style="right:16px;top:${(select(".main")?.getBoundingClientRect().top ?? 0) + 52}px"><div class="pop-user"><span class="avatar avatar--lg">${profile.initials}</span><span><b>${profile.name}</b><em>${profile.role} · ${profile.company}</em></span></div><hr/>${["Profiel", "Meldingen", "Taal: Nederlands"].map((a, index) => `<button class="pop-item" ${index === 0 ? 'id="account-first-option"' : ""} data-action="toast" data-text="${a} (niet in deze demo)"><span><b>${a}</b></span></button>`).join("")}<button class="pop-item" data-action="palette-open"><span><b>Zoeken en opdrachten</b></span><kbd class="kbd">⌘K</kbd></button><hr/><h6>Thema</h6>${themeChoices.map(([value, label, glyph]) => `<button class="pop-item ${themeChoice() === value ? "is-on" : ""}" data-action="theme" data-value="${value}" aria-pressed="${themeChoice() === value}">${icon(glyph)}<span><b>${label}</b></span>${themeChoice() === value ? icon("check") : ""}</button>`).join("")}<hr/><button class="pop-item" data-action="toast" data-text="Uitloggen (niet in deze demo)"><span><b>Uitloggen</b></span></button></div>`
    : "";
}

function renderWalkthroughMenu() {
  return `<div class="routes ${state.routes ? "is-open" : ""}">
    ${state.routes ? `<div class="routes-panel" id="demo-route-options"><h6>Datastaat van lijsten</h6><div class="scenario" role="group" aria-label="Datastaat">${scenarios.map(([value, label]) => `<button type="button" data-action="scenario" data-value="${value}" aria-pressed="${currentScenario() === value}">${label}</button>`).join("")}</div><p class="scenario-note">Bekijk hoe overzichten eruitzien tijdens laden, zonder inhoud, bij een fout of met een grote portefeuille.</p><hr/><h6>Ontwerproutes uit de briefing</h6>${demoWalkthroughs.map(([e], n) => `<button class="route" data-action="route" data-i="${n}"><i>${n + 1}</i>${e}</button>`).join("")}</div>` : ""}
    <button class="routes-btn" id="demo-routes-trigger" aria-expanded="${state.routes}" aria-controls="demo-route-options" data-action="routes">${state.routes ? "Sluit" : "Demo"}</button>
  </div>`;
}

function renderPage() {
  let e = findProject(state.projectId);
  switch (state.view) {
    case "bureau":
      return renderDesk();
    case "projecten":
      return renderProjects();
    case "gesprekken":
      return renderConversations();
    case "project":
      return {
        signalen: renderProjectSignals,
        planning: renderSchedule,
        vergaderingen: renderMeetings,
        acties: renderActions,
        dossier: (n) => renderDossier({ project: n.id }),
      }[state.section](e);
    case "dossier":
      return state.dossierKey === "kaders"
        ? renderLibrary(renderDossier({ dossier: "kaders", embedded: true }))
        : renderDossier({ dossier: state.dossierKey });
    case "doc":
      return renderDocument();
    case "acties":
      return renderActions();
    case "instellingen":
      return renderSettings();
    default:
      return "";
  }
}

function renderFrame() {
  const dock = renderDock();
  return `${renderNavigation()}
  ${state.mobileNav ? '<button class="mobile-nav-scrim" data-action="mobile-nav" aria-label="Sluit navigatiemenu"></button>' : ""}
  <main class="main view-${state.view}">
    ${renderTopbar()}
    <div class="content" id="content">${renderPage()}</div>
    ${dock}
  </main>
  ${renderSignalDrawer()}
  ${renderPopover()}
  ${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}${state.toastUndo ? ` <button class="toast-undo" data-action="restore-signal" data-id="${state.toastUndo}">Ongedaan maken</button>` : ""}</div>` : ""}
  ${renderWalkthroughMenu()}
  ${renderPalette()}`;
}

function renderScaledNavProjects() {
  if (!isScaled()) return "";
  const extra = scaleData().extraProjects;
  const shown = state.navAllProjects ? extra : extra.slice(0, 4);
  return `${shown.map((project) => `<div class="np"><button class="np-head" data-action="scale-item"><span class="np-mono">${escapeHtml(project.name.slice(0, 2))}</span><span class="np-name">${escapeHtml(project.name)}</span></button></div>`).join("")}
    <button class="nav-subitem nav-more" data-action="nav-more" aria-expanded="${!!state.navAllProjects}">${icon(state.navAllProjects ? "back" : "chev", "nav-more-ic")}<span>${state.navAllProjects ? "Minder tonen" : `Nog ${extra.length - shown.length} projecten`}</span></button>`;
}
