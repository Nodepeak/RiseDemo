let sessionKey;
let navigationQueued = false;
let navigationInPlace = false;

function saveTrackingProgress() {
  try {
    sessionStorage.setItem(
      sessionKey + ":tracking",
      JSON.stringify({
        planDraft: state.planDraft,
        signalFollowups: state.signalFollowups,
        actionStatus: state.actionStatus,
        agendaAdopted: state.agendaAdopted,
        onAgenda: state.onAgenda,
        agenda: state.agenda,
        dismissed: state.dismissed,
        deskComposerExpanded: state.deskComposerExpanded,
        scenario: state.scenario,
        navAllProjects: state.navAllProjects,
      }),
    );
  } catch {
    // The active document still holds the demo state when storage is unavailable.
  }
}

function loadTrackingProgress(reset = false) {
  try {
    if (reset) sessionStorage.removeItem(sessionKey + ":tracking");
    else
      Object.assign(
        state,
        JSON.parse(sessionStorage.getItem(sessionKey + ":tracking")) ?? {},
      );
  } catch {
    // Keep the currently loaded demo state.
  }
}

function rememberCurrentPage() {
  history.replaceState({ rise: state }, "");
}

function navigateToPage(page) {
  if (page.path === currentPagePath || navigationInPlace) return false;
  if (navigationQueued) return true;

  // A walkthrough can still open a drawer, set focus or add a message in this click.
  navigationQueued = true;
  queueMicrotask(() => {
    const target = findPage(state);
    if (target.path === currentPagePath) {
      navigationQueued = false;
      render();
      return;
    }

    try {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({ path: target.path, state }),
      );
    } catch {
      // A browser can block storage for local files. Keep the session usable in this tab.
      navigationInPlace = true;
      navigationQueued = false;
      document.title = target.title + " · Rise";
      render();
      scrollToPageTarget();
      return;
    }
    location.assign(pageHref(state));
  });
  return true;
}

function readHandoff() {
  try {
    const handoff = JSON.parse(sessionStorage.getItem(sessionKey));
    sessionStorage.removeItem(sessionKey);
    return handoff?.path === currentPagePath ? handoff.state : null;
  } catch {
    return null;
  }
}

function readFragment() {
  try {
    return decodeURIComponent(location.hash.slice(1)) || null;
  } catch {
    return null;
  }
}

function loadPage() {
  const url = new URL(location.href);
  const requested = portableAssets ? url.searchParams.get("pagina") : document.documentElement.dataset.page;
  currentPagePath = demoPages.find(({ path }) => path === requested)?.path ?? "index.html";
  if (portableAssets) {
    url.search = "";
    url.hash = "";
  }
  sessionKey = "rise-demo:" + (portableAssets ? url.href : new URL(localPath("./"), location.href).href);
  const page = demoPages.find(({ path }) => path === currentPagePath);
  const navigationType = performance.getEntriesByType("navigation")[0]?.type;
  const previousState =
    navigationType === "back_forward" ? history.state?.rise : null;

  Object.assign(state, readHandoff() ?? previousState ?? {});
  loadTrackingProgress(navigationType === "reload");
  setPageContext(page);
  setPageFragment(page, readFragment());
  document.title = page.title + " · Rise";
  if (page.view === "gesprekken") state.scrollThread = true;
  render();
  resumeReplies();
  if (state.toast) scheduleToastDismissal();
  scrollToPageTarget();
}

window.addEventListener("pagehide", () => {
  if (!navigationQueued && !navigationInPlace) rememberCurrentPage();
});
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  // A cached page still has the outgoing state in memory.
  navigationQueued = false;
  const previousState = history.state?.rise;
  if (previousState) Object.assign(state, previousState);
  loadTrackingProgress();
  render();
  resumeReplies();
  if (state.toast) scheduleToastDismissal();
  scrollToPageTarget();
});
window.addEventListener("hashchange", () => {
  if (navigationInPlace) return;
  setPageFragment(findPage(state), readFragment());
  render();
  scrollToPageTarget();
});
