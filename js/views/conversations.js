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
      return `<div class="draft"><div class="draft-head"><span>Concept-agenda</span><b>${s.title} · ${findProject(s.project).name} · ${formatIsoDate(s.date)} om ${s.time}</b></div><ol class="b-agenda">${agendaOf(s).items.map(({ title, note }) => `<li><b>${escapeHtml(title)}</b><span>${escapeHtml(note)}</span></li>`).join("")}</ol></div>`;
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
      const read = new Set(a.blocks.filter((block) => block.type === "sources").flatMap((block) => block.items.map(([doc]) => doc))).size;
      const meta = n ? "" : `<div class="msg-meta"><b>Vicki</b>${i ? `<span class="msg-working">werkt…</span>` : read ? `<span>${read} ${read === 1 ? "stuk" : "stukken"} gelezen</span>` : ""}</div>`;
      const tools = n || i || !a.blocks.some((block) => block.type === "text") ? "" : `<div class="msg-tools">
        <button type="button" data-action="msg-copy" data-mi="${s}">${icon("clip")}Kopieer</button>
        <button type="button" data-action="msg-agenda" data-mi="${s}">${icon("cal")}Zet op de agenda</button>
      </div>`;
      return `<div class="msg msg--rise" data-mi="${s}"><span class="msg-avatar">${vickiIcon()}</span><div class="msg-body">${meta}${r.join("")}${i && !r.length ? '<i class="dots"><b></b><b></b><b></b></i>' : ""}${tools}</div></div>`;
    })
    .join("");
}

/* ── Gesprekken (concept B) ────────────────────────────────────────────
   Eén rustige kolom. Startscherm: vraag stellen + gesprekken per project,
   projectoverstijgend en dossier. Projecthistorie: alle gesprekken van een
   project op een tijdlijn per fase, met wat Vicki onthoudt. Gesprek: vraag
   als kop, bronnen, antwoord en wat Vicki klaarzette. */
const stripHtml = (html = "") => html.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function convPreview(conversation) {
  const reply = conversation.messages.findLast((message) => message.role === "rise");
  const text = reply?.blocks.find((block) => block.type === "text");
  const agent = reply?.blocks.find((block) => block.type === "agent");
  return stripHtml(text?.html ?? agent?.result ?? "");
}

const convMonthFormat = new Intl.DateTimeFormat("nl-NL", { month: "long", timeZone: "UTC" });
const convMonthYearFormat = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric", timeZone: "UTC" });
const convDate = (iso) => new Date((iso ?? demoTodayIso) + "T00:00:00Z");
const convDays = (conversation) => Math.round((convDate(demoTodayIso) - convDate(conversation.date)) / dayMs);
const convMonth = (iso, year = convDate(iso).getUTCFullYear() !== convDate(demoTodayIso).getUTCFullYear()) =>
  (year ? convMonthYearFormat : convMonthFormat).format(convDate(iso));

function convWhen(conversation) {
  const days = convDays(conversation);
  if (days <= 0) return "Vandaag";
  if (days === 1) return "Gisteren";
  const date = convDate(conversation.date);
  if (date.getUTCFullYear() !== convDate(demoTodayIso).getUTCFullYear()) return convMonth(conversation.date).replace(/^\w+/, (m) => m.slice(0, 3));
  return formatIsoDate(conversation.date);
}

function convGroup(conversation) {
  const days = convDays(conversation);
  if (days <= 0) return "Vandaag";
  if (days < 7) return "Deze week";
  if (conversation.date?.slice(0, 7) === demoTodayIso.slice(0, 7)) return "Eerder deze maand";
  const month = convMonth(conversation.date);
  return month.charAt(0).toUpperCase() + month.slice(1);
}

const allConversations = () => [...state.convs, ...(isScaled() ? scaleData().extraConversations : [])];
const byNewest = (a, b) => (b.date ?? demoTodayIso).localeCompare(a.date ?? demoTodayIso);

/* Waar een gesprek hoort: één project, projectoverstijgend ("x") of het dossier */
function convScopeOf(conversation) {
  if (conversation.scope === "dossier") return "dossier";
  return conversation.projects.length === 1 ? conversation.projects[0] : "x";
}

const convScopes = {
  x: { name: "Projectoverstijgend", glyph: "layers", desc: "Over meer projecten of het hele portfolio" },
  dossier: { name: "Dossier", glyph: "book", desc: "Bedrijfsdossier en kaders" },
};
const convScopeName = (key) => convScopes[key]?.name ?? findProject(key)?.name ?? "";

function convScopeMark(key) {
  if (convScopes[key]) return `<span class="gs-mark gs-mark--${key}" aria-hidden="true">${icon(convScopes[key].glyph)}</span>`;
  return `<span class="np-dot" data-status="${escapeHtml(primaryProjectMilestone(key)?.status ?? "Op koers")}" aria-hidden="true"></span>`;
}

function convOutcome(conversation) {
  if (conversation.outcome) return conversation.outcome;
  const reply = conversation.messages.findLast((message) => message.role === "rise");
  if (!reply) return null;
  if (reply.reveal !== undefined && reply.reveal < reply.total) return { glyph: "spark", text: "Vicki werkt eraan…" };
  const blocks = conversation.messages.flatMap((message) => message.blocks ?? []);
  const draft = blocks.findLast((block) => block.type === "draft");
  if (draft) return { glyph: "mail", text: `Conceptmail aan ${stripHtml(draft.to)}` };
  const agenda = blocks.findLast((block) => block.type === "agenda");
  if (agenda) return { glyph: "cal", text: `Agenda ${findMeeting(agenda.meeting).title.toLowerCase()}` };
  const agent = reply.blocks.find((block) => block.type === "agent");
  if (agent) return { glyph: "spark", text: stripHtml(agent.result) };
  const text = convPreview(conversation);
  const sentence = text.split(/(?<=[.!?])\s/)[0];
  return sentence ? { glyph: "check", text: sentence.length > 96 ? sentence.slice(0, 93).replace(/\s+\S*$/, "") + "…" : sentence } : null;
}

function convStatus(conversation) {
  const waiting = conversation.messages.some((message) => message.role === "rise" && message.blocks.some((block, index) => block.type === "agent" && block.need && !message.answered?.[index]));
  if (waiting) return { tone: "ask", text: "Wacht op jou" };
  const blocks = conversation.messages.flatMap((message) => message.blocks ?? []);
  if (blocks.some((block) => block.type === "draft")) return { tone: "made", text: "Concept klaar" };
  if (blocks.some((block) => block.type === "agenda")) return { tone: "made", text: "Agenda klaar" };
  return null;
}

/* Eén gesprek als rij: titel, wat het opleverde, status en datum */
function renderConvItem(conversation, { scope = false, alsoFor = null } = {}) {
  const status = conversation.placeholder ? null : convStatus(conversation);
  const outcome = conversation.placeholder ? conversation.outcome : convOutcome(conversation);
  const others = alsoFor ? conversation.projects.filter((id) => id !== alsoFor).map((id) => findProject(id).name) : [];
  const where = scope ? convScopeName(convScopeOf(conversation)) : "";
  return `<button type="button" class="gs-row" data-action="${conversation.placeholder ? "scale-item" : "open-conv"}" data-id="${conversation.id}">
    <span class="gs-row-main"><b>${escapeHtml(conversation.title)}</b>
      <small>${where ? `<em>${escapeHtml(where)}</em>` : ""}${outcome ? `${icon(outcome.glyph)}<span>${escapeHtml(outcome.text)}</span>` : ""}${others.length ? `<em class="gs-also">ook over ${escapeHtml(others.join(" en "))}</em>` : ""}</small></span>
    ${status ? `<span class="gs-st" data-tone="${status.tone}"><i></i>${status.text}</span>` : "<span></span>"}
    <time>${escapeHtml(convWhen(conversation))}</time>
  </button>`;
}

/* Invoer: één veld, met de plek van de vraag als keuze (project, alles of dossier) */
function renderAsk({ placeholder, big = false, scope = "choose" } = {}) {
  const comp = state.comp.chat;
  const key = comp.dossier ? "dossier" : comp.projects.length === 1 ? comp.projects[0] : "x";
  const label = comp.dossier ? "Alleen het dossier" : comp.projects.length ? comp.projects.map((id) => findProject(id).name).join(", ") : "Alle projecten";
  const scopeControl = scope === "choose"
    ? `<button type="button" class="gs-scope" id="gs-scope" data-action="pop-scope" aria-expanded="${state.pop?.type === "scope"}" aria-controls="choice-popover" aria-label="Waar gaat je vraag over? Nu: ${escapeHtml(label)}">${key === "x" ? `<span class="gs-scope-dot"></span>` : convScopeMark(key)}<span>${escapeHtml(label)}</span>${icon("chev")}</button>`
    : scope === "fixed" ? `<span class="gs-scope is-static">${convScopeMark(key)}<span>${escapeHtml(label)}</span></span>` : "";
  return `<form class="gs-ask ${big ? "is-big" : ""}" data-comp="chat" data-action-submit="send">
    <textarea id="ta-chat" data-comp="chat" rows="${big ? 2 : 1}" aria-label="Vraag of opdracht voor Vicki" placeholder="${escapeHtml(placeholder)}">${escapeHtml(comp.text)}</textarea>
    <div class="gs-ask-bar">
      ${scopeControl}
      ${comp.files.map((file, index) => `<span class="chip chip--file">${icon("doc")}${escapeHtml(file)}<button type="button" data-action="chip-x" data-comp="chat" data-kind="file" data-id="${index}" aria-label="Verwijder">${icon("x")}</button></span>`).join("")}
      <button type="button" class="gs-tool ${comp.skill ? "is-set" : ""}" id="composer-skill-chat" aria-expanded="${state.pop?.type === "skill"}" aria-controls="choice-popover" data-action="pop-skill" data-comp="chat">${icon("spark")}<span>${comp.skill ? escapeHtml(findSkill(comp.skill).name) : "Skill"}</span></button>
      <button type="submit" class="gs-send" aria-label="Verstuur">${icon("arrow")}</button>
    </div>
  </form>`;
}

function renderConversations() {
  const conversation = state.convs.find(({ id }) => id === state.convId);
  if (conversation) return renderConvPage(conversation);
  if (state.convScope) return renderConvHistory(state.convScope);
  return renderConvHome();
}

/* ── Startscherm ─────────────────────────────────────────────────────── */
function renderConvHome() {
  const query = state.convSearch.trim().toLowerCase();
  const all = allConversations().sort(byNewest);
  const found = query
    ? all.filter((item) => item.title.toLowerCase().includes(query) || convScopeName(convScopeOf(item)).toLowerCase().includes(query) || item.projects.some((id) => findProject(id).name.toLowerCase().includes(query)))
    : all;
  const docs = Object.keys(documents).length;
  const ideas = convProposals().slice(0, 3);
  let list;
  if (query) {
    list = found.length
      ? `<p class="gs-found">${found.length} ${found.length === 1 ? "gesprek" : "gesprekken"} gevonden</p><div class="gs-rows">${found.slice(0, 40).map((item) => renderConvItem(item, { scope: true })).join("")}</div>`
      : renderState({ title: "Geen gesprekken gevonden", text: "Probeer een andere zoekterm.", glyph: "search", plain: true });
  } else if (state.convMode === "recent") {
    const groups = new Map();
    for (const item of found.slice(0, 60)) {
      const group = convGroup(item);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    }
    list = [...groups].map(([group, items]) => `<section class="gs-group"><h3>${escapeHtml(group)}</h3><div class="gs-rows">${items.map((item) => renderConvItem(item, { scope: true })).join("")}</div></section>`).join("");
  } else {
    const sections = new Map();
    for (const item of found) {
      const key = convScopeOf(item);
      if (!sections.has(key)) sections.set(key, []);
      sections.get(key).push(item);
    }
    const order = [...projects.map(({ id }) => id).filter((id) => sections.has(id)).sort((a, b) => byNewest(sections.get(a)[0], sections.get(b)[0])), "x", "dossier"].filter((key) => sections.has(key));
    list = order.map((key) => {
      const items = sections.get(key);
      const project = findProject(key);
      const meta = project ? `${project.phase} · ${items.length} ${items.length === 1 ? "gesprek" : "gesprekken"}` : `${convScopes[key].desc} · ${items.length}`;
      return `<section class="gs-sec">
        <header class="gs-sec-head">${convScopeMark(key)}<b>${escapeHtml(convScopeName(key))}</b><em>${escapeHtml(meta)}</em>
          <button type="button" class="gs-more" data-action="conv-scope" data-id="${key}">${project ? "Projecthistorie" : "Alles"}${icon("chev")}</button></header>
        <div class="gs-rows">${items.slice(0, 2).map((item) => renderConvItem(item)).join("")}</div>
      </section>`;
    }).join("");
  }
  return `<div class="gs-page" id="gs-home"><div class="gs-col">
    <header class="gs-hello">
      <img src="${localPath("assets/vicki.svg")}" width="36" height="36" alt="">
      <div><h1>Wat wil je uitzoeken?</h1><p>Ik ken de dossiers van je ${projects.length} projecten, ${docs} stukken en ons procesmodel.</p></div>
    </header>
    ${renderAsk({ big: true, placeholder: "Vraag iets, of typ @ voor een project" })}
    <div class="gs-ideas">${ideas.map((idea, index) => `<button type="button" data-action="conv-propose" data-i="${index}" title="${escapeHtml(idea.gives)}">${icon(idea.glyph)}${escapeHtml(idea.short ?? idea.title)}</button>`).join("")}</div>
    <div class="gs-head">
      ${state.convFind || query
        ? `<label class="gs-find">${icon("search")}<input id="conv-search" placeholder="Zoek in je gesprekken" value="${escapeHtml(state.convSearch)}" autocomplete="off"><button type="button" data-action="conv-find" aria-label="Sluit zoeken">${icon("x")}</button></label>`
        : `<h2>Je gesprekken</h2>
          <div class="gs-seg" role="group" aria-label="Indeling">${[["project", "Per project"], ["recent", "Recent"]].map(([value, label]) => `<button type="button" data-action="conv-mode" data-value="${value}" aria-pressed="${state.convMode === value}">${label}</button>`).join("")}</div>
          <button type="button" class="gs-round" data-action="conv-find" aria-label="Zoek in gesprekken">${icon("search")}</button>`}
    </div>
    ${withDataState(() => list, { empty: { title: "Nog geen gesprekken", text: "Je gesprekken met Vicki verschijnen hier, per project.", glyph: "talk", plain: true }, rows: 5, wrap: "skeleton-list" })}
  </div></div>`;
}

/* ── Projecthistorie (of alle gesprekken van een andere sectie) ──────── */
function renderConvHistory(key) {
  const project = findProject(key);
  const history = project ? projectHistory[key] : null;
  const items = allConversations()
    .filter((item) => (project ? item.projects.includes(key) && convScopeOf(item) !== "dossier" : convScopeOf(item) === key))
    .sort(byNewest);
  const oldest = items.at(-1)?.date;
  const meta = project
    ? `${project.phase} · ${items.length} ${items.length === 1 ? "gesprek" : "gesprekken"}${oldest ? ` sinds ${convMonth(oldest)}` : ""}`
    : `${convScopes[key].desc} · ${items.length} ${items.length === 1 ? "gesprek" : "gesprekken"}`;
  const row = (item) => {
    const status = item.placeholder ? null : convStatus(item);
    const outcome = item.placeholder ? item.outcome : convOutcome(item);
    const others = project ? item.projects.filter((id) => id !== key).map((id) => findProject(id).name) : item.projects.map((id) => findProject(id).name);
    return `<button type="button" class="gs-it ${status ? "is-open" : ""}" data-action="${item.placeholder ? "scale-item" : "open-conv"}" data-id="${item.id}">
      <span><b>${escapeHtml(item.title)}</b>
      <small>${outcome ? `${icon(outcome.glyph)}<span>${escapeHtml(outcome.text)}</span>` : ""}${status ? `<i data-tone="${status.tone}">${status.text.toLowerCase()}</i>` : ""}${others.length ? `<em class="gs-also">${project ? "ook over " : ""}${escapeHtml(others.join(", "))}</em>` : ""}</small></span>
      <time>${escapeHtml(convWhen(item))}</time>
    </button>`;
  };
  let timeline = "";
  if (history) {
    const phases = history.phases;
    timeline = phases.map((phase, index) => {
      const until = phases[index - 1]?.from;
      const inPhase = items.filter((item) => (item.date ?? demoTodayIso) >= phase.from || index === phases.length - 1).filter((item) => !until || (item.date ?? demoTodayIso) < until);
      const end = until ? new Date(convDate(until) - dayMs).toISOString().slice(0, 10) : null;
      const span = index === 0 ? `sinds ${convMonth(phase.from)}` : `${convMonth(phase.from)} tot ${convMonth(end)}`;
      return `<section class="gs-phase">
        <header><b>${escapeHtml(phase.name)}</b><em>${escapeHtml(span)}</em>${index === 0 ? `<span class="gs-now">Nu</span>` : ""}</header>
        ${inPhase.length ? `<div class="gs-tl">${inPhase.map(row).join("")}</div>` : `<p class="gs-tl-empty">Geen gesprekken in deze fase.</p>`}
        ${phase.gate ? `<div class="gs-gate"><b>${escapeHtml(phase.gate.title)}</b><span>${escapeHtml(phase.gate.text)}</span><time>${escapeHtml(formatIsoDate(phase.gate.date))}</time></div>` : ""}
      </section>`;
    }).join("");
  } else {
    const groups = new Map();
    for (const item of items) {
      const group = convGroup(item);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(item);
    }
    timeline = [...groups].map(([group, list]) => `<section class="gs-phase"><header><b>${escapeHtml(group)}</b></header><div class="gs-tl">${list.map(row).join("")}</div></section>`).join("");
  }
  const memory = history?.memory.map((item, index) => ({ ...item, index })).filter((item) => !state.convForget[`${key}:${item.index}`]) ?? [];
  return `<div class="gs-page" id="gs-hist-${key}"><div class="gs-col">
    <button type="button" class="gs-back" data-action="conv-home">${icon("back")}Gesprekken</button>
    <header class="gs-title">${project ? "" : convScopeMark(key)}<h1>${escapeHtml(convScopeName(key))}</h1><p>${escapeHtml(meta)}</p></header>
    ${renderAsk({ scope: "fixed", placeholder: project ? `Vraag iets over ${project.name}. Ik neem de hele historie mee.` : key === "dossier" ? "Vraag iets over het bedrijfsdossier of de kaders" : "Vraag iets over meer projecten tegelijk" })}
    ${memory.length ? `<section class="gs-memory" aria-labelledby="gs-memory-title">
      <header><img src="${localPath("assets/vicki.svg")}" width="20" height="20" alt=""><b id="gs-memory-title">Wat ik onthoud over ${escapeHtml(project.name)}</b><span>Uit ${items.length} gesprekken en het projectdossier</span></header>
      <ul>${memory.map((item) => `<li>${certaintyBadge(item.level, item.level === "check" ? "Nog open" : undefined)}<span>${escapeHtml(item.text)}</span><time>${escapeHtml(convDays({ date: item.date }) <= 0 ? "vandaag" : formatIsoDate(item.date))}</time><button type="button" class="gs-forget" data-action="conv-forget" data-key="${key}:${item.index}" aria-label="Laat Vicki dit vergeten" title="Klopt niet meer? Laat Vicki het vergeten.">${icon("x")}</button></li>`).join("")}</ul>
    </section>` : ""}
    ${withDataState(() => timeline || renderState({ title: "Nog geen gesprekken", text: "Stel hierboven je eerste vraag.", glyph: "talk", plain: true }), { empty: { title: "Nog geen gesprekken", text: "Gesprekken over dit onderwerp verschijnen hier.", glyph: "talk", plain: true }, rows: 4, wrap: "skeleton-list" })}
  </div></div>`;
}

/* ── Gesprek: vraag als kop, bronnen, antwoord, klaargezet ───────────── */
function renderConvPage(conversation) {
  const key = convScopeOf(conversation);
  const label = key === "x" && conversation.projects.length ? conversation.projects.map((id) => findProject(id).name).join(", ") : key === "x" ? "Alle projecten" : convScopeName(key);
  const turns = [];
  conversation.messages.forEach((message, index) => {
    if (message.role === "user") turns.push({ user: message, ui: index });
    else if (turns.length) Object.assign(turns.at(-1), { reply: message, ri: index });
  });
  const lastBusy = turns.at(-1)?.reply && turns.at(-1).reply.reveal < turns.at(-1).reply.total;
  return `<div class="gs-conv">
    <div class="gs-bar">
      <button type="button" class="gs-back" data-action="${state.convScope ? "conv-scope" : "conv-home"}" data-id="${state.convScope ?? ""}">${icon("back")}<span>${escapeHtml(state.convScope ? convScopeName(state.convScope) : "Gesprekken")}</span></button>
      <span class="gs-grow"></span>
      <button type="button" class="gs-scope gs-scope--bar" id="gs-move" data-action="pop-move" aria-expanded="${state.pop?.type === "move"}" aria-controls="choice-popover" title="Verplaats dit gesprek">${key === "x" ? `<span class="gs-scope-dot"></span>` : convScopeMark(key)}<span>${escapeHtml(label)}</span>${icon("chev")}</button>
      <button type="button" class="gs-ghost" data-action="new-conv">${icon("plus")}<span>Nieuw</span></button>
    </div>
    <div class="gs-scroll" id="thread"><div class="gs-col gs-col--conv">
      ${turns.map((turn, index) => renderConvTurn(conversation, turn, index === 0, index === turns.length - 1)).join("")}
    </div></div>
    <div class="gs-dock">${renderAsk({ scope: "none", placeholder: lastBusy ? "Vicki werkt nog. Je kunt alvast verder typen." : "Vraag verder, of geef een nieuwe opdracht" })}</div>
  </div>`;
}

function renderConvTurn(conversation, { user, ui, reply, ri }, first, last) {
  const signal = user.signal && findSignal(user.signal);
  const question = escapeHtml(user.text).replace(/@([\p{L}]+)/gu, '<span class="mention">$1</span>');
  const head = `<div class="gs-turn-q">
    ${signal ? `<span class="gs-ref">${icon("pulse")}Signaal · ${escapeHtml(findProject(signal.project).name)}</span>` : ""}
    ${user.skill ? `<span class="gs-ref">${icon("spark")}${escapeHtml(findSkill(user.skill).name)}</span>` : ""}
    ${first ? `<h1 class="gs-q">${question}</h1>` : `<h2 class="gs-q gs-q--next">${question}</h2>`}
  </div>`;
  if (!reply) return `<section class="gs-turn">${head}</section>`;
  let budget = reply.reveal ?? Infinity;
  const running = reply.reveal !== undefined && reply.reveal < reply.total;
  let sources = null;
  let followups = null;
  const agents = [];
  const body = [];
  reply.blocks.forEach((block, index) => {
    if (budget <= 0) return;
    if (block.type === "agent") {
      agents.push(renderAgent(block, budget, ri, index, reply.answered?.[index]));
      budget -= block.steps.length + 2;
      return;
    }
    budget -= 1;
    if (block.type === "sources") sources = block;
    else if (block.type === "followups") followups = block;
    else body.push(renderMessageBlock(block, ri, reply));
  });
  const asked = new Set(conversation.messages.filter((message) => message.role === "user").map((message) => message.text));
  const read = sources?.items.length ?? 0;
  const model = sources?.items.some(([doc]) => doc === "bd-werkwijze");
  const cards = sources
    ? `<div class="gs-sources">${sources.items.map(([doc, passage], index) => documents[doc] ? `<a class="gs-src ${doc === "bd-werkwijze" ? "is-model" : ""}" href="${sourceHref(doc, passage)}" data-action="open-doc" data-doc="${doc}" data-passage="${passage ?? ""}"><small><i>${index + 1}</i>${escapeHtml(documents[doc].kind ?? "Document")}</small><b>${escapeHtml(documents[doc].title)}</b></a>` : "").join("")}</div>`
    : "";
  const trail = running
    ? `<p class="gs-trail is-busy"><i class="dots"><b></b><b></b><b></b></i>${sources ? "Vicki schrijft het antwoord…" : "Vicki leest je dossier…"}</p>`
    : read ? `<p class="gs-trail">${icon("check")}Vicki las ${read} ${read === 1 ? "stuk" : "stukken"}${model ? " en legde het procesmodel ernaast" : ""}</p>` : "";
  const tools = running || !reply.blocks.some((block) => block.type === "text") ? "" : `<div class="gs-tools">
    <button type="button" data-action="msg-copy" data-mi="${ri}">${icon("clip")}Kopieer</button>
    <button type="button" data-action="msg-agenda" data-mi="${ri}">${icon("cal")}Zet op de agenda</button>
  </div>`;
  return `<section class="gs-turn">
    ${head}
    ${cards}${trail}
    <div class="gs-answer" data-mi="${ri}">
      <span class="gs-avatar">${vickiIcon()}</span>
      <div class="gs-body">${agents.join("")}${body.join("")}${tools}</div>
    </div>
    ${last && followups && !running && followups.items.some((text) => !asked.has(text)) ? `<div class="gs-next"><h3>Verder vragen</h3>${followups.items.filter((text) => !asked.has(text)).map((text) => `<button type="button" data-action="followup" data-text="${escapeHtml(text)}">${icon("arrow")}${escapeHtml(text)}</button>`).join("")}</div>` : ""}
  </section>`;
}

/* Wat Vicki nu voor je kan doen: afgeleid uit agenda's, signalen en kansen */
function convProposals() {
  const list = [];
  const nextMeeting = meetings
    .filter((meeting) => meeting.date >= demoTodayIso && agendaOf(meeting).stage === "concept")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (nextMeeting) {
    const name = findProject(nextMeeting.project).name;
    list.push({
      glyph: "cal",
      title: `Werk de agenda van ${nextMeeting.title.toLowerCase()} uit`,
      short: `Bereid ${nextMeeting.title.toLowerCase()} voor`,
      meta: `${name} · ${meetingDay(nextMeeting.date, meetingDayShort)}`,
      gives: "Concept-agenda met onderbouwing",
      start: { text: `Bereid ${nextMeeting.title} van @${name.replace(/\s/g, "")} voor`, projects: [nextMeeting.project], skill: "overleg" },
    });
  }
  const open = sortSignalsByAction(openSignals());
  const chance = open.find((signal) => signalLinks[signal.id]?.soort === "vooruitwerken");
  if (chance) {
    const intent = chance.steps.find((step) => step.intent?.startsWith("vooruitwerken"))?.intent;
    list.push({
      glyph: "forward",
      title: "Reken door wat vooruitwerken oplevert",
      short: `Vooruitwerken bij ${findProject(chance.project).name}?`,
      meta: `${findProject(chance.project).name} · ${chance.title.toLowerCase()}`,
      gives: signalLinks[chance.id].label,
      start: { text: `Wat levert het op als we bij @${findProject(chance.project).name.replace(/\s/g, "")} vooruitwerken?`, projects: [chance.project], origin: intent ? { intent } : { signal: chance.id } },
    });
  }
  const first = open.find((signal) => signal !== chance);
  if (first) list.push({
    glyph: "pulse",
    title: `Zoek uit: ${first.title.charAt(0).toLowerCase() + first.title.slice(1)}`,
    short: first.title,
    meta: `${findProject(first.project).name} · ${certaintyLabels[first.level].toLowerCase()}`,
    gives: "Wat vastligt en wat je nu kunt doen",
    start: { text: "", projects: [first.project], origin: { signal: first.id } },
  });
  list.push({
    glyph: "spark",
    title: "Wat vraagt deze week mijn aandacht?",
    meta: `${projects.length} projecten`,
    gives: "Overzicht op volgorde van actiemoment",
    start: { text: "Wat vraagt deze week mijn aandacht?", projects: [] },
  });
  return list.slice(0, 4);
}


function renderDock() {
  const context = currentDockContext();
  if (state.dock.key !== context.key) {
    if (typeof stopVickiSpeech === "function") stopVickiSpeech();
    state.dock = { open: false, conv: null, text: "", about: null, key: context.key };
  }
  const { open, conv, text, about, tipDismissed } = state.dock;
  const tip = about ? null : currentVickiTip(context);
  const lastReply = conv?.messages.findLast((message) => message.role === "rise");
  const thinking = lastReply && lastReply.reveal < lastReply.total;
  const speaking = typeof vickiSpeech !== "undefined" && Boolean(vickiSpeech);
  const pose = speaking || (thinking && lastReply.reveal > 0) ? "talking" : thinking ? "thinking" : open ? "listening" : tip && !tipDismissed ? "noticed" : "idle";
  const suggestions = about
    ? [`Waarom is “${about}” belangrijk?`, `Wat hangt af van “${about}”?`]
    : context.suggestions.filter((suggestion) => suggestion !== tip?.prompt);
  return `<div class="dock ${open ? "dock--open" : ""}">
    ${open ? `<section class="dock-panel" id="rise-assistant" aria-labelledby="rise-assistant-title">
      <header class="dock-head">
        <div><h2 id="rise-assistant-title">Vicki</h2><p>${escapeHtml(context.label)}</p></div>
        <button class="icon-btn" id="dock-close" data-action="dock-close" aria-label="Sluit Vicki">${icon("x")}</button>
        ${about ? `<button class="dock-topic" data-action="dock-about-x" aria-label="Verwijder onderwerp ${escapeHtml(about)}">${escapeHtml(about)} ${icon("x")}</button>` : ""}
      </header>
      <div class="dock-body" id="dock-body">${conv ? renderThread(conv, true) : `
        ${tip ? `<div class="vicki-panel-tip"><p>${escapeHtml(tip.text)}</p><button class="btn btn--rise btn--sm" data-action="dock-suggest" data-text="${escapeHtml(tip.prompt)}">${escapeHtml(tip.action)} ${icon("chev")}</button></div>` : ""}
        <div class="dock-starters">${suggestions.map((suggestion) => `<button class="dock-suggestion" data-action="dock-suggest" data-text="${escapeHtml(suggestion)}">${escapeHtml(suggestion)} ${icon("chev")}</button>`).join("")}</div>`}</div>
      <footer class="dock-footer">
        <form class="dock-bar" data-action-submit="dock-send">
          <input id="dock-input" aria-label="Je vraag aan Vicki" autocomplete="off" placeholder="Vraag iets of geef een opdracht" value="${escapeHtml(text)}">
          <button type="submit" class="dock-send" aria-label="Verstuur vraag">${icon("arrow")}</button>
        </form>
        ${conv ? `<div class="vicki-panel-actions"><button class="btn btn--link btn--sm" data-action="dock-continue">Verder in Gesprekken</button>
          ${!thinking && typeof speechSynthesis !== "undefined" ? `<button id="vicki-voice" class="btn btn--link btn--sm" data-action="vicki-speak">${speaking ? "Stop voorlezen" : "Lees antwoord voor"}</button>` : ""}
          ${thinking || speaking ? `<span class="vicki-status" role="status">${speaking ? "Vicki leest voor…" : "Vicki denkt na…"}</span>` : ""}
        </div>` : ""}
      </footer>
    </section>` : ""}
    <div class="vicki-presence">
      ${!open && tip && !tipDismissed ? `<div class="vicki-bubble ${tip.ask ? "is-ask" : ""}">
        <button id="vicki-tip-open" class="vicki-tip-open" data-action="${tip.run ?? "dock-open"}"><strong>Vicki</strong><span>${escapeHtml(tip.text)}</span>${tip.ask ? `<em class="vicki-tip-go">${escapeHtml(tip.action)}${icon("chev")}</em>` : ""}</button>
        <button class="icon-btn vicki-tip-close" data-action="vicki-tip-dismiss" aria-label="Verberg Vicki-tip">${icon("x")}</button>
      </div>` : ""}
      <button type="button" class="dock-trigger" id="dock-trigger" data-action="dock-toggle" aria-expanded="${open}"${open ? ' aria-controls="rise-assistant"' : ""} aria-keyshortcuts="/">
        <span class="vicki-figure">${vickiFigure(pose)}</span><span class="vicki-trigger-label">${open ? "Sluit Vicki" : "Vraag Vicki"}</span>
      </button>
    </div>
  </div>`;
}
