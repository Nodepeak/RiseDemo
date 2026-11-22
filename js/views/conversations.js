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
            ? `<h5>${o}</h5>${r.map((i) => renderConvRow(i)).join("")}`
            : "";
        })
        .join("") + (a.length ? "" : renderState({ title: "Geen gesprekken gevonden", text: n ? "Probeer een andere zoekterm." : "", glyph: "search", plain: true })),
        { empty: { title: "Nog geen gesprekken", text: "Je gesprekken met Vicki verschijnen hier.", glyph: "talk", plain: true }, rows: 5, wrap: "skeleton-list" })}
    </aside>
    <div class="conv-main">
      ${
        e
          ? `<header class="conv-head"><div><h2>${escapeHtml(e.title)}</h2><div class="conv-ctx">${e.projects.length ? e.projects.map((o) => `<span class="chip chip--proj chip--static"><b>@</b>${findProject(o).name}</span>`).join("") : '<span class="chip chip--scope">Alle projecten</span>'}${e.skill ? `<span class="chip chip--skill chip--static">${icon("spark")}${findSkill(e.skill).name}</span>` : ""}</div></div>
          <button type="button" class="conv-sheet-toggle" data-action="conv-sheet" aria-pressed="${state.convSheet !== false}">${icon("layers")}<span>Werkblad</span></button></header>
        <div class="conv-split ${state.convSheet === false ? "" : "has-sheet"}">
          <div class="conv-col">
            <div class="thread" id="thread">${renderThread(e)}</div>
            <div class="conv-compose">${renderComposer("chat", { placeholder: "Stel een vervolgvraag of geef een nieuwe opdracht. Typ @ voor een project.", base: e.projects })}</div>
          </div>
          ${state.convSheet === false ? "" : renderConvSheet(e)}
        </div>`
          : renderConvStart()
      }
    </div>
  </section>`;
}

/* ── Gesprekken: werkplek in plaats van een chatvenster ─────────────── */
const stripHtml = (html = "") => html.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function convPreview(conversation) {
  const reply = conversation.messages.findLast((message) => message.role === "rise");
  const text = reply?.blocks.find((block) => block.type === "text");
  const agent = reply?.blocks.find((block) => block.type === "agent");
  return stripHtml(text?.html ?? agent?.result ?? "");
}

function convStatus(conversation) {
  const waiting = conversation.messages.some((message) => message.role === "rise" && message.blocks.some((block, index) => block.type === "agent" && block.need && !message.answered?.[index]));
  if (waiting) return { tone: "ask", text: "Wacht op jou" };
  const blocks = conversation.messages.flatMap((message) => message.blocks ?? []);
  if (blocks.some((block) => block.type === "draft")) return { tone: "made", text: "Concept klaar" };
  if (blocks.some((block) => block.type === "agenda")) return { tone: "made", text: "Agenda klaar" };
  return null;
}

function renderConvRow(conversation) {
  const status = conversation.placeholder ? null : convStatus(conversation);
  const preview = conversation.placeholder ? "" : convPreview(conversation);
  const names = conversation.projects.map((id) => findProject(id).name).join(", ") || "Alle projecten";
  return `<button class="cl ${conversation.id === state.convId ? "is-on" : ""}" data-action="${conversation.placeholder ? "scale-item" : "open-conv"}" data-id="${conversation.id}">
    <span class="cl-top"><b>${escapeHtml(conversation.title)}</b><time>${escapeHtml(conversation.when)}</time></span>
    ${preview ? `<span class="cl-preview">${escapeHtml(preview)}</span>` : ""}
    <span class="cl-meta"><span>${escapeHtml(names)}</span>${status ? `<i class="cl-status" data-tone="${status.tone}">${status.text}</i>` : ""}</span>
  </button>`;
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
      meta: `${findProject(chance.project).name} · ${chance.title.toLowerCase()}`,
      gives: signalLinks[chance.id].label,
      start: { text: `Wat levert het op als we bij @${findProject(chance.project).name.replace(/\s/g, "")} vooruitwerken?`, projects: [chance.project], origin: intent ? { intent } : { signal: chance.id } },
    });
  }
  const first = open.find((signal) => signal !== chance);
  if (first) list.push({
    glyph: "pulse",
    title: `Zoek uit: ${first.title.charAt(0).toLowerCase() + first.title.slice(1)}`,
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

function renderConvStart() {
  const docs = Object.keys(documents).length;
  return `<div class="conv-empty conv-start">
    <header class="cs-head">
      <img class="cs-vicki" src="${localPath("assets/vicki.svg")}" width="48" height="48" alt="">
      <div><h1>Waar zal ik aan werken, ${escapeHtml(profile.first)}?</h1>
      <p>Ik ken je ${projects.length} projecten, ${docs} stukken in het dossier en ons procesmodel.</p></div>
    </header>
    ${renderComposer("chat", { big: true, placeholder: "Beschrijf wat je wilt laten uitzoeken of maken. Typ @ voor een project." })}
    <section class="cs-propose" aria-labelledby="cs-propose-title">
      <h2 id="cs-propose-title">Dit kan ik nu voor je doen</h2>
      <div class="cs-grid">${convProposals().map((proposal, index) => `<button type="button" class="cs-card" data-action="conv-propose" data-i="${index}">
        <span class="cs-icon">${icon(proposal.glyph)}</span>
        <span class="cs-body"><b>${escapeHtml(proposal.title)}</b><small>${escapeHtml(proposal.meta)}</small></span>
        <span class="cs-gives">${icon("arrow")}${escapeHtml(proposal.gives)}</span>
      </button>`).join("")}</div>
    </section>
    <section class="conversation-skills" aria-labelledby="conversation-skills">
      <h2 id="conversation-skills">Of kies een vaardigheid</h2>
      <div class="skill-grid">${skills.map(({ id, name, desc }) => `<button class="skill-card" data-action="chat-skill" data-id="${id}" title="${escapeHtml(desc)}">${icon("spark")}<span><b>${escapeHtml(name)}</b></span></button>`).join("")}</div>
    </section>
  </div>`;
}

/* Werkblad: wat Vicki gebruikte en wat het gesprek opleverde */
function renderConvSheet(conversation) {
  const made = [];
  const docs = new Map();
  conversation.messages.forEach((message, mi) => {
    if (message.role !== "rise") return;
    const shown = message.reveal === undefined || message.reveal >= message.total;
    if (!shown) return;
    const hasProduct = message.blocks.some((block) => ["draft", "agenda", "table"].includes(block.type));
    for (const block of message.blocks) {
      if (block.type === "draft") made.push({ mi, glyph: "mail", title: `Conceptmail aan ${stripHtml(block.to)}`, meta: "Niet verstuurd" });
      if (block.type === "agenda") { const meeting = findMeeting(block.meeting); made.push({ mi, glyph: "cal", title: `Agenda ${meeting.title.toLowerCase()}`, meta: findProject(meeting.project).name }); }
      if (block.type === "table") made.push({ mi, glyph: "grid", title: block.head.slice(0, 2).map(stripHtml).join(" en "), meta: `Tabel · ${block.rows.length} rijen` });
      if (block.type === "agent" && !hasProduct) made.push({ mi, glyph: "spark", title: stripHtml(block.result), meta: block.agent });
      if (block.type === "sources") for (const [doc] of block.items) if (documents[doc]) docs.set(doc, documents[doc]);
    }
  });
  const signal = conversation.origin?.signal && findSignal(conversation.origin.signal);
  return `<aside class="conv-sheet" aria-label="Werkblad">
    ${made.length ? `<section><h3>Opgeleverd</h3><ul class="sheet-made">${made.map((item) => `<li><button type="button" data-action="conv-jump" data-mi="${item.mi}"><span class="sm-icon">${icon(item.glyph)}</span><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.meta)}</small></span></button></li>`).join("")}</ul></section>` : ""}
    ${docs.size ? `<section><h3>Gelezen <span>${docs.size}</span></h3><ul class="sheet-docs">${[...docs].map(([id, doc]) => `<li><a href="${sourceHref(id)}" data-action="open-doc" data-doc="${id}">${icon("doc")}<span><b>${escapeHtml(doc.title)}</b><small>${escapeHtml([doc.kind, doc.date].filter(Boolean).join(" · "))}</small></span></a></li>`).join("")}</ul></section>` : ""}
    <section><h3>Context</h3><ul class="sheet-ctx">
      ${conversation.projects.length ? conversation.projects.map((id) => { const project = findProject(id); return `<li><a href="${pageHref({ view: "project", projectId: id, section: "signalen" })}" data-action="nav" data-view="project" data-project="${id}" data-section="signalen"><i class="np-dot" data-status="${escapeHtml(primaryProjectMilestone(id)?.status ?? "Op koers")}"></i><span><b>${escapeHtml(project.name)}</b><small>${escapeHtml(project.phase)}</small></span></a></li>`; }).join("") : `<li><span class="sheet-all">Alle projecten</span></li>`}
      ${signal ? `<li><button type="button" data-action="open-signal" data-id="${signal.id}">${icon("pulse")}<span><b>${escapeHtml(signal.title)}</b><small>Signaal</small></span></button></li>` : ""}
    </ul></section>
    <p class="sheet-trust">${icon("lock")}Vicki werkt alleen met je dossier. Er gaat niets naar buiten zonder jouw akkoord.</p>
  </aside>`;
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
          <button type="submit" class="dock-send" aria-label="Verstuur vraag">${icon("send")}</button>
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
