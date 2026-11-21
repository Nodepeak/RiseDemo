const select = (e, n = document) => n.querySelector(e);

const escapeHtml = (e = "") =>
  String(e).replace(
    /[&<>"]/g,
    (n) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[n],
  );

const findProject = (e) => projects.find((n) => n.id === e);

const findSignal = (e) => signals.find((n) => n.id === e);

const findMeeting = (e) => meetings.find((n) => n.id === e);

const findSkill = (e) => skills.find((n) => n.id === e);

const newId = () => Math.random().toString(36).slice(2, 8);

const riseIcon =
  '<svg class="wing" viewBox="0 0 133 122" aria-hidden="true"><path d="M52.4 47.7L52.4 48.3L52.7 48.8L53.2 49.1L53.8 49.1L125.5 35.5L126 35L126.1 34.7L132.6 4.1L132.7 2.8L132.6 2.2L132.2 1.4L131.6 0.7L130.5 0.1L129.5 0L128.8 0.1L127.6 0.4L55.9 33.2L55.5 33.6L55.3 34.1ZM0 120L0 120.6L0.3 121.1L1.2 121.5L30.7 121.5L31.3 121.3L31.8 120.8L52.6 22.9L52.5 22L52.1 21.6L51.5 21.5L46.8 21.6L44.5 21.8L42.3 22.2L40 22.9L37.7 23.6L33.4 25.6L29.4 28.2L27.4 29.6L23.9 33L20.8 36.7L19.4 38.7L18.2 40.9L17.1 43L16.3 45.1L15.5 47.3L15 49.5Z" fill="currentColor"/></svg>';

const iconPaths = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  desk: '<path d="M3 5h18v14H3zM3 9h18M10 9v10M13 12h5M13 15h3"/>',
  talk: '<path d="M4 5h16v11H9l-5 4z"/>',
  folder: '<path d="M3 6h7l2 2h9v11H3z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
  send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  clip: '<path d="M8 12l6-6a3 3 0 0 1 4 4l-8 8a5 5 0 0 1-7-7l7-7"/>',
  arrow: '<path d="M7 17L17 7M9 7h8v8"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  cal: '<rect x="4" y="5" width="16" height="15"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  gantt: '<path d="M4 6h9M8 12h10M6 18h7"/>',
};

const icon = (e, n = "") =>
  `<svg class="ic ${n}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[e]}</svg>`;

const certaintyLabels = {
  vast: "Vastgesteld",
  vermoed: "Vermoeden",
  check: "Te controleren",
};

const certaintyBadge = (e, n) =>
  `<span class="cert cert--${e}">${n ?? certaintyLabels[e]}</span>`;

function renderComposer(e, { big: n = !1, placeholder: a, base: s = [] } = {}) {
  const isDesk = e === "home";
  let o = state.comp[e],
    r = [
      ...s.map(
        (i) =>
          `<span class="chip chip--proj chip--static" title="Context van dit gesprek"><b>@</b>${findProject(i).name}</span>`,
      ),
      ...(o.projects.length || s.length
        ? o.projects
            .filter((i) => !s.includes(i))
            .map(
              (i) =>
                `<span class="chip chip--proj"><b>@</b>${findProject(i).name}<button data-action="chip-x" data-comp="${e}" data-kind="project" data-id="${i}" aria-label="Verwijder ${findProject(i).name}">${icon("x")}</button></span>`,
            )
        : isDesk
          ? []
          : [
              '<span class="chip chip--scope" title="Rise kijkt in al je projecten">Alle projecten</span>',
            ]),
      ...o.files.map(
        (i, d) =>
          `<span class="chip chip--file">${icon("doc")}${escapeHtml(i)}<button data-action="chip-x" data-comp="${e}" data-kind="file" data-id="${d}" aria-label="Verwijder">${icon("x")}</button></span>`,
      ),
      o.skill
        ? `<span class="chip chip--skill">${icon("spark")}${findSkill(o.skill).name}<button data-action="chip-x" data-comp="${e}" data-kind="skill" aria-label="Verwijder skill">${icon("x")}</button></span>`
        : "",
    ].join("");
  return `<form class="composer ${n ? "composer--big" : ""}" data-comp="${e}" data-action-submit="send">
    <div class="comp-ctx">
      ${
        isDesk
          ? `<button type="button" id="composer-projects-home" class="comp-btn comp-project-picker"
        data-action="pop-projects" data-comp="home" aria-label="Projecten kiezen"
        aria-expanded="${state.pop?.type === "projects"}" aria-controls="choice-popover">
        <b aria-hidden="true">@</b><span>${o.projects.length ? "Projecten" : "Alle projecten"}</span>${icon("chev")}
      </button>`
          : '<span class="comp-ctx-label">Context</span>'
      }
      ${r}
    </div>
    <textarea id="ta-${e}" data-comp="${e}" rows="${n ? 2 : 1}" aria-label="Vraag of opdracht voor Rise" placeholder="${a ?? "Vraag Rise iets of geef een opdracht. Typ @ voor een project."}">${escapeHtml(o.text)}</textarea>
    <div class="comp-bar">
      <button type="button" class="comp-btn" id="composer-context-${e}" aria-expanded="${state.pop?.type === "context" && state.pop.comp === e}" aria-controls="choice-popover" data-action="pop-context" data-comp="${e}">${icon("plus")}<span>${isDesk ? "Bronnen" : "Context"}</span></button>
      <button type="button" class="comp-btn ${o.skill ? "is-set" : ""}" id="composer-skill-${e}" aria-expanded="${state.pop?.type === "skill" && state.pop.comp === e}" aria-controls="choice-popover" data-action="pop-skill" data-comp="${e}">${icon("spark")}<span>${o.skill ? "Skill wijzigen" : "Skill"}</span></button>
      <span class="comp-hint">Enter om te versturen</span>
      <button type="submit" class="comp-send" aria-label="Verstuur">${icon("send")}</button>
    </div>
  </form>`;
}
