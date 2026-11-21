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

const riseLogo =
  '<svg class="logo" viewBox="0.00 -863.20 2885.60 875.20" aria-hidden="true"><g transform="translate(0,-862.44) scale(7.1)"><path d="M52.4 47.7L52.4 48.3L52.7 48.8L53.2 49.1L53.8 49.1L125.5 35.5L126 35L126.1 34.7L132.6 4.1L132.7 2.8L132.6 2.2L132.2 1.4L131.6 0.7L130.5 0.1L129.5 0L128.8 0.1L127.6 0.4L55.9 33.2L55.5 33.6L55.3 34.1ZM0 120L0 120.6L0.3 121.1L1.2 121.5L30.7 121.5L31.3 121.3L31.8 120.8L52.6 22.9L52.5 22L52.1 21.6L51.5 21.5L46.8 21.6L44.5 21.8L42.3 22.2L40 22.9L37.7 23.6L33.4 25.6L29.4 28.2L27.4 29.6L23.9 33L20.8 36.7L19.4 38.7L18.2 40.9L17.1 43L16.3 45.1L15.5 47.3L15 49.5Z" fill="var(--accent)"/></g><g transform="translate(993.11,0) scale(0.2)"><path d="M419 -565C523 -565 594 -505 603 -410L518 -405C510 -457 473 -490 419 -490C348 -490 304 -442 304 -357C304 -272 348 -223 419 -223C476 -223 514 -257 521 -316L607 -310C597 -211 526 -148 419 -148C296 -148 218 -228 218 -357C218 -486 296 -565 419 -565ZM46 -357C46 -153 211 12 415 12C619 12 784 -153 784 -357C784 -561 619 -726 415 -726C211 -726 46 -561 46 -357ZM124 -357C124 -517 255 -649 415 -649C574 -649 707 -517 707 -357C707 -197 574 -65 415 -65C255 -65 124 -197 124 -357Z" fill="currentColor"/></g><path transform="translate(1206.31,0)" d="M75 -530V0H183V-309C183 -397 219 -442 302 -442H353V-530H303C235 -530 195 -499 177 -432L174 -530Z M453 -530V0H561V-530Z M999 -363 1110 -369C1092 -475 1004 -542 889 -542C757 -542 673 -479 673 -375C673 -273 770 -243 882 -219C939 -206 1006 -200 1006 -143C1006 -94 946 -78 900 -78C827 -78 781 -115 771 -174L660 -167C668 -56 765 12 901 12C1013 12 1118 -34 1118 -138C1118 -242 1033 -278 901 -302C847 -312 786 -331 785 -379C784 -425 827 -452 881 -452C935 -452 988 -419 999 -363Z M1186 -265C1186 -96 1286 12 1439 12C1547 12 1640 -51 1672 -152L1560 -160C1538 -110 1491 -80 1439 -80C1356 -80 1306 -137 1300 -234H1679V-269C1673 -458 1565 -542 1439 -542C1286 -542 1186 -434 1186 -265ZM1301 -315C1313 -400 1362 -450 1439 -450C1498 -450 1553 -415 1566 -315Z" fill="currentColor"/></svg>';

// Iconen: één set, 24px-raster, lijndikte via CSS (.ic). Vormen afgeleid van Lucide (ISC-licentie).
function vickiIcon(pose = "") {
  return `<img class="vicki-avatar" src="${localPath("assets/vicki.svg")}" width="22" height="22" alt="">`;
}

const iconPaths = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  desk: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  talk: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  gear: '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  spark: '<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/>',
  send: '<path d="m5 12 7-7 7 7M12 19V5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  clip: '<path d="m21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l8.6-8.6A4 4 0 1 1 18 8.8l-8.6 8.6a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  arrow: '<path d="M7 7h10v10M7 17 17 7"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  task: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  gantt: '<path d="M8 6h10M6 12h9M11 18h7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15.7-6L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-15.7 6L3 16"/><path d="M8 16H3v5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  enter: '<path d="M20 4v7a4 4 0 0 1-4 4H4"/><path d="m9 10-5 5 5 5"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  command: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
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
    <textarea id="ta-${e}" data-comp="${e}" rows="${n ? 2 : 1}" aria-label="Vraag of opdracht voor Vicki" placeholder="${a ?? "Vraag Vicki iets of geef een opdracht. Typ @ voor een project."}">${escapeHtml(o.text)}</textarea>
    <div class="comp-bar">
      <button type="button" class="comp-btn" id="composer-context-${e}" aria-expanded="${state.pop?.type === "context" && state.pop.comp === e}" aria-controls="choice-popover" data-action="pop-context" data-comp="${e}">${icon("plus")}<span>${isDesk ? "Bronnen" : "Context"}</span></button>
      <button type="button" class="comp-btn ${o.skill ? "is-set" : ""}" id="composer-skill-${e}" aria-expanded="${state.pop?.type === "skill" && state.pop.comp === e}" aria-controls="choice-popover" data-action="pop-skill" data-comp="${e}">${icon("spark")}<span>${o.skill ? "Skill wijzigen" : "Skill"}</span></button>
      <span class="comp-hint">Enter om te versturen</span>
      <button type="submit" class="comp-send" aria-label="Verstuur">${icon("send")}</button>
    </div>
  </form>`;
}
