const projectSections = {
  signalen: "Signalen",
  acties: "Acties",
  planning: "Planning",
  vergaderingen: "Vergaderingen",
  dossier: "Projectdossier",
};

const projectSlug = ({ name }) => name.toLowerCase().replaceAll(" ", "-");

const demoPages = [
  { path: "index.html", title: "Overzicht", view: "bureau" },
  { path: "projecten/index.html", title: "Projecten", view: "projecten" },
  { path: "acties.html", title: "Acties", view: "acties" },
  { path: "gesprekken.html", title: "Gesprekken", view: "gesprekken" },
  { path: "instellingen.html", title: "Instellingen", view: "instellingen" },
  ...projects.flatMap((project) =>
    Object.entries(projectSections).map(([section, label]) => ({
      path: `projecten/${projectSlug(project)}/${section}.html`,
      title: `${project.name} · ${label}`,
      view: "project",
      projectId: project.id,
      section,
    })),
  ),
  ...Object.entries(dossierGroups).map(([dossierKey, dossier]) => ({
    path: `dossier/${dossierKey}.html`,
    title: dossier.name,
    view: "dossier",
    dossierKey,
  })),
  ...Object.entries(documents).map(([doc, source]) => ({
    path: `documenten/${doc}.html`,
    title: source.title,
    view: "doc",
    doc,
    projectId: source.project ?? null,
    section: "dossier",
    dossierKey: source.dossier ?? "bedrijf",
  })),
];

let currentPagePath = "index.html";
let portableAssets = null;

function findPage(route) {
  return demoPages.find(
    (page) =>
      page.view === route.view &&
      (page.view !== "project" ||
        (page.projectId === route.projectId &&
          page.section === route.section)) &&
      (page.view !== "dossier" || page.dossierKey === route.dossierKey) &&
      (page.view !== "doc" || page.doc === route.doc),
  );
}

function localPath(path) {
  return portableAssets?.[path] ?? "../".repeat(currentPagePath.split("/").length - 1) + path;
}

function pageHref(route) {
  const page = findPage(route);
  const target = route.docPassage || route.meetingId || route.signalId;
  const fragment = target ? `#${encodeURIComponent(target)}` : "";
  return (portableAssets ? "?pagina=" + encodeURIComponent(page.path) : localPath(page.path)) + fragment;
}

function sourceHref(doc, docPassage) {
  return pageHref({ view: "doc", doc, docPassage });
}

function setPageContext(page) {
  const {
    view,
    projectId = null,
    section = "signalen",
    dossierKey = "bedrijf",
    doc = null,
  } = page;
  Object.assign(state, { view, projectId, section, dossierKey, doc });
  if (projectId) state.expanded[projectId] = true;
  if (view === "dossier" || (view === "doc" && !projectId))
    state.dossierOpen = true;
}

function setPageFragment(page, fragment) {
  state.docPassage = page.view === "doc" ? fragment : null;
  state.meetingId = null;
  state.signalId = null;
  if (page.view !== "project") return;
  if (page.section === "vergaderingen") {
    const meeting = findMeeting(fragment);
    state.meetingId = meeting?.project === page.projectId ? fragment : null;
    state.selMeeting[page.projectId] = state.meetingId;
    state.agendaMail = null;
    state.agendaLock = null;
  }
  const signal = page.section === "signalen" && findSignal(fragment);
  if (signal && signal.project === page.projectId) {
    state.signalId = fragment;
    state.selSignal[page.projectId] = fragment;
    const selectedLevel = state.sigFilter[page.projectId];
    if (selectedLevel && selectedLevel !== signal.level) state.sigFilter[page.projectId] = "alle";
  }
}

function documentBackRoute() {
  if (state.docReturn) return state.docReturn;
  if (state.projectId)
    return { view: "project", projectId: state.projectId, section: "dossier" };
  return { view: "dossier", dossierKey: state.dossierKey };
}
