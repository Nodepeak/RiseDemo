const libraryFilters = [
  ["country", "Land", 4],
  ["province", "Provincie", 5],
  ["municipality", "Gemeente", 6],
  ["district", "Wijk", 7],
  ["topic", "Onderwerp", 2],
];
const libraryPageSize = 24;
const defaultLibraryFilters = () => ({ country: "Netherlands", page: 1 });

function updateLibraryFilter(key, value) {
  const filters = (state.library ??= defaultLibraryFilters());
  const locationKeys = ["country", "province", "municipality", "district"];
  const index = locationKeys.indexOf(key);
  if (index >= 0) {
    for (const dependent of locationKeys.slice(index + 1))
      delete filters[dependent];
  }
  if (key === "country") delete filters.topic;
  filters[key] = value;
  filters.page = 1;
  render();
}

function libraryOptions(key, filters) {
  const index = libraryFilters.findIndex(([field]) => field === key);
  const column = libraryFilters[index][2];
  const locationFilters = libraryFilters.slice(0, index);
  const values =
    key === "country"
      ? libraryCatalog.countries
      : [
          ...new Set(
            libraryCatalog.documents
              .filter((row) =>
                locationFilters.every(
                  ([field, , col]) =>
                    !filters[field] || row[col] === filters[field],
                ),
              )
              .map((row) => row[column])
              .filter((value) => value && value.toLowerCase() !== "all"),
          ),
        ].sort((first, second) => first.localeCompare(second, "nl"));
  const options = values.map((value) => ({
    value,
    label: value === "Netherlands" ? "Nederland" : value,
  }));
  return key === "country"
    ? options
    : [{ value: "", label: "Alle" }, ...options];
}

function renderLibrary(demoDossier) {
  const filters = state.library ?? defaultLibraryFilters();
  const countryRows = libraryCatalog.documents.filter(
    (row) => row[4] === filters.country,
  );
  const selectedRows = (rows, fields) =>
    rows.filter((row) =>
      fields.every(
        ([key, , column]) => !filters[key] || row[column] === filters[key],
      ),
    );
  const results = selectedRows(countryRows, libraryFilters.slice(1)).filter(
    (row) => matchesChoice(filters.query, row.slice(1, 9).join(" ")),
  );

  const controls = libraryFilters
    .map(([key, label]) => {
      const options = libraryOptions(key, filters);
      if (key === "district" && (!filters.municipality || options.length <= 1))
        return "";
      const current = options.find(
        ({ value }) => value === (filters[key] ?? ""),
      );
      const open = state.pop?.type === "library" && state.pop.key === key;
      return `<div class="library-filter">
      <span id="library-label-${key}">${label}</span>
      <button class="select-trigger ${open ? "is-open" : ""}" id="library-${key}"
        aria-labelledby="library-label-${key} library-value-${key}" aria-expanded="${open}" aria-controls="choice-popover"
        data-action="pop-library" data-key="${key}">
        <span id="library-value-${key}">${escapeHtml(current?.label ?? "Alle")}</span>${icon("chev")}
      </button></div>`;
    })
    .join("");

  const pageCount = Math.max(1, Math.ceil(results.length / libraryPageSize));
  const page = Math.max(1, Math.min(filters.page, pageCount));
  const rows = results.slice(
    (page - 1) * libraryPageSize,
    page * libraryPageSize,
  );
  const items = rows
    .map(
      ([
        ,
        name,
        topic,
        publisher,
        country,
        province,
        municipality,
        district,
        date,
      ]) => {
        const location = [
          country === "Netherlands" ? "Nederland" : country,
          province,
          municipality,
          district,
        ]
          .filter((part) => part && part.toLowerCase() !== "all")
          .map(escapeHtml)
          .join(" · ");
        return `<li>
      <span class="library-icon">${icon("doc")}</span>
      <div class="library-main"><h2>${escapeHtml(name)}</h2>
      <p>${[publisher, topic, date?.slice(0, 4)].filter(Boolean).map(escapeHtml).join(" · ")}</p></div>
      <span class="library-location">${location}</span>
    </li>`;
      },
    )
    .join("");

  return `<section class="page library">
    <header class="page-head"><div><p class="kicker">Dossier</p><h1>Beleidsdossier</h1>
    <p>Zoek in de lokale documentcatalogus.</p></div></header>
    <div class="library-tools">
      <label for="library-search">Zoek documenten</label>
      <input id="library-search" type="search" placeholder="Zoek op titel, onderwerp of locatie" value="${escapeHtml(filters.query)}">
      <div class="library-filters">${controls}<button class="btn btn--ghost btn--sm" data-action="library-reset">Wis filters</button></div>
    </div>
    <div class="library-count" role="status">${results.length.toLocaleString("nl-NL")} documenten</div>
    ${items ? `<ul class="library-results">${items}</ul>` : '<p class="empty">Geen documenten gevonden.</p>'}
    ${
      pageCount > 1
        ? `<nav class="library-pagination" aria-label="Resultaatpagina’s">
      <button class="btn btn--ghost" data-action="library-page" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>Vorige</button>
      <span>Pagina ${page} van ${pageCount}</span>
      <button class="btn btn--ghost" data-action="library-page" data-page="${page + 1}" ${page === pageCount ? "disabled" : ""}>Volgende</button>
    </nav>`
        : ""
    }
    <details class="library-demo"><summary>Demobronnen gebruikt in Rise-gesprekken</summary>${demoDossier}</details>
  </section>`;
}
