const dayMs = 86400000;
// Dates in the fictional project portfolio are relative to this demo snapshot.
const demoToday = [10, 20, 2026];
const displayPlanDate = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const planDateTime = ([month, day, year]) => Date.UTC(year, month, day);
const formatPlanDate = (date) =>
  displayPlanDate.format(planDateTime(date)).replace(".", "");
const planDateIso = (date) => new Date(planDateTime(date)).toISOString().slice(0, 10);
const demoTodayIso = planDateIso(demoToday);
const formatIsoDate = (value) =>
  displayPlanDate.format(new Date(value + "T00:00:00Z")).replace(".", "");

function renderDueDate(date) {
  return date
    ? `<time datetime="${date}">${formatIsoDate(date)}</time>`
    : '<span class="muted">Geen deadline</span>';
}
function shiftPlanDate(date, days) {
  const shifted = new Date(planDateTime(date) + days * dayMs);
  return [
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    shifted.getUTCFullYear(),
  ];
}
const planDaysBetween = (from, to) =>
  (planDateTime(to) - planDateTime(from)) / dayMs;

function scheduleDates(row, revised = false) {
  return {
    start: (revised && row.ghostStart) || row.start,
    end: (revised && row.ghostEnd) || row.end,
    milestone: (revised && row.ghostMilestone) || row.milestone,
  };
}

function renderScheduleDates({ start, end, milestone }) {
  if (milestone) return renderDueDate(planDateIso(milestone));
  if (start && end) return `${renderDueDate(planDateIso(start))} – ${renderDueDate(planDateIso(end))}`;
  return "Nog niet ingepland";
}

const deKadeRows = schedules.dk.rows;
const deKadeReport = deKadeRows.find((row) => row.signal === "s-dk");
const deKadeDesign = deKadeRows.find(
  (row) => row.name === "Verwerken akoestiek in DO",
);
const deKadeBundle = deKadeRows.find((row) => row.name === "Bundelen aanvraag");
const deKadePermit = deKadeRows.find((row) => row.key);
const deKadeSales = deKadeRows.find((row) => row.name === "Start verkoop");
const deKadeForecast = (() => {
  const report = [0, 8, 2027];
  const lead = 7;
  const design = shiftPlanDate(
    report,
    planDaysBetween(deKadeDesign.start, deKadeDesign.end) - lead,
  );
  const permit = shiftPlanDate(
    design,
    planDaysBetween(deKadeBundle.start, deKadeBundle.end),
  );
  const reportWeeks = planDaysBetween(deKadeReport.end, report) / 7;
  const permitWeeks = planDaysBetween(deKadePermit.milestone, permit) / 7;
  const assumption =
    "Dit scenario veronderstelt dat Kroon één week ontwerpwerk kan voorbereiden met een vroeg concept van de gevelbelasting. De aanvraagbundeling duurt nog steeds twee weken.";
  return {
    report,
    design,
    permit,
    reportWeeks,
    permitWeeks,
    assumption,
    withoutOverlap: shiftPlanDate(permit, lead),
    previousBuffer: planDaysBetween(
      deKadePermit.milestone,
      deKadeSales.milestone,
    ),
    remainingBuffer: planDaysBetween(permit, deKadeSales.milestone),
  };
})();
Object.assign(deKadeReport, { ghostEnd: deKadeForecast.report });
Object.assign(deKadeDesign, {
  ghostStart: deKadeForecast.report,
  ghostEnd: deKadeForecast.design,
});
Object.assign(deKadeBundle, {
  ghostStart: deKadeForecast.design,
  ghostEnd: deKadeForecast.permit,
});
deKadeRows.find((row) => row.name === "DO gereed").ghostMilestone =
  deKadeForecast.design;
deKadePermit.ghostMilestone = deKadeForecast.permit;

const milestoneDefinitions = {
  dk: [
    [
      "DO gereed",
      "Onder druk",
      "De spoorgevel wacht op akoestiek. Het brandweeradvies staat ook open.",
      "Kroon Architecten",
      ["s-dk", "s-dk2"],
      [
        [
          "Definitief akoestisch rapport",
          "Te bevestigen",
          "Ruben Visser",
          "dk-mail-ak",
          "pa1",
        ],
        [
          "Vroeg concept gevelbelasting",
          "Niet gevonden in het dossier",
          "Ruben Visser",
        ],
        [
          "Brandweeradvies blok B",
          "Niet gevonden in het dossier",
          "Kroon Architecten",
        ],
      ],
    ],
    [
      "Aanvraag omgevingsvergunning",
      "Onder druk",
      "Het definitieve ontwerp en de aanvraagbundeling hangen af van het akoestisch rapport.",
      "Maartje Hoekstra",
      ["s-dk", "s-dk2"],
      [
        [
          "Planning v7 en aanvraagafhankelijkheden",
          "Beschikbaar",
          "Stadsas",
          "dk-plan",
          "pp1",
        ],
        [
          "Akoestisch rapport",
          "Te bevestigen",
          "Ruben Visser",
          "dk-mail-ak",
          "pa1",
        ],
        ["Definitieve ontwerpstukken", "Te bevestigen", "Kroon Architecten"],
        [
          "Brandweeradvies blok B",
          "Niet gevonden in het dossier",
          "Kroon Architecten",
        ],
      ],
    ],
    [
      "Start verkoop",
      "Aandacht nodig",
      "De verkoopdatum staat vast in het voorbeeld. Bij het voorstel blijft minder tijd tussen indiening en verkoop over.",
      "Maartje Hoekstra",
      ["s-dk"],
      [
        [
          "Definitieve aanvraagdatum en afstemming verkoop",
          "Te bevestigen",
          "Stadsas",
          "dk-plan",
          "pp1",
        ],
      ],
    ],
  ],
  hk: [
    [
      "Stuurgroep met gemeente",
      "Op koers",
      "Het overleg is ingepland. Het woningprogramma ligt als bespreekpunt voor.",
      "Maartje Hoekstra",
      ["s-hk"],
      [
        [
          "Programma v3 voor bespreking",
          "Concept · wacht op vaststelling",
          "Studio Rietveld",
          "hk-prog",
          "p-tab",
        ],
        [
          "Standpunt gemeente over sociale huur",
          "Te bevestigen",
          "Gemeente Schiedam",
          "hk-mail-gem",
          "pm1",
        ],
      ],
    ],
    [
      "Indiening ontwerp-bestemmingsplan",
      "Onder druk",
      "De afwijking in het woningprogramma kan aanpassing van de stukken vragen.",
      "Maartje Hoekstra",
      ["s-hk", "s-hk2"],
      [
        [
          "Programma v3",
          "Concept · wacht op vaststelling",
          "Studio Rietveld",
          "hk-prog",
          "p-tab",
        ],
        [
          "Anterieure overeenkomst",
          "Beschikbaar",
          "Gemeente Schiedam",
          "hk-ao",
        ],
        [
          "Bestuurlijke bevestiging of addendum",
          "Niet gevonden in het dossier",
          "Gemeente Schiedam",
        ],
        ["Ruimtelijke onderbouwing", "Te bevestigen", "Studio Rietveld"],
      ],
    ],
  ],
  pz: [
    [
      "Bouwteam #7",
      "Op koers",
      "Het overleg staat ingepland. De opdracht voor bodemonderzoek kan daar worden bevestigd.",
      "Joost de Wit",
      ["s-pz"],
      [
        [
          "Actie uit Bouwteam #6",
          "Beschikbaar",
          "Joost de Wit",
          "pz-bt6",
          "pzb1",
        ],
        [
          "Opdrachtbevestiging bodemonderzoek",
          "Niet gevonden in het dossier",
          "Joost de Wit",
        ],
      ],
    ],
    [
      "Aanvraag omgevingsvergunning",
      "Onder druk",
      "De offerte verloopt op 12 december. De opdracht moet uiterlijk rond 5 januari starten.",
      "Joost de Wit",
      ["s-pz"],
      [
        [
          "Offerte bodemonderzoek",
          "Beschikbaar",
          "Geolab Midden",
          "pz-offerte",
          "pzo1",
        ],
        [
          "Opdrachtbevestiging bodemonderzoek",
          "Niet gevonden in het dossier",
          "Joost de Wit",
        ],
        [
          "Rapport bodemonderzoek",
          "Niet gevonden in het dossier",
          "Geolab Midden",
        ],
        ["Definitieve ontwerpstukken", "Te bevestigen", "Atelier Noord"],
      ],
    ],
  ],
  mw: [
    [
      "Gesprek grondeigenaar",
      "Onvoldoende inzicht",
      "De datum staat in de planning. Bevestiging van het gesprek is nog niet gevonden.",
      "",
      [],
      [["Bevestiging gesprek", "Niet gevonden in het dossier", ""]],
    ],
    [
      "Intentieovereenkomst",
      "Aandacht nodig",
      "De financiële haalbaarheid kan wijzigen als de welstandseisen worden verwerkt.",
      "Maartje Hoekstra",
      ["s-mw"],
      [
        [
          "Haalbaarheidsstudie",
          "Concept · wacht op vaststelling",
          "Stadsas",
          "mw-haalb",
        ],
        ["Welstandsnota", "Beschikbaar", "", "kd-welstand"],
        ["Afstemming met grondeigenaar", "Te bevestigen", ""],
      ],
    ],
  ],
};

const signalActions = {
  "s-dk2": {
    owner: "Kroon Architecten",
    by: [10, 27, 2026],
    action: "Vraag Kroon of het brandweeradvies voor blok B al binnen is.",
    impact: 2,
  },
  "s-hk": {
    owner: "Maartje Hoekstra",
    by: [11, 2, 2026],
    action: "Bespreek de afwijking in het woningprogramma met de gemeente in de stuurgroep.",
    impact: 3,
  },
  "s-mw": {
    owner: "Maartje Hoekstra",
    by: [11, 4, 2026],
    action: "Toets de welstandseisen vóór het gesprek met de grondeigenaar.",
    impact: 2,
  },
  "s-pz": {
    owner: "Joost de Wit",
    by: [11, 12, 2026],
    action: "Vraag Joost of het bodemonderzoek is uitgezet en beslis over de offerte van Geolab.",
    impact: 3,
  },
  "s-dk": {
    owner: "Maartje Hoekstra",
    by: [11, 19, 2026],
    action: "Vraag Ruben of hij het concept voor de gevelbelasting uiterlijk 19 december kan delen.",
    impact: 3,
  },
  "s-hk2": {
    owner: "Studio Rietveld",
    by: [0, 15, 2027],
    action: "Laat Studio Rietveld bevestigen welke parkeernorm op deze locatie geldt.",
    impact: 2,
  },
};
const followupStatuses = [
  "Open",
  "In behandeling",
  "Wacht op reactie",
  "Afgerond",
];
const feedbackReasons = ["Klopt niet", "Al geregeld", "Niet van toepassing"];
const signalFollowup = (id) => ({
  owner: signalActions[id]?.owner ?? "",
  deadline: signalActions[id]?.by ? planDateIso(signalActions[id].by) : "",
  check: "",
  note: "",
  ...state.signalFollowups[id],
  status: state.actionStatus["followup:" + id] ?? state.signalFollowups[id]?.status ?? "Open",
});

const openSignals = (items = signals) => items.filter(
  ({ id }) => !state.dismissed[id] && signalFollowup(id).status !== "Afgerond",
);

function signalUrgency(deadline) {
  if (!deadline) return "Onbekend";
  const remaining = planDaysBetween(demoToday, deadline);
  if (remaining <= 14) return "Hoog";
  if (remaining <= 30) return "Midden";
  return "Laag";
}

const sortSignalsByAction = (items) =>
  [...items].sort((a, b) => {
    const first = signalActions[a.id];
    const second = signalActions[b.id];
    const completionOrder =
      Number(signalFollowup(a.id).status === "Afgerond") -
      Number(signalFollowup(b.id).status === "Afgerond");
    return (
      completionOrder ||
      planDateTime(first?.by ?? [0, 1, 2100]) -
        planDateTime(second?.by ?? [0, 1, 2100]) ||
      (second?.impact ?? 0) - (first?.impact ?? 0) ||
      a.id.localeCompare(b.id)
    );
  });

function projectMilestones(projectId) {
  return (milestoneDefinitions[projectId] ?? []).map(
    ([name, status, reason, owner, signalIds, requirements]) => {
      const row = schedules[projectId].rows.find((item) => item.name === name);
      const approved =
        state.planDraft[projectId] === "approved" &&
        Boolean(row.ghostMilestone);
      const forecast = row.ghostMilestone;
      return {
        name,
        status,
        reason,
        owner,
        signalIds,
        requirements,
        forecast,
        approved,
        original: row.milestone,
        date: approved ? forecast : row.milestone,
      };
    },
  );
}

function primaryProjectMilestone(
  projectId,
  milestones = projectMilestones(projectId),
) {
  const primary = schedules[projectId]?.rows.find((row) => row.key);
  return milestones.find((milestone) => milestone.name === primary?.name);
}

function milestoneDateNote(milestone) {
  if (milestone.approved)
    return `Goedgekeurd · was ${formatPlanDate(milestone.original)}`;
  if (milestone.forecast)
    return `Mogelijk naar ${formatPlanDate(milestone.forecast)}`;
  return "Afgesproken";
}

function deKadeImpactLine() {
  const before = formatPlanDate(deKadePermit.milestone);
  const after = formatPlanDate(deKadeForecast.permit);
  return state.planDraft.dk === "approved"
    ? `Goedgekeurd in de demo: de aanvraag staat nu op ${after} (was ${before}). Het rapport en de voorbereiding met het concept moeten nog worden opgevolgd.`
    : `Afgesproken: ${before}. Rise voorziet mogelijk ${after} als Kroon één week ontwerpwerk vooruit kan doen. Zonder die week wordt het ${formatPlanDate(deKadeForecast.withoutOverlap)}.`;
}

const documentTracking = {
  "dk-plan": {
    version: "v7",
    status: "Afgesproken basisplanning",
    older: [
      "v6 · In deze versie waren drie weken gereserveerd voor de aanvraagbundeling. Op 2 oktober is dat in v7 teruggebracht naar twee weken.",
    ],
  },
  "hk-prog": {
    version: "v3",
    status: "Concept · wacht op vaststelling",
    attention: true,
  },
  "mw-haalb": { status: "Concept · wacht op vaststelling", attention: true },
  "pz-offerte": { attention: true },
  "dk-mail-ak": { attention: true },
};
