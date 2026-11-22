const emptyComposer = () => ({
  text: "",
  projects: [],
  skill: null,
  files: [],
  dossier: false,
});

const state = {
  view: "bureau",
  projectId: null,
  section: "signalen",
  dossierKey: "bedrijf",
  expanded: {},
  dossierOpen: !1,
  drawer: null,
  drawerWork: null,
  deskSlide: 0,
  triage: null,
  drawerSection: null,
  sigFilter: {},
  selSignal: {},
  selMeeting: {},
  agenda: {},
  agendaCheck: null,
  agendaMail: null,
  agendaLock: null,
  folder: {},
  doc: null,
  docPassage: null,
  docReturn: null,
  convs: structuredClone(initialConversations),
  convId: null,
  convSearch: "",
  convScope: null,
  convMode: "project",
  convFind: false,
  convForget: {},
  comp: { home: emptyComposer(), chat: emptyComposer() },
  dock: { open: !1, conv: null, text: "", about: null, key: "" },
  pop: null,
  toast: null,
  toastUndo: null,
  agendaAdopted: {},
  onAgenda: {},
  planDraft: {},
  dismissed: {},
  signalFollowups: {},
  actionStatus: {},
  actionsFilter: {},
  actionOrigins: {},
  actionSignal: null,
  milestoneOpen: {},
  dossierMilestone: {},
  dossierQuery: {},
  deskComposerExpanded: false,
  dossierRequirementsOpen: {},
  settings: {},
  mobileNav: false,
  nextFocus: null,
  scrollTop: !1,
  scrollThread: !1,
};

function navigate(route) {
  const page = findPage(route);
  if (
    page.path !== currentPagePath &&
    findPage(state).path === currentPagePath
  ) {
    rememberCurrentPage();
  }
  const {
    convId = state.convId,
    docPassage,
    meetingId,
    signalId,
    docReturn = page.view === "doc" ? state.docReturn : null,
  } = route;
  setPageContext(page);
  setPageFragment(page, docPassage || meetingId || signalId || null);
  state.editFollowup = null;
  state.signalFeedback = null;
  Object.assign(state, {
    convId,
    docReturn,
    drawer: route.drawer ?? null,
    drawerSection: route.drawerSection ?? null,
    actionSignal: route.actionSignal ?? null,
    pop: null,
    mobileNav: false,
    dock: { open: false, conv: null, text: "", about: null, key: "" },
    scrollTop: true,
  });
  if (navigationInPlace) {
    document.title = page.title + " · Rise";
    scrollToPageTarget();
  } else if (page.path === currentPagePath) {
    if (readFragment() !== (state.docPassage || state.meetingId || state.signalId)) {
      history.replaceState(null, "", pageHref(state));
    }
    scrollToPageTarget();
  }
  render();
}

function openDocument(doc, docPassage = null) {
  const { view, projectId, section, dossierKey, convId } = state;
  let docReturn = state.docReturn;
  if (state.doc !== doc) {
    docReturn =
      view === "doc"
        ? {
            view,
            doc: state.doc,
            docPassage: state.docPassage,
            docReturn: state.docReturn,
            drawer: state.drawer,
            drawerSection: state.drawerSection,
          }
        : {
            view,
            projectId,
            section,
            dossierKey,
            convId,
            drawer: state.drawer,
            drawerSection: state.drawerSection,
            meetingId: state.meetingId,
            signalId: state.signalId,
            actionSignal: state.actionSignal,
          };
  }
  navigate({ view: "doc", doc, docPassage, docReturn });
}

function scrollToPageTarget() {
  const detail = state.meetingId || state.signalId;
  if (!state.docPassage && !detail) return;
  requestAnimationFrame(() => {
    if (detail) document.getElementById(detail)?.scrollIntoView({ block: "start" });
    else select(".passage.is-focus")?.scrollIntoView({ block: "center" });
  });
}

let toastTimer;

function scheduleToastDismissal() {
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    state.toast = null;
    state.toastUndo = null;
    select(".toast")?.remove();
  }, 2800);
}

function showToast(text, undo = null) {
  state.toast = text;
  state.toastUndo = undo;
  render();
  scheduleToastDismissal();
}

function projectsFromMentions(e) {
  let n = [];
  for (let a of e.matchAll(/@([\p{L}]+)/gu)) {
    let s = projects.find(
      (o) => o.name.replace(/\s/g, "").toLowerCase() === a[1].toLowerCase(),
    );
    s && n.push(s.id);
  }
  return n;
}

function appendReply(e, n) {
  let a = getDemoReply({
      ...n,
      projects: e.projects,
      skill: n.skill ?? e.skill,
    }),
    s = {
      role: "rise",
      blocks: a.blocks,
      reveal: 0,
      total: replyLength(a.blocks),
    };
  return (
    e.messages.push(s),
    (!e.title || e.title === "Nieuw gesprek") && (e.title = a.title),
    animateReply(s),
    a
  );
}

function replyLength(e) {
  return e.reduce(
    (n, a) => n + (a.type === "agent" ? a.steps.length + 2 : 1),
    0,
  );
}

const animatedReplies = new WeakSet();

function animateReply(message) {
  if (!(message.reveal < message.total) || animatedReplies.has(message)) return;
  animatedReplies.add(message);
  function revealNextBlock() {
    message.reveal += 1;
    state.scrollThread = true;
    render();
    if (message.reveal < message.total) {
      setTimeout(revealNextBlock, message.reveal < 2 ? 450 : 380);
    } else {
      animatedReplies.delete(message);
    }
  }
  setTimeout(revealNextBlock, 350);
}

function resumeReplies() {
  const conversations = [...state.convs];
  if (state.dock.conv) conversations.push(state.dock.conv);
  for (const conversation of conversations) {
    conversation.messages.forEach(animateReply);
  }
}

function startConversation({
  text: e,
  projects: n = [],
  skill: a = null,
  origin: s = null,
  pageLabel: o,
  dossier = false,
}) {
  let r = [...new Set([...projectsFromMentions(e || ""), ...n])],
    i = {
      id: "c-" + newId(),
      title: "Nieuw gesprek",
      projects: r,
      skill: a,
      date: demoTodayIso,
      scope: dossier ? "dossier" : undefined,
      origin: s,
      messages: [],
    };
  return (
    i.messages.push({
      role: "user",
      text: e || (s?.signal ? `Bespreek: ${findSignal(s.signal).title}` : ""),
      signal: s?.signal,
      skill: a,
    }),
    state.convs.unshift(i),
    appendReply(i, { text: e, origin: s, pageLabel: o }),
    i
  );
}

function sendFollowup(e, n, a = {}) {
  const signal = e.origin?.signal;
  const sameSignal = signal && /zeker|urgentie|waarom.*signaal|beste doen|oplossen|bron/i.test(n);
  const origin = a.origin ?? (sameSignal ? { signal } : undefined);
  ((e.projects = [
    ...new Set([
      ...e.projects,
      ...projectsFromMentions(n),
      ...(a.projects ?? []),
    ]),
  ]),
    a.skill !== void 0 && (e.skill = a.skill),
    e.messages.push({ role: "user", text: n, skill: a.skill }),
    appendReply(e, { text: n, origin, skill: a.skill }),
    (state.scrollThread = !0));
}

function currentVickiTips(context) {
  const tips = [];
  const add = (text, action, prompt) => prompt && tips.push({ text, action, prompt });
  if (state.drawer) {
    add("Zal ik de urgentie en de eerste stap toelichten?", "Licht dit signaal toe", "Welke actie stel je voor bij dit signaal?");
    add("Ik kan ook uitleggen waarom ik dit signaal laat zien.", "Waarom dit signaal?", "Waarom toont Rise dit signaal?");
    return tips;
  }
  if (state.view === "doc") {
    add("Ik kan de kern van dit document voor je op een rij zetten.", "Vat het document samen", "Vat dit document samen");
    add("Wil je weten waar dit document vandaan komt en wat ervan afhangt?", "Bekijk de herkomst", context.suggestions[1]);
    return tips;
  }
  if (state.view === "project") {
    if (state.section === "signalen" || state.section === "acties") {
      const [signal] = sortSignalsByAction(openSignals()).filter((item) => context.projects.includes(item.project));
      if (signal && state.section === "signalen") add(`Dit vraagt als eerste aandacht: ${signal.title}.`, "Laat zien wat voorrang heeft", context.suggestions[0]);
      add("Ik kan laten zien welke acties nog openstaan en wanneer ze af moeten.", "Bekijk openstaande acties", "Welke acties staan open?");
    }
    if (state.section === "vergaderingen") {
      const next = meetings.filter((meeting) => meeting.project === state.projectId && meeting.date >= demoTodayIso).sort((a, b) => a.date.localeCompare(b.date))[0];
      const nextAgenda = next ? agendaOf(next) : null;
      if (nextAgenda?.stage === "final") add(`De agenda van ${next.title.toLowerCase()} is definitief. Verstuur hem via Rise, of download hem als pdf.`, "Bekijk de agenda", context.suggestions[0]);
      else if (nextAgenda?.stage === "sent") add("De agenda staat vast. Komt er nog iets bij, dan zet ik het klaar als aanvulling.", "Bekijk de agenda", context.suggestions[0]);
      else if (nextAgenda?.stage === "concept") add(`De agenda van ${next.title.toLowerCase()} heb ik alvast opgezet. Vul gerust aan. Maak je hem definitief, dan loop ik alles nog één keer na.`, "Bekijk de agenda", context.suggestions[0]);
      else add("Zal ik een agenda maken voor je volgende overleg?", "Bereid mijn overleg voor", context.suggestions[0]);
    }
    if (state.section === "planning") add("Ik houd de mijlpalen in de gaten. Zal ik laten zien welke onder druk staan?", "Bekijk de planning", context.suggestions[0]);
    if (state.section === "dossier") add("Ik kan nagaan welke stukken nog ontbreken voor de aanvraag.", "Check het dossier", context.suggestions[0]);
    add("Tip: druk op / om me vanaf elke pagina iets te vragen.", "Stel een vraag", context.suggestions.at(-1));
    return tips;
  }
  if (state.view === "acties") {
    add("Ik kan laten zien welke acties nog openstaan en wanneer ze af moeten.", "Bekijk openstaande acties", "Welke acties staan open?");
  }
  if (state.view === "bureau") {
    const [signal] = sortSignalsByAction(openSignals());
    const hello = `${deskGreeting()}, ${profile.first}.`;
    const open = openSignals();
    if (state.triage) add(state.triage.ids.every((id) => state.triage.verdicts[id]) ? "Dank je. Hier leer ik van: wat niet klopte, laat ik voortaan minder snel zien." : "Klopt dit signaal? Kies hieronder, dan pak ik het volgende.", "Doorlopen", context.suggestions[0]);
    else if (open.length > 1) tips.push({ text: `${hello} Ik vond deze week ${open.length} signalen. Zullen we ze even samen doorlopen?`, action: "Loop ze door", prompt: context.suggestions[0], run: "triage-start", ask: true });
    else if (signal) add(`${hello} Ik heb je briefing klaargezet. Eerst dit: ${lowerFirst(signal.title)} bij ${findProject(signal.project).name}.`, "Laat zien wat voorrang heeft", context.suggestions[0]);
    else add(`${hello} Er vraagt vandaag niets om een besluit.`, "Stel een vraag", context.suggestions[0]);
  }
  if (state.view === "bureau" || state.view === "projecten") {
    add("Zal ik de risico’s van Havenkwartier en De Kade naast elkaar zetten?", "Vergelijk de risico’s", context.suggestions[1]);
  }
  if (state.view === "dossier") {
    add("Ik ken deze kaders. Vraag me gerust wat er deze week aandacht vraagt.", "Wat vraagt aandacht?", context.suggestions[0]);
  }
  if (tips.length && state.view !== "gesprekken") add("Tip: druk op / om me vanaf elke pagina iets te vragen.", "Stel een vraag", context.suggestions[0]);
  return tips;
}

function currentVickiTip(context) {
  const tips = currentVickiTips(context);
  return tips[Math.min(state.dock.tipIndex ?? 0, tips.length - 1)] ?? null;
}

function currentDockContext() {
  const signal = findSignal(state.drawer);
  if (signal) return {
    key: signal.id,
    label: signal.title,
    projects: [signal.project],
    origin: { signal: signal.id },
    suggestions: ["Waarom toont Rise dit signaal?", "Wat stelt Rise voor als actie?"],
  };

  if (state.view === "doc") {
    const source = documents[state.doc];
    return {
      key: "doc-" + state.doc,
      label: source.title,
      projects: source.project ? [source.project] : [],
      docId: state.doc,
      docSummary: source.summary,
      suggestions: [
        "Vat dit document samen",
        state.doc === "hk-ao" ? "Wijkt dit af van ons standaardmodel?" : "Waar komt dit document vandaan?",
      ],
    };
  }

  const project = findProject(state.projectId);
  if (state.view === "project") {
    const suggestions = {
      signalen: ["Wat vraagt hier het eerst aandacht?", "Welke acties staan open?"],
      planning: project.id === "dk"
        ? ["Welke taken hangen af van het rapport?", "Wat als het concept pas in januari komt?"]
        : ["Welke mijlpalen staan onder druk?", "Wat moet er vóór de volgende mijlpaal gebeuren?"],
      vergaderingen: ["Bereid het volgende overleg voor", "Welke acties staan open?"],
      acties: ["Welke acties staan open?"],
      dossier: ["Welke stukken mis ik nog voor de aanvraag?", "Wat vraagt hier het eerst aandacht?"],
    };
    return {
      key: `p-${project.id}-${state.section}`,
      label: `${project.name} · ${projectSections[state.section]}`,
      projects: [project.id],
      suggestions: suggestions[state.section],
    };
  }

  if (state.view === "gesprekken") {
    const conversation = state.convs.find(({ id }) => id === state.convId);
    return {
      key: conversation?.id ?? "gesprekken",
      label: conversation?.title ?? "Alle projecten",
      projects: conversation?.projects ?? [],
      suggestions: ["Welke acties staan open?", "Wat vraagt deze week aandacht?"],
    };
  }

  const page = findPage(state);
  return {
    key: page.path,
    label: state.view === "bureau" ? "Alle projecten" : page.title,
    projects: [],
    suggestions: state.view === "acties"
      ? ["Welke acties staan open?"]
      : ["Wat vraagt deze week mijn aandacht?", "Vergelijk de risico’s van @Havenkwartier en @DeKade"],
  };
}
