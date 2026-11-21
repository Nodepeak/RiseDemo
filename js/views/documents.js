function listDocuments({ project: e, dossier: n }) {
  return Object.entries(documents).filter(([, a]) =>
    e ? a.project === e : a.dossier === n,
  );
}

function renderDossier({ project, dossier, embedded = false }) {
  const entries = listDocuments({ project, dossier });
  const folders = [...new Set(entries.map(([, doc]) => doc.folder))];
  const key = project ?? dossier;
  const currentFolder = state.folder[key] ?? "Alles";
  const query = state.dossierQuery[key] ?? "";
  const visible = entries.filter(
    ([, doc]) =>
      (currentFolder === "Alles" || doc.folder === currentFolder) &&
      matchesChoice(query, doc.title),
  );
  const title = project
    ? renderProjectHeader(
        findProject(project),
        "Projectdossier",
        "Documenten, besluiten en stukken voor je volgende mijlpalen.",
      )
    : `<header class="page-head"><div><p class="kicker">Dossier</p><h1>${dossierGroups[dossier].name}</h1><p>${dossierGroups[dossier].intro}</p></div></header>`;

  return `<section class="${embedded ? "" : "page"}">
    ${embedded ? "" : title}
    ${project ? renderDossierMilestone(project) : ""}
    <div class="split split--docs">
      <div class="folders">${["Alles", ...folders].map((folder) => `<button class="fl ${currentFolder === folder ? "is-on" : ""}" data-action="folder" data-key="${key}" data-f="${escapeHtml(folder)}">${icon("folder")}<span>${escapeHtml(folder)}</span><em>${folder === "Alles" ? entries.length : entries.filter(([, doc]) => doc.folder === folder).length}</em></button>`).join("")}
        <button class="fl fl--add" data-action="toast" data-text="Documenten toevoegen (niet in deze demo)">${icon("plus")}<span>Documenten toevoegen</span></button>
      </div>
      <div class="dossier-list">
        <label class="dossier-search">${icon("search")}<input id="dossier-search" data-key="${key}" type="search" aria-label="Zoek op documentnaam" placeholder="Zoek op documentnaam" value="${escapeHtml(query)}"></label>
        <table class="dtable"><thead><tr><th>Document</th><th>Laatste wijziging</th></tr></thead><tbody>
          ${
            visible
              .map(([id, doc]) => {
                const tracking = documentTracking[id];
                const attention =
                  tracking?.attention &&
                  signals.some(
                    (signal) =>
                      !state.dismissed[signal.id] &&
                      signalFollowup(signal.id).status !== "Afgerond" &&
                      signal.sources.some(([source]) => source === id),
                  );
                return `<tr data-action="open-doc" data-doc="${id}"><td>${icon("doc")}<div>
              <a href="${sourceHref(id)}" data-action="open-doc" data-doc="${id}"><b>${escapeHtml(doc.title)}</b></a>${attention ? '<span class="dossier-attention" role="img" aria-label="Vraagt aandacht" title="Vraagt aandacht"></span>' : ""}
              ${tracking?.status ? `<small class="dossier-doc-status">${escapeHtml(tracking.status)}</small>` : ""}
            </div></td>
            <td class="num">${escapeHtml(doc.date)}</td></tr>`;
              })
              .join("") ||
            '<tr><td colspan="2">Geen documenten gevonden.</td></tr>'
          }
        </tbody></table>
      </div>
    </div>
  </section>`;
}

function renderDocument() {
  let e = documents[state.doc],
    n = signals.filter((s) => s.sources.some(([o]) => o === state.doc)),
    a = ([s, o, r, i]) =>
      s === "h"
        ? `<h3>${o}</h3>`
        : s === "p"
          ? `<p>${o}</p>`
          : s === "mark"
            ? `<p class="passage ${state.docPassage === r ? "is-focus" : ""}" id="${r}">${o}</p>`
            : s === "table"
              ? `<table class="doc-table ${state.docPassage === r ? "is-focus passage" : ""}" id="${r}">${o.map((d, l) => `<tr class="${l === i ? "is-hl" : ""}">${d.map((u) => (l ? `<td>${u}</td>` : `<th>${u}</th>`)).join("")}</tr>`).join("")}</table>`
              : "";
  const tracking = documentTracking[state.doc];
  const linkedMilestones = e.project
    ? projectMilestones(e.project).filter(
        (milestone) =>
          milestone.requirements.some(([, , , doc]) => doc === state.doc) ||
          milestone.signalIds.some((id) =>
            n.some((signal) => signal.id === id),
          ),
      )
    : [];
  return `<section class="page page--doc">
    <a class="back" data-action="doc-back" href="${pageHref(documentBackRoute())}">${icon("back")}Terug</a>
    <div class="doc-wrap">
      <article class="paper">
        <p class="kicker">${e.kind} · ${e.date} · ${escapeHtml(e.author)}</p>
        <h1>${escapeHtml(e.title)}</h1>
        ${e.body.map(a).join("")}
      </article>
      <aside class="doc-side">
        <div class="side-card"><h5>Vicki over dit document</h5><p>${e.summary}</p>
          <button class="btn btn--rise btn--sm" data-action="dock-open">${vickiIcon()}Vraag Vicki hierover</button></div>
        ${
          tracking?.status
            ? `<div class="side-card"><h5>Documentstatus</h5><p>${tracking.version ? tracking.version + " · " : ""}${tracking.status}</p>
          ${state.doc === "dk-plan" && state.planDraft.dk === "approved" ? `<p>${deKadeImpactLine()}</p>` : ""}
          ${tracking.older ? `<details class="document-versions"><summary>Oudere versies</summary><ul>${tracking.older.map((version) => `<li>${escapeHtml(version)}</li>`).join("")}</ul></details>` : ""}</div>`
            : ""
        }
        ${linkedMilestones.length ? `<div class="side-card"><h5>Gekoppelde mijlpalen</h5>${linkedMilestones.map((milestone) => `<p>${escapeHtml(milestone.name)} · ${formatPlanDate(milestone.date)}</p>`).join("")}</div>` : ""}
        ${state.docPassage ? '<div class="side-card side-card--mark"><h5>Gemarkeerde passage</h5><p>Hierop baseert Rise zijn antwoord of signaal.</p></div>' : ""}
        ${
          n.some((signal) => !state.dismissed[signal.id])
            ? `<div class="side-card"><h5>Gebruikt in signalen</h5>${n
                .filter((signal) => !state.dismissed[signal.id])
                .map(
                  (s) =>
                    `<button class="side-link" data-action="open-signal" data-id="${s.id}">${certaintyBadge(s.level, "")}${s.title}</button>`,
                )
                .join("")}</div>`
            : ""
        }
        <div class="side-card"><h5>Locatie</h5><p>${e.project ? findProject(e.project).name + " · Projectdossier" : dossierGroups[e.dossier].name} · ${e.folder}</p></div>
      </aside>
    </div></section>`;
}
