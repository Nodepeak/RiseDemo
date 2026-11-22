/* Zet het thema vóór de eerste paint, zodat er geen lichte flits ontstaat. */
(() => {
  try {
    const choice = localStorage.getItem("rise:thema") || "light";
    const dark = choice === "dark" || (choice === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
