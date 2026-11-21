function renderMessageBlock(e, n, a) {
  switch (e.type) {
    case "text":
      return `<div class="b-text">${e.html}</div>`;
    case "note":
      return `<p class="sd-note">${icon("gantt")} ${e.html}</p>`;
    case "list":
      return `<ul class="b-list">${e.items.map(([s, o]) => `<li><span>${s}</span><button class="claim-src" data-action="open-signal" data-id="${o}">Signaal</button></li>`).join("")}</ul>`;
    case "table":
      return `<table class="b-table"><thead><tr>${e.head.map((s) => `<th>${s}</th>`).join("")}</tr></thead><tbody>${e.rows.map((s) => `<tr>${s.map((o) => `<td>${o}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    case "chain":
      return `<div class="chain chain--diff">${e.items.map(([s, o, r]) => `<div class="chain-step ${o !== r ? "is-moved" : ""}"><span>${s}</span>${o !== r ? `<s>${o}</s>` : ""}<b>${r}</b></div>`).join("")}</div>`;
    case "sources":
      return `<div class="b-sources"><span class="b-sources-label">Bronnen</span>${e.items.map(([s, o], r) => `<a class="cite-chip" href="${sourceHref(s, o)}" data-action="open-doc" data-doc="${s}" data-passage="${o ?? ""}"><i>${r + 1}</i>${escapeHtml(documents[s].title)}</a>`).join("")}</div>`;
    case "actions":
      return `<div class="b-actions">${e.items.map((s, o) => `<button class="btn ${o ? "btn--ghost" : "btn--rise"} btn--sm" data-action="msg-action" data-mi="${n}" data-bi="${a.blocks.indexOf(e)}" data-i="${o}">${s.label}</button>`).join("")}</div>`;
    case "followups":
      return `<div class="b-follow">${e.items.map((s) => `<button class="follow" data-action="followup" data-text="${escapeHtml(s)}">${icon("chev")}${escapeHtml(s)}</button>`).join("")}</div>`;
    case "draft":
      return `<div class="draft"><div class="draft-head"><span>Concept · niet verstuurd</span><b>Aan: ${e.to}</b><b>Onderwerp: ${e.subject}</b></div><pre>${escapeHtml(e.body)}</pre><div class="b-actions"><button class="btn btn--rise btn--sm" data-action="copy-draft">Kopieer</button><button class="btn btn--ghost btn--sm" data-action="toast" data-text="Opent in Outlook als concept (niet in deze demo)">Open als concept in Outlook</button></div></div>`;
    case "agenda": {
      let s = findMeeting(e.meeting);
      return `<div class="draft"><div class="draft-head"><span>Concept-agenda</span><b>${s.title} · ${findProject(s.project).name} · ${formatIsoDate(s.date)} om ${s.time}</b></div><ol class="b-agenda">${s.proposal.map(([o, r]) => `<li><b>${o}</b><span>${r}</span></li>`).join("")}</ol></div>`;
    }
    default:
      return "";
  }
}

function renderAgent(e, n, a, s, o) {
  let r = Math.min(e.steps.length, Math.max(0, n - 1)),
    i = n >= e.steps.length + 2;
  return `<div class="agent ${i ? "is-done" : "is-running"}">
    <div class="agent-head"><span class="agent-badge">${icon("spark")}${e.agent}</span><span>${e.verb}</span></div>
    <ul class="agent-steps">${e.steps
      .slice(0, r)
      .map((d) => `<li>${icon("check")}${d}</li>`)
      .join(
        "",
      )}${i ? "" : `<li class="is-busy"><i class="dots"><b></b><b></b><b></b></i>${r < e.steps.length ? "Bezig…" : "Afronden…"}</li>`}</ul>
    ${i ? `<div class="agent-result"><span>Opgeleverd</span>${e.result}</div>` : ""}
    ${i && e.need ? `<div class="agent-need ${o ? "is-answered" : ""}"><span class="need-label">Nodig van jou</span><p>${e.need.q}</p>${o ? `<em>Beantwoord: ${o}</em>` : `<div class="b-actions">${e.need.options.map((d, l) => `<button class="btn ${l ? "btn--ghost" : "btn--rise"} btn--sm" data-action="need" data-mi="${a}" data-bi="${s}" data-o="${escapeHtml(d)}">${d}</button>`).join("")}</div>`}</div>` : ""}
  </div>`;
}

function renderThread(e, n = !1) {
  return e.messages
    .map((a, s) => {
      if (a.role === "user") {
        let d = a.signal && findSignal(a.signal);
        return `<div class="msg msg--user">${d ? `<div class="sigref">${icon("pulse")}<span><em>Signaal · ${findProject(d.project).name}</em><b>${d.title}</b></span></div>` : ""}${a.skill ? `<span class="chip chip--skill chip--static">${icon("spark")}${findSkill(a.skill).name}</span>` : ""}<p>${escapeHtml(a.text).replace(/@([\p{L}]+)/gu, '<span class="mention">@$1</span>')}</p></div>`;
      }
      let o = a.reveal ?? 1 / 0,
        r = [];
      a.blocks.forEach((d, l) => {
        if (!(o <= 0))
          if (d.type === "agent")
            (r.push(renderAgent(d, o, s, l, a.answered?.[l])),
              (o -= d.steps.length + 2));
          else {
            if (n && d.type === "followups") {
              o -= 1;
              return;
            }
            (r.push(renderMessageBlock(d, s, a)), (o -= 1));
          }
      });
      let i = a.reveal !== void 0 && a.reveal < a.total;
      return `<div class="msg msg--rise" data-mi="${s}"><span class="msg-avatar">${riseIcon}</span><div class="msg-body">${r.join("")}${i && !r.length ? '<i class="dots"><b></b><b></b><b></b></i>' : ""}</div></div>`;
    })
    .join("");
}

function renderConversations() {
  let e = state.convs.find((o) => o.id === state.convId),
    n = state.convSearch.toLowerCase(),
    a = [...state.convs, ...(isScaled() ? scaleData().extraConversations : [])].filter(
      (o) =>
        !n ||
        o.title.toLowerCase().includes(n) ||
        o.projects.some((r) => findProject(r).name.toLowerCase().includes(n)),
    ),
    s = ["Vandaag", "Deze week", "Eerder"];
  return `<section class="convs">
    <aside class="conv-list">
      <button class="btn btn--rise conv-new" data-action="new-conv">${icon("plus")}Nieuw gesprek</button>
      <label class="search">${icon("search")}<input id="conv-search" placeholder="Zoek in gesprekken" value="${escapeHtml(state.convSearch)}" /></label>
      ${withDataState(() => s
        .map((o) => {
          let r = a.filter((i) => i.group === o);
          return r.length
            ? `<h5>${o}</h5>${r.map((i) => `<button class="cl ${i.id === state.convId ? "is-on" : ""}" data-action="${i.placeholder ? "scale-item" : "open-conv"}" data-id="${i.id}"><b>${escapeHtml(i.title)}</b><em>${i.projects.map((d) => findProject(d).name).join(", ") || "Alle projecten"}${i.skill ? " · " + findSkill(i.skill).name : ""} · ${i.when}</em></button>`).join("")}`
            : "";
        })
        .join("") + (a.length ? "" : renderState({ title: "Geen gesprekken gevonden", text: n ? "Probeer een andere zoekterm." : "", glyph: "search", plain: true })),
        { empty: { title: "Nog geen gesprekken", text: "Je gesprekken met Rise verschijnen hier.", glyph: "talk", plain: true }, rows: 5, wrap: "skeleton-list" })}
    </aside>
    <div class="conv-main">
      ${
        e
          ? `<header class="conv-head"><h2>${escapeHtml(e.title)}</h2><div class="conv-ctx"><span class="comp-ctx-label">Context</span>${e.projects.length ? e.projects.map((o) => `<span class="chip chip--proj chip--static"><b>@</b>${findProject(o).name}</span>`).join("") : '<span class="chip chip--scope">Alle projecten</span>'}${e.skill ? `<span class="chip chip--skill chip--static">${icon("spark")}${findSkill(e.skill).name}</span>` : ""}</div></header>
        <div class="thread" id="thread">${renderThread(e)}</div>
        <div class="conv-compose">${renderComposer("chat", { placeholder: "Stel een vervolgvraag of geef een nieuwe opdracht. Typ @ voor een project.", base: e.projects })}</div>`
          : `<div class="conv-empty">
        <h1>Geef Rise een opdracht</h1>
        <p>Geef Rise je opdracht. Rise kiest zelf welke skills erbij passen en laat zien welke bronnen het gebruikt.</p>
        ${renderComposer("chat", { big: true, placeholder: "Beschrijf wat je wilt laten uitzoeken of maken." })}
        <section class="conversation-skills" aria-labelledby="conversation-skills">
          <h2 id="conversation-skills">Start met een voorbeeld</h2>
          <div class="skill-grid">${skills.map(({ id, name, desc }) => `<button class="skill-card" data-action="chat-skill" data-id="${id}">${icon("spark")}<span><b>${escapeHtml(name)}</b><small>${escapeHtml(desc)}</small></span>${icon("chev")}</button>`).join("")}</div>
        </section>
        </div>`
      }
    </div>
  </section>`;
}

function renderDock() {
  const context = currentDockContext();
  if (state.dock.key !== context.key) {
    state.dock = { open: false, conv: null, text: "", about: null, key: context.key };
  }
  const { open, conv, text, about } = state.dock;
  const suggestions = about
    ? [`Waarom is “${about}” belangrijk?`, `Wat hangt af van “${about}”?`]
    : context.suggestions;
  return `<div class="dock">
    ${open ? `<section class="dock-panel" id="rise-assistant" aria-labelledby="rise-assistant-title">
      <header class="dock-head">
        <div><h2 id="rise-assistant-title">${riseIcon} Rise-assistent</h2><p>${escapeHtml(context.label)}</p></div>
        <button class="icon-btn" id="dock-close" data-action="dock-close" aria-label="Sluit Rise-assistent">${icon("x")}</button>
        ${about ? `<button class="dock-topic" data-action="dock-about-x" aria-label="Verwijder onderwerp ${escapeHtml(about)}">${escapeHtml(about)} ${icon("x")}</button>` : ""}
      </header>
      <div class="dock-body" id="dock-body">${conv ? renderThread(conv, true) : `<div class="dock-starters">${suggestions.map((suggestion) => `<button class="dock-suggestion" data-action="dock-suggest" data-text="${escapeHtml(suggestion)}">${escapeHtml(suggestion)} ${icon("chev")}</button>`).join("")}</div>`}</div>
      <footer class="dock-footer">
        <form class="dock-bar" data-action-submit="dock-send">
          <input id="dock-input" aria-label="Je vraag aan Rise" autocomplete="off" placeholder="Typ je vraag of opdracht" value="${escapeHtml(text)}">
          <button type="submit" class="dock-send" aria-label="Verstuur vraag">${icon("send")}</button>
        </form>
        ${conv ? '<button class="btn btn--link btn--sm" data-action="dock-continue">Verder in Gesprekken</button>' : ""}
      </footer>
    </section>` : ""}
    <button type="button" class="dock-trigger" id="dock-trigger" data-action="dock-toggle" aria-expanded="${open}"${open ? ' aria-controls="rise-assistant"' : ""} aria-keyshortcuts="/">
      <span class="dock-clip">${open ? icon("x") : riseIcon}</span><span>${open ? "Sluit" : "Vraag Rise"}</span>${open ? "" : '<kbd class="kbd">/</kbd>'}
    </button>
  </div>`;
}
