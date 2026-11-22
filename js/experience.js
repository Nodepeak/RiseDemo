/* ==========================================================================
   Ervaringslaag: thema, opdrachtpalet (⌘K), datastaten en schaalvoorbeelden.
   Alles hier is demo-infrastructuur rond de bestaande schermen.
   ========================================================================== */

/* ---------- Thema ---------- */
const themeChoices = [
  ["light", "Licht", "sun"],
  ["dark", "Donker", "moon"],
  ["system", "Systeem", "desk"],
];

function themeChoice() {
  try {
    return localStorage.getItem("rise:theme") || "system";
  } catch {
    return "system";
  }
}

function resolvedTheme(choice = themeChoice()) {
  if (choice === "system") return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return choice;
}

function setTheme(choice) {
  try {
    localStorage.setItem("rise:theme", choice);
  } catch {
    // Zonder opslag geldt de keuze alleen voor deze pagina.
  }
  const apply = () => {
    document.documentElement.dataset.theme = resolvedTheme(choice);
    render();
  };
  if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("is-theming");
    document.startViewTransition(apply).finished.finally(() => document.documentElement.classList.remove("is-theming"));
  } else apply();
}

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (themeChoice() === "system") {
    document.documentElement.dataset.theme = resolvedTheme();
    render();
  }
});

/* ---------- Datastaten (demo-routes → "Datastaat") ---------- */
const scenarios = [
  ["normaal", "Normaal"],
  ["laden", "Laden"],
  ["leeg", "Leeg"],
  ["fout", "Fout"],
  ["veel", "Veel data"],
];
const currentScenario = () => state.scenario ?? "normaal";

function renderSkeletonRows(count = 4) {
  return `<div class="skeleton-rows" aria-hidden="true">${Array.from({ length: count }, () =>
    `<div class="skeleton-row"><div><i class="skeleton w-a"></i><i class="skeleton w-b"></i></div><i class="skeleton w-c"></i><i class="skeleton w-d"></i></div>`,
  ).join("")}</div>`;
}

function renderState({ kind = "empty", title, text, glyph = "inbox", action = "", plain = false }) {
  return `<div class="state state--${kind} ${plain ? "state--plain" : ""}" role="${kind === "error" ? "alert" : "status"}">
    <span class="state-icon">${icon(glyph)}</span>
    <h3>${title}</h3>${text ? `<p>${text}</p>` : ""}${action}
  </div>`;
}

/** Laat een lijst de gekozen datastaat tonen. `empty` beschrijft de lege staat. */
function withDataState(render, { empty, rows = 4, wrap = "signal-register" } = {}) {
  switch (currentScenario()) {
    case "laden":
      return `<div class="${wrap}" aria-busy="true"><span class="visually-hidden">Laden…</span>${renderSkeletonRows(rows)}</div>`;
    case "leeg":
      return renderState({ ...empty, kind: "empty" });
    case "fout":
      return renderState({
        kind: "error",
        glyph: "alert",
        title: "Dit overzicht kon niet worden geladen",
        text: "De verbinding met SharePoint gaf geen antwoord. Je gegevens zijn veilig; probeer het zo opnieuw.",
        action: `<button class="btn btn--sm" data-action="scenario" data-value="normaal">${icon("refresh")}Opnieuw proberen</button>`,
      });
    default:
      return render();
  }
}

/* ---------- Schaalvoorbeelden ("Veel data") ---------- */
const scalePlaces = ["Utrecht", "Leiden", "Delft", "Haarlem", "Zwolle", "Breda", "Arnhem", "Nijmegen", "Tilburg", "Almere", "Deventer", "Gouda", "Alkmaar", "Hilversum", "Amstelveen", "Dordrecht"];
const scaleNames = ["Spoorzone", "Oeverpark", "Lindehof", "De Werf", "Kanaalfront", "Stadshaven", "Molenbuurt", "Het Gasthuis", "Veemarkt", "Singelblok", "Bleekveld", "Vlietpark", "Kop van de Haven", "Tuinen van West", "Ketelhuis", "Brouwerijterrein", "De Lanen", "Schoolwerf", "Rietlanden", "Hofkwartier", "Polderpoort", "Watertoren", "Dijkzicht", "Stationsgebied Noord met de herontwikkeling van het voormalige postkantoor"];
const scalePhases = ["Initiatief", "Haalbaarheid", "Voorlopig ontwerp", "Definitief ontwerp", "Omgevingsplanwijziging", "Vergunning", "Realisatie"];
const scaleOwners = ["Maartje Hoekstra", "Joost de Wit", "Ilse Bakker", "Ruben Visser", "Kroon Architecten", "Studio Rietveld", "Heijmerink Bouw", "Atelier Noord", "Sanne Mulder", "Daan Peeters"];
const scaleTasks = ["Brandweeradvies opvragen", "Kostenraming installaties actualiseren", "Bodemonderzoek laten uitzetten", "Gevelmonster beoordelen", "Parkeerbalans herrekenen", "Stikstofberekening aanleveren", "Flora- en faunaonderzoek plannen", "Geluidsrapport spoorzijde controleren", "Verkoopbrochure laten opmaken", "Grondexploitatie bijwerken", "Addendum overeenkomst opstellen", "BENG-berekening verifiëren", "Constructief ontwerp afstemmen met aannemer, adviseurs en de gemeente vóór de indiening"];

function seeded(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const scaleData = (() => {
  let cache;
  return () => {
    if (cache) return cache;
    const rand = seeded(20261120);
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const extraProjects = Array.from({ length: 36 }, (_, index) => {
      const name = scaleNames[index % scaleNames.length] + (index >= scaleNames.length ? " " + (Math.floor(index / scaleNames.length) + 1) : "");
      return {
        id: "x" + index,
        name,
        place: pick(scalePlaces),
        homes: Math.round(24 + rand() * 460),
        phase: pick(scalePhases),
        signals: Math.floor(rand() * rand() * 7),
        status: rand() < 0.2 ? "Onder druk" : rand() < 0.35 ? "Aandacht nodig" : "Op koers",
        next: "Aanvraag omgevingsvergunning",
        date: [Math.floor(rand() * 12), 1 + Math.floor(rand() * 27), rand() < 0.5 ? 2026 : 2027],
      };
    });
    const realMeetings = meetings.filter((meeting) => meeting.doc);
    const extraActions = Array.from({ length: 240 }, (_, index) => {
      const meeting = pick(realMeetings);
      const offset = Math.round(rand() * 80 - 20);
      const date = new Date(Date.UTC(2026, 10, 20 + offset)).toISOString().slice(0, 10);
      return {
        id: "scale:" + index,
        title: pick(scaleTasks),
        owner: rand() < 0.08 ? "" : pick(scaleOwners),
        deadline: rand() < 0.1 ? null : date,
        project: meeting.project,
        meeting,
        baseStatus: rand() < 0.25 ? "Afgerond" : rand() < 0.2 ? "In behandeling" : "Open",
      };
    });
    const extraConversations = Array.from({ length: 80 }, (_, index) => ({
      id: "scale-c" + index,
      title: `${pick(["Wat betekent", "Vergelijk", "Vat samen:", "Controleer"])} ${pick(scaleTasks).toLowerCase()}`,
      projects: [pick(projects).id],
      skill: null,
      when: index < 6 ? "Deze week" : `${1 + (index % 28)} ${pick(["okt", "sep", "aug"])}`,
      group: index < 6 ? "Deze week" : "Eerder",
      messages: [],
      placeholder: true,
    }));
    cache = { extraProjects, extraActions, extraConversations };
    return cache;
  };
})();

const isScaled = () => currentScenario() === "veel";

function scaledActions(projectId) {
  if (!isScaled()) return [];
  return scaleData()
    .extraActions.filter((action) => !projectId || action.project === projectId)
    .map((action) => ({ ...action, status: state.actionStatus[action.id] ?? action.baseStatus }));
}

/* ---------- Opdrachtpalet ---------- */
function paletteItems(query = "") {
  const items = [];
  const add = (group, glyph, label, detail, run, keywords = "") => items.push({ group, glyph, label, detail, run, keywords });

  add("Opdrachten", "talk", "Nieuw gesprek", "Start een opdracht voor Vicki", () => navigate({ view: "gesprekken", convId: null }));
  add("Opdrachten", "spark", "Vraag Vicki op deze pagina", "Open de assistent", () => setDockOpen(true), "assistent dock");
  const dark = resolvedTheme() === "dark";
  add("Opdrachten", dark ? "sun" : "moon", dark ? "Licht thema" : "Donker thema", "Wissel het kleurthema", () => setTheme(dark ? "light" : "dark"), "thema kleur modus dark light");

  add("Ga naar", "desk", "Overzicht", "", () => navigate({ view: "bureau" }), "home bureau start");
  add("Ga naar", "talk", "Gesprekken", "", () => navigate({ view: "gesprekken", convId: state.convId }));
  add("Ga naar", "task", "Acties", "Alle projecten", () => navigate({ view: "acties" }), "taken todo");
  add("Ga naar", "grid", "Projecten", `${projects.length} lopend`, () => navigate({ view: "projecten" }));
  for (const [key, group] of Object.entries(dossierGroups))
    add("Ga naar", "folder", group.name, "Dossier", () => navigate({ view: "dossier", dossierKey: key }));
  add("Ga naar", "gear", "Instellingen", "", () => navigate({ view: "instellingen" }));

  for (const project of projects) {
    add("Projecten", "grid", project.name, `${project.place} · ${project.phase}`, () =>
      navigate({ view: "project", projectId: project.id, section: "signalen" }), project.id);
    for (const [section, label] of Object.entries(projectSections))
      add("Projecten", "chev", `${project.name} · ${label}`, "", () => navigate({ view: "project", projectId: project.id, section }));
  }
  for (const signal of openSignals())
    add("Signalen", "pulse", signal.title, findProject(signal.project).name, () => {
      state.drawer = signal.id;
      state.drawerSection = null;
      state.nextFocus = "close-signal-drawer";
      render();
    });
  for (const [id, doc] of Object.entries(documents))
    add("Documenten", "doc", doc.title, doc.project ? findProject(doc.project).name : dossierGroups[doc.dossier ?? "bedrijf"].name, () =>
      navigate({ view: "doc", doc: id }), doc.kind);

  const q = query.trim();
  if (!q) return items.filter((item, index) => item.group !== "Documenten" && !(item.group === "Projecten" && item.label.includes(" · ")) && index < 40);
  return items.filter((item) => matchesChoice(q, item.label, item.detail, item.keywords)).slice(0, 40);
}

function highlightMatch(text, query) {
  const words = normalizeChoice(query).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return escapeHtml(text);
  const plain = normalizeChoice(text);
  const marks = new Array(text.length).fill(false);
  for (const word of words) {
    const at = plain.indexOf(word);
    if (at >= 0) for (let i = at; i < at + word.length; i++) marks[i] = true;
  }
  let html = "";
  let open = false;
  [...text].forEach((char, i) => {
    if (marks[i] && !open) (html += "<mark>"), (open = true);
    if (!marks[i] && open) (html += "</mark>"), (open = false);
    html += escapeHtml(char);
  });
  return html + (open ? "</mark>" : "");
}

function renderPalette() {
  const palette = state.palette;
  if (!palette) return "";
  const items = paletteItems(palette.q);
  const active = Math.min(palette.i ?? 0, Math.max(0, items.length - 1));
  let lastGroup = null;
  const list = items
    .map((item, index) => {
      const head = item.group !== lastGroup ? `<div class="palette-group" role="presentation">${item.group}</div>` : "";
      lastGroup = item.group;
      return `${head}<button type="button" class="palette-item ${index === active ? "is-active" : ""}" id="palette-item-${index}" role="option" aria-selected="${index === active}" data-action="palette-run" data-i="${index}">
        ${icon(item.glyph)}<b>${highlightMatch(item.label, palette.q)}</b>${item.detail ? `<em>${escapeHtml(item.detail)}</em>` : "<em></em>"}<span class="kbd">${icon("enter").replace('class="ic "', 'class="ic" style="width:11px;height:11px"')}</span>
      </button>`;
    })
    .join("");
  return `<div class="palette-scrim" data-action="palette-close"></div>
  <div class="palette" role="dialog" aria-modal="true" aria-label="Zoeken en opdrachten">
    <label class="palette-input">${icon("search")}<input id="palette-input" placeholder="Zoek een project, signaal, document of opdracht…" autocomplete="off" spellcheck="false" value="${escapeHtml(palette.q)}" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant="palette-item-${active}"><span class="kbd">Esc</span></label>
    <div class="palette-list" id="palette-list" role="listbox">${list || `<p class="palette-empty">Niets gevonden voor “${escapeHtml(palette.q)}”.</p>`}</div>
    <div class="palette-foot"><span><i class="kbd">↑</i><i class="kbd">↓</i> kiezen</span><span><i class="kbd">↵</i> openen</span><span><i class="kbd">Esc</i> sluiten</span></div>
  </div>`;
}

function openPalette() {
  state.palette = { q: "", i: 0 };
  state.pop = null;
  state.nextFocus = "palette-input";
  render();
}

function closePalette() {
  state.palette = null;
  render();
}

function runPaletteItem(index) {
  const item = paletteItems(state.palette?.q)[index];
  state.palette = null;
  if (item) item.run();
  else render();
}

document.addEventListener(
  "keydown",
  (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return state.palette ? closePalette() : openPalette();
    }
    if (!state.palette) return;
    const count = paletteItems(state.palette.q).length;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return closePalette();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopImmediatePropagation();
      state.palette.i = ((state.palette.i ?? 0) + (event.key === "ArrowDown" ? 1 : -1) + count) % Math.max(1, count);
      render();
      select(".palette-item.is-active")?.scrollIntoView({ block: "nearest" });
      return;
    }
    if (event.key === "Enter" && event.target.id === "palette-input") {
      event.preventDefault();
      event.stopImmediatePropagation();
      runPaletteItem(state.palette.i ?? 0);
    }
  },
  true,
);

document.addEventListener(
  "input",
  (event) => {
    if (event.target.id !== "palette-input" || !state.palette) return;
    event.stopImmediatePropagation();
    state.palette.q = event.target.value;
    state.palette.i = 0;
    render();
  },
  true,
);

document.addEventListener(
  "click",
  (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    const { action, value, i } = trigger.dataset;
    const handlers = {
      "palette-open": () => openPalette(),
      "palette-close": () => closePalette(),
      "palette-run": () => runPaletteItem(+i),
      theme: () => setTheme(value),
      scenario: () => {
        state.scenario = value;
        saveTrackingProgress();
        render();
      },
      "nav-more": () => {
        state.navAllProjects = !state.navAllProjects;
        render();
      },
      "scale-item": () => showToast("Voorbeeldregel voor de schaaltest (niet in deze demo)"),
    };
    if (!handlers[action]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (action !== "palette-run" && action !== "palette-close") state.pop = null;
    handlers[action]();
  },
  true,
);
