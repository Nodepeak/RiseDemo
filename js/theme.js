/* Zet het thema en de stijl vóór de eerste paint, zodat er geen flits ontstaat. */
(() => {
  const root = document.documentElement;
  try {
    const choice = localStorage.getItem("rise:thema-v2") || "light";
    const dark = choice === "dark" || (choice === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
  } catch {
    root.dataset.theme = "light";
  }
  /* Stijl: de huisstijl "aurora" is standaard; "huidig" is de vorige look,
     te kiezen via ?stijl=huidig of het Demo-menu. Nieuwe sleutel, zodat een
     eerder bewaarde testkeuze de nieuwe standaard niet overschrijft. */
  try {
    const asked = new URLSearchParams(location.search).get("stijl");
    if (asked === "aurora" || asked === "huidig") localStorage.setItem("rise:stijl-v2", asked);
    root.dataset.stijl = localStorage.getItem("rise:stijl-v2") || "aurora";
  } catch {
    root.dataset.stijl = "aurora";
  }
  /* Kleur van Vicki, te kiezen in Instellingen. */
  try {
    root.dataset.vicki = localStorage.getItem("rise:vicki") || "oranje";
  } catch {
    root.dataset.vicki = "oranje";
  }
})();
