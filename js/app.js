function render() {
  if (navigateToPage(findPage(state))) return;

  const activeField = document.activeElement;
  const focusId = state.nextFocus || activeField?.id;
  const selection = [activeField?.selectionStart, activeField?.selectionEnd];
  const scrollPositions = Object.fromEntries(
    ["#content", "#thread", "#dock-body", ".nav", ".drawer"].map((selector) => [
      selector,
      select(selector)?.scrollTop,
    ]),
  );

  const app = select("#app");
  app.classList.toggle("is-mobile-nav", state.mobileNav);
  const choiceScroll = select(".choice-options")?.scrollTop;
  const trackingDrafts = new Map(
    [...app.querySelectorAll(".tracking-form")].map((form) => [form.id, new FormData(form)]),
  );
  const openedDetails = [
    "#hidden-signals",
    ".library-demo",
    ".document-versions",
  ].filter((selector) => select(selector)?.open);
  morph(app, renderFrame());
  for (const form of app.querySelectorAll(".tracking-form")) {
    for (const [name, value] of trackingDrafts.get(form.id) ?? [])
      form.elements.namedItem(name).value = value;
  }
  saveTrackingProgress();
  const choiceOptions = select(".choice-options");
  if (
    choiceOptions &&
    choiceScroll != null &&
    ["context", "projects"].includes(state.pop?.type)
  )
    choiceOptions.scrollTop = choiceScroll;
  for (const selector of openedDetails) {
    const details = select(selector);
    if (details) details.open = true;
  }
  select("#content").scrollTop = state.scrollTop
    ? 0
    : (scrollPositions["#content"] ?? 0);
  for (const selector of ["#thread", "#dock-body", ".nav", ".drawer"]) {
    const panel = select(selector);
    if (!panel) continue;
    const follow =
      (selector === "#thread" || selector === "#dock-body") &&
      state.scrollThread;
    panel.scrollTop = follow
      ? panel.scrollHeight
      : (scrollPositions[selector] ?? 0);
  }

  state.scrollTop = false;
  state.scrollThread = false;
  state.nextFocus = null;
  const focus = document.getElementById(focusId);
  if (focus) {
    focus.focus({ preventScroll: true });
    if (
      activeField?.id === focusId &&
      focus.setSelectionRange &&
      selection[0] != null
    ) {
      focus.setSelectionRange(...selection);
    }
  }
}

function closeChoicePopover() {
  state.nextFocus = state.pop?.triggerId;
  state.pop = null;
  render();
}

function openPopover(type, trigger, options = {}) {
  if (
    trigger.id &&
    state.pop?.triggerId === trigger.id &&
    state.pop.type === type
  ) {
    return closeChoicePopover();
  }
  const bounds = trigger.getBoundingClientRect();
  const below = window.innerHeight - bounds.bottom - 16;
  const above = bounds.top - 16;
  const up = below < 300 && above > below;
  state.pop = {
    type,
    triggerId: trigger.id,
    x: Math.max(8, Math.min(bounds.left, window.innerWidth - 368)),
    y: up ? window.innerHeight - bounds.top + 8 : bounds.bottom + 8,
    up,
    space: up ? above : below,
    ...options,
  };
  if (type !== "mention") state.nextFocus = "choice-search";
  render();
}

function addProjectContext(e, n) {
  let a = state.comp[e];
  a.projects.includes(n) || a.projects.push(n);
}

function submitComposer(e) {
  let n = state.comp[e],
    a = n.text.trim();
  if (!a && !n.skill) return;
  let s = a || `${findSkill(n.skill).name}`;
  if (e === "home" || !state.convs.find((o) => o.id === state.convId)) {
    let o = startConversation({
      text: s,
      projects: n.projects,
      skill: n.skill,
    });
    ((state.comp[e] = emptyComposer()),
      navigate({ view: "gesprekken", convId: o.id }));
  } else {
    let o = state.convs.find((r) => r.id === state.convId);
    (sendFollowup(o, s, { projects: n.projects, skill: n.skill ?? void 0 }),
      (state.comp.chat = emptyComposer()),
      render());
  }
}

function sendDockMessage(e) {
  let n = currentDockContext();
  if (!e.trim()) return;
  stopVickiSpeech();
  let a = e.trim();
  state.dock.conv ||
    (state.dock.conv = {
      id: "c-" + newId(),
      title: "Nieuw gesprek",
      projects: [...n.projects],
      skill: null,
      when: "Nu",
      group: "Vandaag",
      origin: n.origin,
      messages: [],
    });
  let s = state.dock.conv;
  ((s.projects = [...new Set([...s.projects, ...projectsFromMentions(a)])]),
    s.messages.push({ role: "user", text: a }));
  let o = getDemoReply({
      text: a,
      projects: s.projects,
      pageLabel: n.label,
      docId: n.docId,
      docSummary: n.docSummary,
      milestoneName: state.dock.about,
      origin: n.origin,
    }),
    r = {
      role: "rise",
      blocks: o.blocks,
      reveal: 0,
      total: replyLength(o.blocks),
    };
  (s.messages.push(r),
    s.title === "Nieuw gesprek" && (s.title = o.title),
    (state.dock.text = ""),
    (state.dock.open = !0),
    animateReply(r),
    render());
}

function saveDemoFollowup(id) {
  const current = signalFollowup(id);
  if (current.status === "Afgerond" || current.note) return;
  state.signalFollowups[id] = {
    ...current,
    status: "In behandeling",
    deadline: id === "s-pz" ? "2026-11-24" : "2026-12-19",
    check: id === "s-pz" ? "2026-11-27" : "2026-12-19",
    note:
      id === "s-pz"
        ? "Joost gaat na of de opdracht is verstrekt en koppelt dit op 24 nov terug. Controle op 27 nov."
        : "Maartje vraagt Ruben wanneer het gevelbelastingconcept beschikbaar is. Controle op 19 dec. De conceptmail staat klaar om handmatig te versturen.",
  };
  showToast("Afspraak opgeslagen in deze demo");
}

function runMessageAction(e, n) {
  if (e.trackSignal) {
    saveDemoFollowup(e.trackSignal);
    state.drawer = e.trackSignal;
    state.drawerSection = "followup";
    state.nextFocus = "close-signal-drawer";
    return render();
  }
  if ((e.toast && showToast(e.toast), e.go)) {
    if (e.adoptAgenda) state.agendaAdopted[e.go.meetingId] = true;
    return navigate(e.go);
  }
  e.intent &&
    n &&
    (sendFollowup(n, e.label, { origin: { intent: e.intent } }), render());
}

function runSignalStep(e, n) {
  if (n.go) return navigate(n.go);
  // Een agendapunt gaat direct op de agenda van het eerstvolgende overleg.
  if ((n.intent ?? "").startsWith("meeting") && !/bereid/i.test(n.label)) {
    const meeting = nextProjectMeeting(e.project);
    if (meeting) {
      state.onAgenda[e.id] = meeting.id;
      const agenda = agendaOf(meeting);
      const entry = addAgendaItem(meeting, { title: e.title, note: signalDescription(e).why, source: e.id, by: "vicki" });
      if (entry && agenda.stage === "sent") {
        entry.late = true;
        agenda.late.push(entry.id);
        saveTrackingProgress();
        return showToast(`De agenda van ${meeting.title} is al verstuurd. Vicki zette dit klaar als aanvulling.`, { action: "undo-agenda", id: e.id });
      }
      saveTrackingProgress();
      return showToast(`Op de agenda van ${meeting.title} gezet, met de onderbouwing erbij`, { action: "undo-agenda", id: e.id });
    }
  }
  // Concepten, doorrekeningen en controles: Rise heeft het al uitgewerkt, je ziet het in het zijpaneel.
  if (n.intent && demoReplies[n.intent] && !(n.intent ?? "").startsWith("meeting")) {
    state.drawer = e.id;
    state.drawerWork = n.intent;
    state.drawerSection = null;
    state.nextFocus = "close-signal-drawer";
    return render();
  }
  let a = startConversation({
    text: n.label,
    projects: [e.project],
    origin: { intent: n.intent === "signal" ? void 0 : n.intent, signal: e.id },
  });
  ((a.messages[0].signal = e.id),
    navigate({ view: "gesprekken", convId: a.id }));
}

function continueDockConversation() {
  let e = state.dock.conv;
  e &&
    ((e.title = e.title || "Gesprek"),
    state.convs.unshift(e),
    navigate({ view: "gesprekken", convId: e.id }),
    (state.scrollThread = !0));
}

let vickiSpeech = null;

function stopVickiSpeech() {
  if (!vickiSpeech) return;
  vickiSpeech = null;
  speechSynthesis.cancel();
}

function speakVickiReply() {
  if (vickiSpeech) {
    stopVickiSpeech();
    return render();
  }
  const answer = select("#dock-body")?.querySelectorAll(".msg--rise .msg-body");
  const last = answer?.[answer.length - 1];
  if (!last || typeof speechSynthesis === "undefined") return;
  const copy = last.cloneNode(true);
  copy.querySelectorAll("button, .b-sources, sup, .agent-steps").forEach((node) => node.remove());
  copy.querySelectorAll("p, li, pre, h4, td, th").forEach((node) => node.append(". "));
  const text = copy.textContent.trim().replace(/\s+/g, " ");
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "nl-NL";
  vickiSpeech = utterance;
  utterance.onend = () => {
    if (vickiSpeech !== utterance) return;
    vickiSpeech = null;
    render();
  };
  utterance.onerror = () => {
    if (vickiSpeech !== utterance) return;
    vickiSpeech = null;
    showToast("Voorlezen lukt op dit apparaat niet.");
  };
  speechSynthesis.speak(utterance);
  render();
}

window.addEventListener("pagehide", stopVickiSpeech);

function setDockOpen(open) {
  if (!open) stopVickiSpeech();
  state.dock.open = open;
  state.nextFocus = open ? "dock-input" : "dock-trigger";
  render();
}

function closeSignalDrawer() {
  state.drawer = null;
  state.drawerWork = null;
  state.drawerSection = null;
  state.nextFocus = state.drawerTrigger;
  state.drawerTrigger = null;
  render();
}

function toggleProjectDetail(fragment, selected, id) {
  const current = selected[state.projectId];
  state[fragment] = selected[state.projectId] = current === id ? null : id;
  if (!navigationInPlace) history.replaceState(history.state, "", pageHref(state));
  render();
}

async function copyDraft(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Gekopieerd naar klembord");
  } catch {
    showToast("Selecteer de concepttekst om deze te kopiëren.");
  }
}

document.addEventListener("click", (e) => {
  let n = e.target.closest("sup[data-src]");
  if (n) {
    let i = n.closest(".msg-body")?.querySelectorAll(".b-sources .cite-chip")[
      +n.dataset.src
    ];
    if (i) return i.click();
  }
  let a = e.target.closest("[data-action]");
  if (
    state.pop &&
    !e.target.closest(".pop") &&
    !(a && /^pop-|avatar/.test(a.dataset.action)) &&
    ((state.pop = null), !a)
  )
    return render();
  if (!a) return;
  if (a.matches("a[href]")) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
  }
  let s = a.dataset.action,
    o = a.dataset,
    r = state.convs.find((i) => i.id === state.convId);
  switch (s) {
    case "nav": {
      let i = { view: o.view };
      return (
        o.project &&
          Object.assign(i, { projectId: o.project, section: o.section }),
        o.dossier && (i.dossierKey = o.dossier),
        o.view === "gesprekken" && (i.convId = state.convId),
        o.view !== "project" && (i.projectId = o.project ?? null),
        navigate(i)
      );
    }
    case "mobile-nav":
      state.mobileNav = !state.mobileNav;
      return render();
    case "tab":
      return navigate({ view: o.view, projectId: null });
    case "toggle-project":
      return ((state.expanded[o.id] = !(state.expanded[o.id] ?? ((state.view === "project" || state.view === "doc") && state.projectId === o.id))), render());
    case "toggle-dossier":
      return ((state.dossierOpen = !state.dossierOpen), render());
    case "avatar":
      if (state.pop?.type === "avatar") return closeChoicePopover();
      state.pop = { type: "avatar", triggerId: a.id };
      state.nextFocus = "account-first-option";
      return render();
    case "open-signal":
      state.drawer = o.id;
      state.drawerWork = null;
      state.drawerSection = null;
      state.drawerTrigger = a.id;
      state.nextFocus = "close-signal-drawer";
      return render();
    case "close-drawer":
      return closeSignalDrawer();
    case "drawer-section":
      state.drawerSection = state.drawerSection === o.section ? null : o.section;
      return render();
    case "select-signal":
      return toggleProjectDetail("signalId", state.selSignal, o.id);
    case "sig-filter":
      state.sigFilter[state.projectId] = o.k;
      return render();
    case "signal-step": {
      let i = findSignal(o.id);
      return runSignalStep(i, i.steps[+o.i]);
    }
    case "discuss-signal": {
      let i = findSignal(o.id),
        d = startConversation({
          text: "",
          projects: [i.project],
          origin: { signal: i.id },
        });
      return navigate({ view: "gesprekken", convId: d.id });
    }
    case "milestone-toggle": {
      const index = Number(o.index);
      state.milestoneOpen[o.id] =
        state.milestoneOpen[o.id] === index ? null : index;
      return render();
    }
    case "dossier-requirements":
      state.dossierRequirementsOpen[o.id] =
        !state.dossierRequirementsOpen[o.id];
      return render();
    case "edit-followup":
      state.editFollowup = state.editFollowup === o.id ? null : o.id;
      state.signalFeedback = null;
      return render();
    case "show-signal-feedback":
      state.signalFeedback = state.signalFeedback === o.id ? null : o.id;
      state.editFollowup = null;
      return render();
    case "preset-followup":
      return saveDemoFollowup(o.id);
    case "undo-agenda": {
      const meeting = findMeeting(state.onAgenda[o.id]);
      if (meeting) {
        const agenda = agendaOf(meeting);
        const item = agenda.items.find((entry) => entry.source === o.id);
        agenda.items = agenda.items.filter((entry) => entry !== item);
        agenda.late = agenda.late.filter((id) => id !== item?.id);
      }
      delete state.onAgenda[o.id];
      saveTrackingProgress();
      state.toast = null;
      return render();
    }
    case "signal-verdict":
      state.dismissed[o.id] = o.reason;
      if (state.drawer === o.id) { state.drawer = null; state.drawerWork = null; }
      saveTrackingProgress();
      return showToast(`Afgewezen: ${o.reason.toLowerCase()}. Vicki leert ervan.`, { action: "restore-signal", id: o.id });
    case "triage-start": {
      const ids = sortSignalsByAction(openSignals()).map((signal) => signal.id);
      if (!ids.length) return;
      state.triage = { ids, verdicts: {} };
      state.deskSlide = 0;
      state.dock.tipIndex = 0;
      if (state.view !== "bureau") return navigate({ view: "bureau" });
      render();
      document.querySelector("[data-slider]")?.scrollTo({ left: 0 });
      return document.querySelector(".slider")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }
    case "triage": {
      const t = state.triage;
      if (!t) return;
      const id = t.ids[Math.min(state.deskSlide || 0, t.ids.length - 1)];
      t.verdicts[id] = o.v;
      if (o.v === "ok") delete state.dismissed[id];
      else state.dismissed[id] = o.v;
      saveTrackingProgress();
      render();
      return triageAdvance();
    }
    case "triage-stop":
      state.triage = null;
      state.deskSlide = 0;
      return render();
    case "restore-signal":
      delete state.dismissed[o.id];
      return showToast("Signaal teruggezet");
    case "open-doc":
      return openDocument(o.doc, o.passage || null);
    case "doc-back":
      return navigate(documentBackRoute());
    case "library-reset":
      state.library = defaultLibraryFilters();
      return render();
    case "library-page":
      state.library ??= defaultLibraryFilters();
      state.library.page = Number(o.page);
      state.scrollTop = true;
      return render();
    case "folder":
      return ((state.folder[o.key] = o.f), render());
    case "signal-actions": {
      const signal = findSignal(o.id);
      return navigate({
        view: "project",
        projectId: signal.project,
        section: "acties",
        actionSignal: signal.id,
      });
    }
    case "clear-action-signal":
      state.actionSignal = null;
      state.nextFocus = "action-filter-open";
      return render();
    case "actions-filter":
      state.actionsFilter[o.key] = o.value;
      return render();
    case "action-meeting": {
      const meeting = findMeeting(o.id);
      return navigate({
        view: "project",
        projectId: meeting.project,
        section: "vergaderingen",
        meetingId: meeting.id,
      });
    }
    case "toggle-action": {
      const next = o.status === "Afgerond" ? "Open" : "Afgerond";
      state.actionStatus[o.id] = next;
      const filter =
        state.actionsFilter[actionFilterScope(state.projectId)] ??
        (state.actionSignal ? "all" : "open");
      if (filter !== "all") state.nextFocus = "action-filter-" + filter;
      return showToast(
        next === "Afgerond" ? "Actie afgerond in deze demo" : "Actie heropend",
      );
    }
    case "select-meeting":
      return toggleProjectDetail("meetingId", state.selMeeting, o.id);
    case "open-meeting": {
      const meeting = findMeeting(o.id);
      return navigate({ view: "project", projectId: meeting.project, section: "vergaderingen", meetingId: meeting.id });
    }
    case "close-meeting":
      return navigate({ view: "project", projectId: o.id, section: "vergaderingen" });
    case "meeting-notes": {
      const meeting = findMeeting(o.id);
      const conversation = startConversation({ text: `Wat is er besloten in ${meeting.title} van @${findProject(meeting.project).name.replace(/\s/g, "")}?`, skill: "notulen" });
      return navigate({ view: "gesprekken", convId: conversation.id });
    }
    case "agenda-remove": {
      const agenda = agendaOf(findMeeting(o.id));
      const item = agenda.items.find((entry) => entry.id === o.item);
      agenda.items = agenda.items.filter((entry) => entry !== item);
      if (item?.source) delete state.onAgenda[item.source];
      saveTrackingProgress();
      return showToast(`Weggehaald: ${item?.title ?? "agendapunt"}`);
    }
    case "agenda-suggest": {
      const meeting = findMeeting(o.id);
      const agenda = agendaOf(meeting);
      const signal = findSignal(o.signal);
      if (o.kind === "actie") {
        agenda.actions.push(signal.id);
        saveTrackingProgress();
        return showToast("Op de actielijst gezet");
      }
      if (agenda.stage === "sent") {
        state.agendaLock = { id: meeting.id, title: signal.title, signal: signal.id };
        state.nextFocus = null;
        return render();
      }
      addAgendaItem(meeting, { title: signal.title, note: signalDescription(signal).why, source: signal.id, by: "vicki" });
      state.onAgenda[signal.id] = meeting.id;
      saveTrackingProgress();
      return showToast(`Op de agenda gezet: ${signal.title}`);
    }
    case "agenda-locked":
      state.agendaLock = { id: o.id };
      state.nextFocus = "lock-title-input";
      return render();
    case "agenda-lock-cancel":
      state.agendaLock = null;
      return render();
    case "agenda-lock-choice": {
      const pending = state.agendaLock;
      const meeting = findMeeting(pending.id);
      const agenda = agendaOf(meeting);
      const title = pending.title ?? select("#lock-title-input")?.value.trim();
      if (!title) { select("#lock-title-input")?.focus(); return; }
      const signal = findSignal(pending.signal);
      state.agendaLock = null;
      if (o.choice === "rondvraag") {
        agenda.rondvraag.push(title);
        saveTrackingProgress();
        return showToast("Bewaard voor de rondvraag");
      }
      const entry = addAgendaItem(meeting, { title, note: signal ? signalDescription(signal).why : "", source: signal?.id, by: signal ? "vicki" : "jij" });
      if (signal) state.onAgenda[signal.id] = meeting.id;
      if (o.choice === "reopen") {
        agenda.stage = "concept";
        agenda.resend = true;
        saveTrackingProgress();
        return showToast("Agenda heropend. Maak hem weer definitief en verstuur hem opnieuw.");
      }
      if (entry) { entry.late = true; agenda.late.push(entry.id); }
      state.agendaMail = meeting.id;
      saveTrackingProgress();
      return showToast("Klaargezet als aanvulling. Vicki heeft de mail al geschreven.");
    }
    case "agenda-finalize": {
      const id = o.id;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      state.agendaCheck = { id, step: reduce ? 4 : 0 };
      state.agendaMail = null;
      render();
      const tick = () => {
        if (state.agendaCheck?.id !== id || state.agendaCheck.step >= 4) return;
        state.agendaCheck.step += 1;
        render();
        setTimeout(tick, 560);
      };
      if (!reduce) setTimeout(tick, 560);
      return;
    }
    case "agenda-check-cancel":
      state.agendaCheck = null;
      return render();
    case "agenda-confirm":
      agendaOf(findMeeting(o.id)).stage = "final";
      state.agendaCheck = null;
      saveTrackingProgress();
      return showToast("De agenda is definitief");
    case "agenda-reopen":
      agendaOf(findMeeting(o.id)).stage = "concept";
      state.agendaMail = null;
      saveTrackingProgress();
      return render();
    case "agenda-send": {
      const meeting = findMeeting(o.id);
      Object.assign(agendaOf(meeting), { stage: "sent", sentAt: demoTodayIso, late: [], resend: false });
      state.agendaMail = null;
      saveTrackingProgress();
      return showToast(`Agenda verstuurd naar ${meeting.people.length} deelnemers`);
    }
    case "agenda-send-late": {
      const meeting = findMeeting(o.id);
      agendaOf(meeting).late = [];
      state.agendaMail = null;
      saveTrackingProgress();
      return showToast(`Aanvulling verstuurd naar ${meeting.people.length} deelnemers`);
    }
    case "agenda-mail":
      state.agendaMail = state.agendaMail === o.id ? null : o.id;
      return render();
    case "agenda-pdf":
      return window.print();
    case "adopt-agenda":
      return (
        (state.agendaAdopted[o.id] = !0),
        showToast("Overgenomen als concept-agenda")
      );
    case "meeting-prep": {
      let i = findMeeting(o.id),
        d = startConversation({
          text: `Bereid ${i.title} van @${findProject(i.project).name.replace(/\s/g, "")} voor`,
          skill: "overleg",
        });
      return navigate({ view: "gesprekken", convId: d.id });
    }
    case "plan-approve":
      if (state.planDraft[o.id] !== true) return;
      state.planDraft[o.id] = "approved";
      return showToast("Planningswijziging verwerkt");
    case "plan-reject":
      return (
        (state.planDraft[o.id] = null),
        showToast("Concept afgewezen. De planning blijft zoals hij was.")
      );
    case "chat-skill": {
      const composer = state.comp.chat;
      composer.skill = o.id;
      if (!composer.text.trim()) {
        composer.text = findSkill(o.id).example;
        for (const projectId of projectsFromMentions(composer.text))
          addProjectContext("chat", projectId);
      }
      state.nextFocus = "ta-chat";
      return render();
    }
    case "pop-library":
      return openPopover("library", a, { key: o.key });
    case "choose-library": {
      const { key, triggerId } = state.pop;
      state.pop = null;
      state.nextFocus = triggerId;
      return updateLibraryFilter(key, o.value);
    }
    case "pop-skill":
      return openPopover("skill", a, { comp: o.comp });
    case "pop-projects":
      return openPopover("projects", a, { comp: o.comp });
    case "pop-context":
      return openPopover("context", a, { comp: o.comp });
    case "choose-skill":
      state.comp[state.pop.comp].skill = o.id || null;
      {
        let i = state.pop.comp;
        return ((state.pop = null), render(), select("#ta-" + i)?.focus());
      }
    case "choose-project": {
      let i = state.pop.comp,
        d = state.comp[i];
      if (state.pop.type === "mention") {
        let l = select("#ta-" + i),
          u = l.selectionStart,
          m = d.text
            .slice(0, u)
            .replace(
              /@[\p{L}]*$/u,
              "@" + findProject(o.id).name.replace(/\s/g, "") + " ",
            );
        ((d.text = m + d.text.slice(u)),
          addProjectContext(i, o.id),
          (state.pop = null),
          render());
        let f = select("#ta-" + i);
        (f.focus(), f.setSelectionRange(m.length, m.length));
        return;
      }
      state.nextFocus = "choice-search";
      return (
        d.projects.includes(o.id)
          ? (d.projects = d.projects.filter((l) => l !== o.id))
          : addProjectContext(i, o.id),
        render()
      );
    }
    case "choose-file":
      state.comp[state.pop.comp].files.push(o.name);
      return closeChoicePopover();
    case "chip-x": {
      let i = state.comp[o.comp];
      return (
        o.kind === "project" &&
          (i.projects = i.projects.filter((d) => d !== o.id)),
        o.kind === "skill" && (i.skill = null),
        o.kind === "file" && i.files.splice(+o.id, 1),
        render()
      );
    }
    case "new-conv":
      return (
        (state.convId = null),
        (state.comp.chat = emptyComposer()),
        render(),
        select("#ta-chat")?.focus()
      );
    case "conv-propose": {
      const proposal = convProposals()[+o.i];
      if (!proposal) return;
      const conversation = startConversation(proposal.start);
      return navigate({ view: "gesprekken", convId: conversation.id });
    }
    case "conv-sheet":
      state.convSheet = state.convSheet === false;
      return render();
    case "conv-jump": {
      const target = select(`#thread .msg[data-mi="${o.mi}"]`);
      target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      target?.classList.add("is-flash");
      setTimeout(() => target?.classList.remove("is-flash"), 1200);
      return;
    }
    case "msg-copy": {
      const body = select(`#thread .msg[data-mi="${o.mi}"] .msg-body`);
      const text = [...(body?.querySelectorAll(".b-text, pre, .b-agenda, .b-table") ?? [])].map((node) => node.innerText.trim()).join("\n\n");
      return copyDraft(text);
    }
    case "msg-agenda": {
      const conversation = state.convs.find((item) => item.id === state.convId);
      const projectId = conversation?.projects[0];
      const meeting = projectId && nextProjectMeeting(projectId);
      if (!meeting) return showToast(projectId ? "Er staat geen overleg gepland voor dit project." : "Kies eerst een project voor dit gesprek.");
      const message = conversation.messages[+o.mi];
      const text = stripHtml(message.blocks.find((block) => block.type === "text")?.html ?? "");
      const agenda = agendaOf(meeting);
      const entry = addAgendaItem(meeting, { title: conversation.title, note: text.length > 140 ? text.slice(0, 137).replace(/\s+\S*$/, "") + "…" : text, by: "gesprek" });
      if (entry && agenda.stage === "sent") { entry.late = true; agenda.late.push(entry.id); }
      saveTrackingProgress();
      return showToast(agenda.stage === "sent" ? `De agenda van ${meeting.title} is al verstuurd. Toegevoegd als aanvulling.` : `Op de agenda van ${meeting.title} gezet (${meetingDay(meeting.date, meetingDayShort)})`);
    }
    case "open-conv":
      return ((state.convId = o.id), (state.scrollThread = !0), render());
    case "msg-action": {
      let i =
          state.dock.conv && e.target.closest(".dock") ? state.dock.conv : r,
        d = i.messages[+o.mi].blocks[+o.bi].items[+o.i];
      return i === state.dock.conv && d.intent
        ? (continueDockConversation(),
          runMessageAction(
            d,
            state.convs.find((l) => l.id === state.convId),
          ))
        : runMessageAction(d, i);
    }
    case "need": {
      let i =
          state.dock.conv && e.target.closest(".dock") ? state.dock.conv : r,
        d = i.messages[+o.mi];
      ((d.answered = { ...(d.answered ?? {}), [o.bi]: o.o }),
        i.messages.push({ role: "user", text: o.o }));
      let l = agentFollowups[o.o] ?? {
        blocks: [
          {
            type: "text",
            html: "<p>Duidelijk, daar houd ik rekening mee.</p>",
          },
        ],
      };
      if (l.plan && state.planDraft[l.plan] !== "approved")
        state.planDraft[l.plan] = true;
      const blocks =
        l.plan && state.planDraft[l.plan] === "approved"
          ? [{ type: "text", html: `<p>${deKadeImpactLine()}</p>` }]
          : l.blocks;
      let u = {
        role: "rise",
        blocks,
        reveal: 0,
        total: replyLength(blocks),
      };
      return (
        i.messages.push(u),
        animateReply(u),
        (state.scrollThread = !0),
        render()
      );
    }
    case "followup":
      return e.target.closest(".dock")
        ? sendDockMessage(o.text)
        : r
          ? (sendFollowup(r, o.text), render())
          : void 0;
    case "vicki-speak":
      return speakVickiReply();
    case "vicki-tip-dismiss":
      state.dock.tipDismissed = true;
      state.nextFocus = "dock-trigger";
      return render();
    case "dock-toggle":
      return setDockOpen(!state.dock.open);
    case "dock-open":
      return setDockOpen(true);
    case "dock-close":
      return setDockOpen(false);
    case "dock-suggest":
      return sendDockMessage(o.text);
    case "dock-about-x":
      return ((state.dock.about = null), render());
    case "dock-continue":
      return (continueDockConversation(), render());
    case "ask-about":
      return (
        (state.dock.about = o.label),
        (state.dock.open = !0),
        (state.dock.conv = null),
        render(),
        select("#dock-input")?.focus()
      );
    case "routes":
      return ((state.routes = !state.routes), render());
    case "route": {
      let [, i, d] = demoWalkthroughs[+o.i];
      return ((state.routes = !1), d(), showToast(i));
    }
    case "copy-draft":
      return copyDraft(a.closest(".draft").querySelector("pre").textContent);
    case "toast":
      return showToast(o.text);
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  let n = e.target;
  const { actionSubmit, id } = n.dataset;
  if (actionSubmit === "signal-followup") {
    delete state.actionStatus["followup:" + id];
    state.signalFollowups[id] = Object.fromEntries(new FormData(n));
    state.editFollowup = null;
    state.nextFocus = n.dataset.returnFocus;
    return showToast("Opvolging opgeslagen in deze demo");
  }
  if (actionSubmit === "agenda-add") {
    const title = new FormData(n).get("title")?.trim();
    if (!title) return;
    addAgendaItem(findMeeting(id), { title, by: "jij" });
    state.nextFocus = "agenda-add-" + id;
    n.reset();
    return render();
  }
  if (actionSubmit === "signal-feedback") {
    state.dismissed[id] = new FormData(n).get("reason") || true;
    state.drawer = null;
    state.drawerSection = null;
    state.signalFeedback = null;
    return showToast("Feedback vastgelegd · signaal verborgen", id);
  }
  (n.dataset.actionSubmit === "send" && submitComposer(n.dataset.comp),
    n.dataset.actionSubmit === "dock-send" && sendDockMessage(state.dock.text));
});

document.addEventListener("focusin", ({ target }) => {
  if (target.id !== "ta-home" || state.deskComposerExpanded) return;
  state.deskComposerExpanded = true;
  target.closest(".desk-hero")?.classList.add("desk-hero--expanded");
  saveTrackingProgress();
});

document.addEventListener("input", (e) => {
  let n = e.target;
  if (n.id === "choice-search" && state.pop) {
    state.pop.q = n.value;
    return render();
  }
  if (n.id === "dossier-search") {
    state.dossierQuery[n.dataset.key] = n.value;
    return render();
  }
  if (n.id === "library-search") return updateLibraryFilter("query", n.value);
  if (n.id === "conv-search") return ((state.convSearch = n.value), render());
  if (n.id === "dock-input") {
    state.dock.text = n.value;
    return;
  }
  if (n.dataset.comp && n.tagName === "TEXTAREA") {
    let a = n.dataset.comp;
    state.comp[a].text = n.value;
    let s = n.value.slice(0, n.selectionStart).match(/@([\p{L}]*)$/u);
    s
      ? state.pop?.type === "mention"
        ? ((state.pop.q = s[1]), (state.pop.i = 0), render())
        : openPopover("mention", n, { comp: a, q: s[1], i: 0 })
      : state.pop?.type === "mention" && ((state.pop = null), render());
  }
});

document.addEventListener("keydown", (e) => {
  let n = e.target;
  if (e.key === "Escape" && (state.agendaLock || state.agendaMail)) {
    state.agendaLock = null;
    state.agendaMail = null;
    return render();
  }
  if (n.closest(".choice-pop") && state.pop?.type !== "mention") {
    const options = [...document.querySelectorAll(".choice-options .pop-item")];
    const index = options.indexOf(n);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? Math.min(index + 1, options.length - 1)
          : index - 1;
      (options[next] ?? select("#choice-search"))?.focus();
      return;
    }
    if (e.key === "Enter" && n.id === "choice-search") {
      e.preventDefault();
      (
        options.find((option) => option.matches(".is-on")) ?? options[0]
      )?.click();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      return closeChoicePopover();
    }
  }
  if (state.pop?.type === "mention" && n.tagName === "TEXTAREA") {
    let a = matchingProjects((state.pop.q ?? "").toLowerCase());
    if (e.key === "ArrowDown" || e.key === "ArrowUp")
      return (
        e.preventDefault(),
        (state.pop.i =
          ((state.pop.i ?? 0) + (e.key === "ArrowDown" ? 1 : -1) + a.length) %
          Math.max(1, a.length)),
        render()
      );
    if ((e.key === "Enter" || e.key === "Tab") && a.length)
      return (
        e.preventDefault(),
        document
          .querySelectorAll('.pop [data-action="choose-project"]')
          [state.pop.i ?? 0]?.click()
      );
    if (e.key === "Escape") return ((state.pop = null), render());
  }
  if (n.tagName === "TEXTAREA" && e.key === "Enter" && !e.shiftKey)
    return (e.preventDefault(), submitComposer(n.dataset.comp));
  if (e.key === "Escape") {
    if (state.pop) return closeChoicePopover();
    if (state.dock.open) return setDockOpen(false);
    if (state.drawer) return closeSignalDrawer();
  }
  if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(n.tagName)) {
    e.preventDefault();
    setDockOpen(true);
  }
});

document.addEventListener("change", ({ target }) => {
  if (target.id === "action-origin-filter") {
    state.actionOrigins[target.dataset.key] = target.value;
    return render();
  }
  if (target.id === "dossier-milestone-select") {
    state.dossierMilestone[target.dataset.project] = Number(target.value);
    return render();
  }
  if (target.matches("input[data-setting]")) {
    state.settings[target.dataset.setting] = target.checked;
  }
});

loadPage();
