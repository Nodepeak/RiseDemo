const vickiColors = [["oranje", "Oranje"], ["roze", "Roze"], ["paars", "Paars"], ["blauw", "Blauw"], ["groen", "Groen"]];

function renderSettings() {
  function toggle(key, label, description) {
    const checked = state.settings[key] ?? true;
    return `<label class="set-row">
      <span><b>${label}</b><em>${description}</em></span>
      <input type="checkbox" data-setting="${key}" ${checked ? "checked" : ""}>
      <i class="toggle"></i>
    </label>`;
  }

  return `<section class="page page--narrow">
    <header class="page-head"><div><h1>Instellingen</h1></div></header>
    <h3 class="sub">Weergave</h3>
    <div class="theme-picker" role="group" aria-label="Thema">${themeChoices.map(([value, label]) => `<button type="button" class="theme-option" data-action="theme" data-value="${value}" aria-pressed="${themeChoice() === value}"><span class="theme-swatch theme-swatch--${value}"><i></i><i></i></span>${label}</button>`).join("")}</div>
    <h3 class="sub">Kleur van Vicki</h3>
    <div class="vicki-picker" role="group" aria-label="Kleur van Vicki">${vickiColors.map(([value, label]) => `<button type="button" class="vicki-option" data-action="vicki-kleur" data-value="${value}" data-vicki-kleur="${value}" aria-pressed="${(document.documentElement.dataset.vicki || "oranje") === value}"><img src="${localPath("assets/vicki.svg")}" alt="">${label}</button>`).join("")}</div>
    <h3 class="sub">Vooruitzicht</h3>
    ${toggle("milestones", "Alleen signalen die een mijlpaal raken", "Op je overzicht laat Vicki maximaal drie signalen tegelijk.")}
    ${toggle("weekly", "Wekelijkse vooruitblik op maandag", "Een korte samenvatting van wat er die week aankomt.")}
    <h3 class="sub">Vicki en gespecialiseerde agents</h3>
    ${toggle("agents", "Vicki mag zelf agents inzetten", "Je ziet altijd welke agent meewerkt en wat die oplevert.")}
    ${toggle("manual", "Concepten nooit automatisch versturen", "Mails, planningen en agenda’s blijven concept tot jouw akkoord.")}
    <h3 class="sub">Bronnen</h3>
    ${toggle("outlook", "Outlook — mail en agenda", "Gekoppeld · 4 projecten")}
    ${toggle("sharepoint", "SharePoint — projectdossiers", "Gekoppeld")}
  </section>`;
}
