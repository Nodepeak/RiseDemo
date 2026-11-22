const projectName = (e) => projects.find((n) => n.id === e)?.name ?? e;

function matchIntent({ text = "", skill, projects: projectIds = [], origin }) {
  const query = text.toLowerCase();
  const meetingIntent = {
    dk: "meeting-dk",
    hk: "meeting-hk",
    mw: "meeting-mw",
  }[projectIds[0]] ?? "meeting";

  if (origin?.intent) return origin.intent === "meeting" ? meetingIntent : origin.intent;
  if (projectIds.includes("dk") && /concept.*januari|zonder.*concept/.test(query))
    return "planning-dk-no-overlap";
  if (origin?.signal) return "signal";
  if (skill === "afspraken") return "agreements";
  if (skill === "planning") return "planning";
  if (skill === "overleg") return meetingIntent;
  if (skill === "vergelijk") return projectIds.length > 1 ? "compare" : "compare-docs";
  if (skill === "notulen") return "notes";

  if (/standaard|bedrijfsbeleid|ons model|afwijk.*contract/.test(query)) return "policy";
  if (projectIds.length && /notulen|verslag van|wat.*besloten/.test(query)) return "notes";
  if (/samenvat|vat .*samen/.test(query)) return "summary";
  if (/aandacht|deze week|wat speelt|vandaag/.test(query)) return "attention";
  if (/vergelijk|risico/.test(query) && projectIds.length > 1) return "compare";
  if (/afspra|bewaken/.test(query)) return "agreements";
  if (/overleg|agenda|bouwteam|stuurgroep|ontwerpteam|voorbere/.test(query)) return meetingIntent;
  if (/bodem/.test(query)) return "bodem";
  if (/planning|rapport|akoesti|vertraging|mijlpa|afhank|schuif/.test(query)) return "planning";
  return "fallback";
}

function getDemoReply(e) {
  const projectId = e.projects?.[0];
  const query = e.text ?? "";
  if (e.docId && /herkomst|waar komt .*vandaan/i.test(query)) {
    const { title, author, date } = documents[e.docId];
    return {
      title: "Herkomst van het document",
      blocks: [{ type: "text", html: `<p><strong>${escapeHtml(title)}</strong> is opgesteld door ${escapeHtml(author)}. Het document is gedateerd op ${escapeHtml(date)}.</p>` }],
    };
  }
  if (
    !e.skill && !e.origin && !e.docSummary &&
    !/notulen|verslag/i.test(query) &&
    /openstaand|open.*actie|actie.*open|actiepunten|deadlines/i.test(query)
  ) {
    return actionsDemoReply(e.projects);
  }
  if (
    !e.milestoneName &&
    projectId &&
    / · (Planning|Projectdossier)$/.test(e.pageLabel ?? "") &&
    /mijlpa|stukken.*aanvraag/i.test(e.text ?? "")
  ) {
    const milestones = projectMilestones(projectId);
    const selected = state.dossierMilestone[projectId];
    const milestone =
      (e.pageLabel.endsWith("Projectdossier") ? milestones[selected] : null) ??
      primaryProjectMilestone(projectId, milestones);
    if (milestone) return milestoneDemoReply(milestone, projectId);
  }
  if (e.milestoneName && projectId) {
    const milestone = projectMilestones(projectId).find(
      ({ name }) => name === e.milestoneName,
    );
    if (milestone) return milestoneDemoReply(milestone, projectId);
    const row = schedules[projectId].rows.find(({ name }) => name === e.milestoneName);
    if (row) return scheduledTaskDemoReply(row, projectId);
  }
  let n = matchIntent(e),
    a = e.projects ?? [],
    s = demoReplies[n] ?? demoReplies.fallback;
  if (n === "planning" && projectId && projectId !== "dk") {
    const milestone = primaryProjectMilestone(projectId);
    if (milestone) return milestoneDemoReply(milestone, projectId);
  }
  return { intent: n, ...s(e, a) };
}

const demoReplies = {
  attention: (_request, projectIds) => {
    const ordered = sortSignalsByAction(openSignals());
    const visible = projectIds.length
      ? ordered.filter((signal) => projectIds.includes(signal.project))
      : ordered.slice(0, 3);
    return {
      title: "Welke signalen vragen aandacht?",
      blocks: visible.length ? [
        { type: "text", html: "<p>Hier staan de open signalen op volgorde van het eerstvolgende actiemoment.</p>" },
        { type: "list", items: visible.map((signal, index) => [
          `<strong>${escapeHtml(findProject(signal.project).name)}</strong> · ${escapeHtml(signal.title)}<sup data-src="${index}">${index + 1}</sup><br>${escapeHtml(signalActions[signal.id].action)}`,
          signal.id,
        ]) },
        { type: "sources", items: visible.map((signal) => signal.sources[0]) },
      ] : [{ type: "text", html: "<p>Er zijn geen open signalen binnen deze selectie.</p>" }],
    };
  },
  agreements: (e, n) =>
    (n[0] ?? "hk") !== "hk"
      ? demoReplies.fallback(e, n)
      : {
          title: "Afspraken bewaken bij Havenkwartier",
          blocks: [
            {
              type: "agent",
              agent: "afsprakenagent",
              verb: "Ik laat de afsprakenagent de anterieure overeenkomst naast de recente stukken leggen.",
              steps: [
                "Anterieure overeenkomst gelezen: 14 afspraken",
                "Vergeleken met programma v3, 2 verslagen en 23 mails",
                "Gezocht naar addenda en besluiten",
              ],
              result:
                "1 afwijking, 2 afspraken met een termijn binnen vier maanden",
              need: {
                q: "Is er na de mail van 3 oktober nog iets formeel vastgelegd over het programma?",
                options: ["Nee, niet dat ik weet", "Ja, ik zoek het op"],
              },
            },
            {
              type: "text",
              html: "<p>Dit zijn de afspraken die ik voor je zou bewaken:</p>",
            },
            {
              type: "table",
              head: ["Afspraak", "Status", "Termijn"],
              rows: [
                [
                  'Minimaal 30% sociale huur<sup data-src="0">1</sup>',
                  '<span class="cert cert--vast">Afwijking</span> Programma v3 komt uit op 25%<sup data-src="1">2</sup>',
                  "Vóór 15 jan",
                ],
                [
                  'Programmawijziging via addendum<sup data-src="0">1</sup>',
                  '<span class="cert cert--check">Te controleren</span> Geen addendum gevonden',
                  "Bij wijziging",
                ],
                [
                  "Ontwerp openbare ruimte ter goedkeuring",
                  '<span class="cert cert--vermoed">Op koers</span> Studio Rietveld is gestart',
                  "1 mrt 2027",
                ],
                [
                  "Exploitatiebijdrage 1e termijn (€ 620.000)",
                  "Pas als de omgevingsplanwijziging onherroepelijk is",
                  "Na vaststelling",
                ],
              ],
            },
            {
              type: "text",
              html: '<p>De gemeente schreef op 3 oktober dat ze ruimte ziet om een verschuiving <em>te verkennen</em><sup data-src="2">3</sup>. Dat is nog geen akkoord. Volgens artikel 4.3 is daarvoor een schriftelijk addendum nodig.</p>',
            },
            {
              type: "sources",
              items: [
                ["hk-ao", "p42"],
                ["hk-prog", "p-tab"],
                ["hk-mail-gem", "pm1"],
              ],
            },
            {
              type: "actions",
              items: [
                {
                  label: "Zet op agenda stuurgroep 2 dec",
                  intent: "meeting-hk",
                },
                { label: "Concept-vraag aan Ilse Bakker", intent: "draft-hk" },
              ],
            },
            {
              type: "followups",
              items: [
                "Wijkt deze overeenkomst af van ons standaardmodel?",
                "Wat staat er in de woonvisie over sociale huur?",
              ],
            },
          ],
        },
  compare: (e, n) => {
    let [a, s] = n.length > 1 ? n : ["hk", "dk"];
    return {
      title: `Risico’s ${projectName(a)} en ${projectName(s)}`,
      blocks: [
        {
          type: "agent",
          agent: "planningsagent",
          verb: `Ik controleer met de planningsagent welke mijlpalen bij ${projectName(a)} en ${projectName(s)} geraakt kunnen worden.`,
          steps: [
            "Beide planningen gelezen",
            "Signalen en open acties gekoppeld aan mijlpalen",
          ],
          result: "2 mijlpalen onder druk",
        },
        {
          type: "agent",
          agent: "afsprakenagent",
          verb: "De afsprakenagent kijkt mee naar afspraken met de gemeente.",
          steps: ["2 overeenkomsten vergeleken met recente stukken"],
          result: "1 afwijking (Havenkwartier)",
        },
        {
          type: "table",
          head: ["", projectName(a), projectName(s)],
          rows: [
            [
              "Grootste risico",
              "Programma wijkt af van de afspraak (25% tegen 30%)",
              "Akoestisch rapport 4 weken later",
            ],
            [
              "Mijlpaal",
              "Ontwerpbesluit omgevingsplan, 15 jan",
              "Aanvraag omgevingsvergunning, 22 jan",
            ],
            [
              "Soort risico",
              "Bestuurlijk: vraagt akkoord van de gemeente",
              "Planning: afhankelijk van een adviseur",
            ],
            [
              "Zekerheid",
              '<span class="cert cert--vast">Vastgesteld</span>',
              '<span class="cert cert--vermoed">Vermoeden</span> gevolg nog niet doorgerekend',
            ],
            [
              "Eerste stap",
              "Stuurgroep 2 dec",
              "Concept gevelbelasting vragen",
            ],
          ],
        },
        {
          type: "text",
          html: '<p>Het verschil zit in wie het moet oplossen. Bij De Kade kun je zelf versnellen met het concept van Ruben<sup data-src="0">1</sup>. Bij Havenkwartier ligt de beslissing bij de gemeente<sup data-src="1">2</sup>, en de stuurgroep van 2 december is het enige moment vóór de indiening.</p>',
        },
        {
          type: "sources",
          items: [
            ["dk-mail-ak", "pa1"],
            ["hk-ao", "p42"],
            ["dk-plan", "pp1"],
          ],
        },
        {
          type: "followups",
          items: [
            "Reken de gevolgen voor @DeKade door",
            "Bereid de stuurgroep van @Havenkwartier voor",
          ],
        },
      ],
    };
  },
  planning: () => ({
    title: "Gevolgen akoestisch rapport De Kade",
    blocks: [
      {
        type: "agent",
        agent: "planningsagent",
        verb: "Ik controleer met de planningsagent welke mijlpalen geraakt worden.",
        steps: [
          "Planning v7 gelezen: 7 taken, 4 afhankelijkheden",
          "Nieuwe opleverdatum uit de mail van 19 nov toegepast",
          "Doorgerekend tot start verkoop",
        ],
        result:
          "In het voorstel schuiven twee mijlpalen. De verkoopdatum blijft staan, met minder speling.",
        need: {
          q: "Mag ik een concept-aanpassing van de planning klaarzetten? Er verandert niets zonder jouw akkoord.",
          options: ["Ja, zet concept klaar", "Nog niet"],
        },
      },
      {
        type: "chain",
        items: [
          [
            "Akoestisch rapport",
            formatPlanDate(deKadeReport.end),
            formatPlanDate(deKadeForecast.report),
          ],
          [
            "DO gereed",
            formatPlanDate(deKadeDesign.end),
            formatPlanDate(deKadeForecast.design),
          ],
          [
            "Aanvraag omgevingsvergunning",
            formatPlanDate(deKadePermit.milestone),
            formatPlanDate(deKadeForecast.permit),
          ],
          [
            "Start verkoop",
            formatPlanDate(deKadeSales.milestone),
            formatPlanDate(deKadeSales.milestone),
          ],
        ],
      },
      {
        type: "text",
        html: `<p>Het rapport schuift ${deKadeForecast.reportWeeks} weken. De aanvraag schuift in dit voorstel ${deKadeForecast.permitWeeks} weken. ${deKadeForecast.assumption} Zonder dat vroege concept schuift de aanvraag door naar <strong>${formatPlanDate(deKadeForecast.withoutOverlap)}</strong>.</p><p>Ruben heeft het vroege concept als mogelijkheid genoemd<sup data-src="0">1</sup>. Vraag eerst of het vóór 19 december kan komen en laat Kroon bevestigen wat het ermee kan voorbereiden. Tussen de voorgestelde aanvraag en verkoop blijven ${deKadeForecast.remainingBuffer} dagen over, tegenover ${deKadeForecast.previousBuffer} dagen in de basisplanning.</p>`,
      },
      {
        type: "note",
        html: deKadeImpactLine(),
      },
      {
        type: "sources",
        items: [
          ["dk-mail-ak", "pa1"],
          ["dk-plan", "pp1"],
          ["dk-ot-okt", null],
        ],
      },
      {
        type: "actions",
        items: [
          { label: "Concept-mail aan Ruben Visser", intent: "draft-dk" },
          {
            label: "Open planning De Kade",
            go: { view: "project", projectId: "dk", section: "planning" },
          },
        ],
      },
      {
        type: "followups",
        items: [
          "Zet dit op de agenda van het ontwerpteam",
          "Wat als het concept pas in januari komt?",
        ],
      },
    ],
  }),
  "planning-dk-no-overlap": () => ({
    title: "De Kade zonder vroeg akoestisch concept",
    blocks: [
      {
        type: "text",
        html: `<p>Als Kroon de extra week voorbereiding niet kan doen, is <strong>${formatPlanDate(deKadeForecast.withoutOverlap)}</strong> de rekenuitkomst. Laat Kroon eerst bevestigen welke onderdelen het concept kan vrijgeven. ${deKadeImpactLine()}</p>`,
      },
      {
        type: "sources",
        items: [
          ["dk-mail-ak", "pa1"],
          ["dk-plan", "pp1"],
        ],
      },
      {
        type: "actions",
        items: [{ label: "Concept-mail aan Ruben Visser", intent: "draft-dk" }],
      },
    ],
  }),
  "meeting-dk": () => ({
    title: "Ontwerpteam De Kade",
    blocks: [
      {
        type: "text",
        html: "<p>Bespreek wanneer Ruben een concept kan leveren, wat Kroon daarmee kan voorbereiden en wie het brandweeradvies opvolgt. Het signaal blijft open tot de opvolging is bevestigd.</p>",
      },
      { type: "agenda", meeting: "dk-ot" },
      {
        type: "sources",
        items: [
          ["dk-mail-ak", "pa1"],
          ["dk-ot-okt", null],
        ],
      },
      {
        type: "actions",
        items: [
          {
            label: "Neem over als concept-agenda",
            adoptAgenda: true,
            toast: "Concept-agenda opgeslagen in deze demo",
            go: {
              view: "project",
              projectId: "dk",
              section: "vergaderingen",
              meetingId: "dk-ot",
            },
          },
        ],
      },
    ],
  }),
  bodem: () => ({
    title: "Bodemonderzoek Parkzijde",
    blocks: [
      {
        type: "text",
        html: '<p>Ik vind voor Parkzijde een offerte van Geolab Midden<sup data-src="0">1</sup>, maar <strong>geen opdrachtbevestiging</strong>. Dat wil niet zeggen dat het niet geregeld is. Joost kan het telefonisch of buiten het dossier hebben afgehandeld.</p><p>Het telt wel mee voor de planning. Het onderzoek duurt ongeveer 7 weken. Om de aanvraag van 2 maart te halen, moet de opdracht rond 5 januari de deur uit<sup data-src="1">2</sup>. De offerte is geldig tot 12 december. Beslis dus vóór die datum of Joost de offerte gebruikt of een verlenging vraagt.</p>',
      },
      {
        type: "sources",
        items: [
          ["pz-offerte", "pzo1"],
          ["bd-check-ov", "bdc1"],
          ["pz-bt6", "pzb1"],
        ],
      },
      {
        type: "actions",
        items: [
          { label: "Vraag Joost of het is uitgezet", intent: "draft-pz" },
          { label: "Het is geregeld", intent: "resolved-pz" },
        ],
      },
    ],
  }),
  meeting: () => ({
    title: "Voorbereiding bouwteam #7 Parkzijde",
    blocks: [
      {
        type: "agent",
        agent: "overlegskill",
        verb: "Ik gebruik de overlegskill om een agenda voor te bereiden.",
        steps: [
          "Verslag bouwteam #6 gelezen: 2 besluiten, 3 acties",
          "Open signalen van Parkzijde meegenomen",
          "Planning tot DO gecontroleerd",
        ],
        result: "Concept-agenda met 4 punten",
      },
      { type: "agenda", meeting: "pz-bt7" },
      {
        type: "text",
        html: `<p>Punt 1 staat bovenaan. Het raakt de aanvraag van 2 maart en de offerte loopt op 12 december af<sup data-src="0">1</sup>. Dit sluit aan op de terugkoppeling van Joost uit bouwteam #6<sup data-src="1">2</sup>.</p>`,
      },
      {
        type: "sources",
        items: [
          ["pz-offerte", "pzo1"],
          ["pz-bt6", "pzb1"],
          ["pz-plan", "pzp1"],
        ],
      },
      {
        type: "actions",
        items: [
          {
            label: "Zet agenda in bouwteam #7",
            adoptAgenda: true,
            go: {
              view: "project",
              projectId: "pz",
              section: "vergaderingen",
              meetingId: "pz-bt7",
            },
            toast: "Agenda toegevoegd aan Bouwteam #7 (concept)",
          },
          { label: "Stuur concept naar Joost", intent: "draft-pz" },
        ],
      },
    ],
  }),
  "meeting-hk": () => ({
    title: "Agenda stuurgroep Havenkwartier",
    blocks: [
      {
        type: "agent",
        agent: "overlegskill",
        verb: "Ik gebruik de overlegskill om de stuurgroep van 2 december voor te bereiden.",
        steps: [
          "Vorige stuurgroep en open acties gelezen",
          "Signaal over sociale huur meegenomen",
        ],
        result: "Concept-agenda met 2 punten",
      },
      { type: "agenda", meeting: "hk-sg" },
      {
        type: "text",
        html: '<p>Ik heb het programma als bespreekpunt geagendeerd en niet als mededeling. Een wijziging vraagt een addendum<sup data-src="0">1</sup>, en volgens onze eigen werkwijze meld je een afwijking binnen twee weken bij de directie<sup data-src="1">2</sup>.</p>',
      },
      {
        type: "sources",
        items: [
          ["hk-ao", "p42"],
          ["bd-werkwijze", null],
        ],
      },
      {
        type: "actions",
        items: [
          {
            label: "Zet agenda in stuurgroep 2 dec",
            adoptAgenda: true,
            go: {
              view: "project",
              projectId: "hk",
              section: "vergaderingen",
              meetingId: "hk-sg",
            },
            toast: "Agenda toegevoegd aan stuurgroep (concept)",
          },
        ],
      },
    ],
  }),
  "meeting-mw": () => ({
    title: "Gesprek met de grondeigenaar voorbereiden",
    blocks: [
      { type: "text", html: "<p>De conceptstudie is het uitgangspunt. Bespreek de uitkomst op 4 december en toets daarvoor de gevolgen van de welstandsnota voor ontwerp en kosten.</p>" },
      { type: "agenda", meeting: "mw-ge" },
      { type: "sources", items: [["mw-hov", null], ["mw-haalb", null]] },
      { type: "actions", items: [{
        label: "Neem over als concept-agenda",
        adoptAgenda: true,
        go: { view: "project", projectId: "mw", section: "vergaderingen", meetingId: "mw-ge" },
      }] },
    ],
  }),
  "signal-hk-parking": () => ({
    title: "Parkeerzone Havenkwartier toetsen",
    blocks: [
      { type: "text", html: "<p>De norm voor middenhuur in zone A is 0,6. Laat Studio Rietveld de projectlocatie toetsen aan de zonekaart voordat je de 13 plaatsen uit de parkeerbalans haalt.</p>" },
      { type: "sources", items: [["kd-parkeren", "kdp1"], ["hk-prog", "p-tab"]] },
    ],
  }),
  "signal-mw-welstand": () => ({
    title: "Welstandscriteria voor Molenweide",
    blocks: [
      { type: "text", html: "<p>De studie gebruikt de nieuwe nota nog niet. Toets eerst of de kavel als dorpsrand is aangemerkt. Leg daarna de eisen voor kapvorm en materiaal langs het ontwerp en werk eventuele meerkosten uit.</p>" },
      { type: "sources", items: [["mw-haalb", null], ["kd-welstand", null]] },
    ],
  }),
  "draft-hk": () => ({
    title: "Concept-vraag aan de gemeente",
    blocks: [
      {
        type: "text",
        html: "<p>Hier is een concept. Ik verstuur niets: kopieer het of pas het aan.</p>",
      },
      {
        type: "draft",
        to: "Ilse Bakker (gemeente Schiedam)",
        subject: "Programma Havenkwartier — sociale huur",
        body: `Beste Ilse,

In je mail van 3 oktober schreef je dat er ambtelijk ruimte is om een verschuiving tussen sociale huur en middenhuur te verkennen. Ons programma v3 komt uit op 25% sociale huur.

Klopt het dat hier nog geen bestuurlijk besluit over is? Dan stel ik voor het in de stuurgroep van 2 december te bespreken, met het oog op een addendum vóór het ontwerpbesluit omgevingsplan op 15 januari.

Groet,
Maartje`,
      },
      {
        type: "sources",
        items: [
          ["hk-mail-gem", "pm1"],
          ["hk-ao", "p42"],
        ],
      },
    ],
  }),
  "draft-pz-ao": () => ({
    title: "Concept-mail aan de gemeente Amersfoort",
    blocks: [
      {
        type: "text",
        html: "<p>Hier is een concept om de onderhandeling over de anterieure overeenkomst nu al te starten. Ik verstuur niets: kopieer het of pas het aan.</p>",
      },
      {
        type: "draft",
        to: "Projectleider ruimtelijke ontwikkeling (gemeente Amersfoort)",
        subject: "Parkzijde — start gesprek anterieure overeenkomst",
        body: `Beste projectleider,

Voor Parkzijde vragen we een omgevingsvergunning aan met een buitenplanse omgevingsplanactiviteit. Het voorlopig ontwerp is bijna klaar.

Om geen tijd te verliezen stellen we voor het gesprek over de anterieure overeenkomst (kostenverhaal, openbare ruimte en fasering) nu al te starten, parallel aan het VO. Het programma is daarbij voorlopig tot de VO-raming er ligt.

Past een eerste overleg in de week van 7 december?

Groet,
Maartje`,
      },
      { type: "sources", items: [["pz-plan", "pzp2"], ["bd-werkwijze", "pm-ao"]] },
    ],
  }),
  "vooruitwerken-pz": () => ({
    title: "Tijdwinst anterieure overeenkomst Parkzijde",
    blocks: [
      {
        type: "text",
        html: "<p>Volgens het procesmodel heeft de anterieure overeenkomst het VO en de vastgoedexploitatie nodig, maar mag de onderhandeling al op het concept-VO starten. Met de middenwaarden uit het model:</p>",
      },
      {
        type: "table",
        head: ["Stap", "Volgens planning", "Met vooruitwerken"],
        rows: [
          ["Rest van het VO", "4 weken wachten", "loopt parallel"],
          ["VO-raming", "2,5 weken wachten", "loopt parallel"],
          ["Vastgoedexploitatie VO", "1,5 week wachten", "loopt parallel"],
          ["<b>Start onderhandeling</b>", "<b>half januari</b>", "<b>begin december</b>"],
        ],
      },
      {
        type: "text",
        html: "<p>Dat scheelt <strong>ongeveer 8 weken</strong>. Het risico: toezeggingen over het programma komen terug als het VO nog wijzigt. Spreek daarom af dat het programma voorlopig is tot de VO-raming er ligt.</p>",
      },
      { type: "sources", items: [["bd-werkwijze", "pm-ao"], ["pz-plan", "pzp2"]] },
    ],
  }),
  "draft-dk": () => ({
    title: "Concept-mail aan Akoestiek Zuid",
    blocks: [
      { type: "text", html: "<p>Concept, nog niet verstuurd:</p>" },
      {
        type: "draft",
        to: "Ruben Visser (Akoestiek Zuid)",
        subject: "De Kade — concept gevelbelasting",
        body: `Hoi Ruben,

Dank voor je bericht. Graag maken we gebruik van je aanbod: kun je het concept van de gevelbelasting aan de spoorzijde vóór 19 december delen? Dan kan Kroon de gevel alvast uitwerken.

Groet,
Maartje`,
      },
      { type: "sources", items: [["dk-mail-ak", "pa1"]] },
      {
        type: "actions",
        items: [{ label: "Leg navraag bij Ruben vast", trackSignal: "s-dk" }],
      },
    ],
  }),
  "draft-pz": () => ({
    title: "Vraag aan Joost over bodemonderzoek",
    blocks: [
      {
        type: "text",
        html: "<p>Ik heb het als vraag geformuleerd, niet als verwijt. Het kan al geregeld zijn.</p>",
      },
      {
        type: "draft",
        to: "Joost de Wit (projectmanager)",
        subject: "Parkzijde — bodemonderzoek",
        body: `Hoi Joost,

Ik zie de offerte van Geolab Midden in het dossier, maar nog geen opdracht. Is het bodemonderzoek al uitgezet? Voor de aanvraag van 2 maart moet het rond 5 januari lopen, en de offerte verloopt op 12 december.

Als het al geregeld is, wil je de bevestiging dan in het projectdossier zetten?

Groet,
Maartje`,
      },
      {
        type: "sources",
        items: [
          ["pz-offerte", "pzo1"],
          ["pz-bt6", "pzb1"],
        ],
      },
    ],
  }),
  "resolved-pz": () => ({
    title: "Bodemonderzoek geregeld",
    blocks: [
      {
        type: "text",
        html: "<p>Fijn. Voeg de opdrachtbevestiging toe aan het projectdossier, dan koppel ik die aan het signaal en zet ik het rapport als verwachte taak in de planning (concept).</p>",
      },
      {
        type: "actions",
        items: [
          {
            label: "Bevestiging toevoegen",
            toast: "Bestandskiezer zou nu openen (demo)",
          },
        ],
      },
    ],
  }),
  policy: () => ({
    title: "Overeenkomst tegen ons standaardmodel",
    blocks: [
      {
        type: "agent",
        agent: "vergelijkingsagent",
        verb: "Ik laat de vergelijkingsagent de overeenkomst naast ons standaardmodel uit het bedrijfsdossier leggen.",
        steps: [
          "Standaard anterieure overeenkomst gelezen",
          "14 artikelen vergeleken",
        ],
        result: "1 inhoudelijke afwijking",
      },
      {
        type: "text",
        html: '<p>Eén verschil valt op. Ons model legt programma-afspraken vast als <strong>bandbreedte</strong>, bijvoorbeeld 25 tot 30%<sup data-src="0">1</sup>. In Havenkwartier staat een harde ondergrens van 30%<sup data-src="1">2</sup>. Volgens het model mag dat alleen als de directie dat besluit. Ik vind in het dossier geen besluit van de directie, maar dat kan buiten Rise zijn vastgelegd.</p>',
      },
      {
        type: "sources",
        items: [
          ["bd-ao-std", "bda1"],
          ["hk-ao", "p42"],
        ],
      },
    ],
  }),
  summary: (e) => ({
    title: "Samenvatting",
    blocks: [
      {
        type: "text",
        html: `<p>${e.docSummary ?? "Dit document gaat over de afspraken in het project."}</p>`,
      },
      {
        type: "followups",
        items: [
          "Wijkt dit af van ons standaardmodel?",
          "Welke afspraken moet ik bewaken?",
        ],
      },
    ],
  }),
  notes: ({ text = "" }, [projectId]) => {
    const query = text.toLocaleLowerCase("nl");
    const prior = meetingsForProject(projectId, false);
    const selected = prior.find((meeting) => query.includes(meeting.title.toLocaleLowerCase("nl"))) ??
      (/vorig|laatst|wat.*besloten/.test(query) ? prior[0] : null);
    if (selected) return meetingNotesReply(selected);
    return {
      title: "Notulen uitwerken",
      blocks: [
        {
          type: "agent",
          agent: "notulenskill",
          verb: "Ik gebruik de notulenskill. Voeg je aantekeningen of een opname toe.",
          steps: ["Wacht op aantekeningen"],
          result: "Nog niets ontvangen",
          need: {
            q: "Welke aantekeningen wil je uitwerken?",
            options: ["Bestand toevoegen", "Plak tekst"],
          },
        },
      ],
    };
  },
  "compare-docs": () => ({
    title: "Documenten vergelijken",
    blocks: [
      {
        type: "agent",
        agent: "vergelijkingsagent",
        verb: "Ik laat de vergelijkingsagent programma v2 en v3 naast elkaar leggen.",
        steps: ["Beide versies gelezen", "Per segment vergeleken"],
        result: "2 segmenten gewijzigd",
      },
      {
        type: "table",
        head: ["Segment", "v2", "v3"],
        rows: [
          ["Sociale huur", "64", "<strong>53</strong>"],
          ["Middenhuur", "53", "<strong>64</strong>"],
          ["Koop midden", "51", "51"],
          ["Vrije sector", "44", "44"],
        ],
      },
      { type: "sources", items: [["hk-prog", "p-tab"]] },
    ],
  }),
  signal: (e) => {
    let n = signals.find((s) => s.id === e.origin?.signal);
    if (!n) return demoReplies.fallback(e, e.projects);
    let a = { "s-hk": "agreements", "s-dk": "planning", "s-pz": "bodem" };
    if (a[n.id] && !e.text) {
      let s = demoReplies[a[n.id]](e, [n.project]);
      return {
        title: n.title,
        blocks: [
          {
            type: "text",
            html: `<p>Ik heb het signaal <strong>${n.title}</strong> en de bronnen erbij gepakt. Ik ga eerst na wat er precies is vastgelegd.</p>`,
          },
          ...s.blocks,
        ],
      };
    }
    const proposed = signalActions[n.id];
    return {
      title: n.title,
      blocks: [
        { type: "text", html: `<p>${escapeHtml(n.what)}</p><p>${escapeHtml(n.why)}</p><p><strong>${certaintyLabels[n.level]}.</strong> Voor dit signaal is de urgentie ${signalUrgency(proposed.by).toLowerCase()}. ${escapeHtml(proposed.action)}</p>` },
        { type: "sources", items: n.sources },
        {
          type: "followups",
          items: ["Wat kan ik nu het beste doen?", "Hoe zeker is dit?"],
        },
      ],
    };
  },
  fallback: (e, n) => {
    let a = n.length ? n.map(projectName).join(" en ") : "al je projecten";
    return {
      title: e.text?.slice(0, 48) || "Nieuw gesprek",
      blocks: [
        {
          type: "text",
          html: `<p>Ik heb gezocht in ${a}${e.pageLabel ? `, vanuit <em>${escapeHtml(e.pageLabel)}</em>` : ""}. In deze demo heb ik geen uitgewerkt antwoord op deze vraag. Probeer een van de voorbeelden hieronder, of kies een skill.</p>`,
        },
        {
          type: "followups",
          items: [
            "Wat vraagt deze week mijn aandacht?",
            "Welke afspraken moet ik bewaken bij @Havenkwartier?",
            "Bereid mijn volgende overleg voor @Parkzijde voor",
          ],
        },
      ],
    };
  },
};

const agentFollowups = {
  "Nee, niet dat ik weet": {
    blocks: [
      {
        type: "text",
        html: "<p>Dan ga ik ervan uit dat de 30% nog geldt. Ik zou het als bespreekpunt agenderen voor de stuurgroep van 2 december, met de vraag om een addendum.</p>",
      },
      {
        type: "actions",
        items: [
          { label: "Zet op agenda stuurgroep 2 dec", intent: "meeting-hk" },
        ],
      },
    ],
  },
  "Ja, ik zoek het op": {
    blocks: [
      {
        type: "text",
        html: "<p>Prima. Voeg het besluit of addendum toe aan het projectdossier. Dan toets ik het programma daar opnieuw aan.</p>",
      },
    ],
  },
  "Ja, zet concept klaar": {
    plan: "dk",
    blocks: [
      {
        type: "text",
        html: "<p>Het concept voor drie taken en twee mijlpalen staat bij het akoestieksignaal. Daar kun je het bekijken en goedkeuren.</p>",
      },
      {
        type: "actions",
        items: [
          {
            label: "Bekijk concept bij het signaal",
            go: { view: "project", projectId: "dk", section: "signalen", signalId: "s-dk" },
          },
        ],
      },
    ],
  },
  "Nog niet": {
    blocks: [
      {
        type: "text",
        html: "<p>Goed. Het signaal blijft open en ik kijk opnieuw zodra het concept van Ruben binnen is.</p>",
      },
    ],
  },
};

function scheduledTaskDemoReply(row, projectId) {
  const dates = scheduleDates(row, state.planDraft[projectId] === "approved");
  const after = schedules[projectId].rows.filter(({ dep }) => dep === row.name);
  return {
    title: row.name,
    blocks: [{
      type: "text",
      html: `<p><strong>${escapeHtml(row.name)}</strong> · ${renderScheduleDates(dates)}</p>
        ${row.who ? `<p>Verantwoordelijke: ${escapeHtml(row.who)}</p>` : ""}
        ${row.dep ? `<p>Begint na ${escapeHtml(row.dep)}.</p>` : ""}
        ${after.length ? `<p>Hierop volgt ${after.map(({ name }) => escapeHtml(name)).join(", ")}.</p>` : ""}`,
    }],
  };
}

function milestoneDemoReply(milestone, projectId) {
  const open = milestone.requirements.filter(
    ([, status]) => status !== "Beschikbaar",
  );
  const sources = milestone.requirements.flatMap(([, , , doc, passage]) =>
    doc ? [[doc, passage]] : [],
  );
  return {
    intent: "milestone",
    title: milestone.name,
    blocks: [
      {
        type: "text",
        html: `<p><strong>${escapeHtml(milestone.name)}</strong> staat op ${formatPlanDate(milestone.date)}. ${milestoneDateNote(milestone)}.</p><p>${escapeHtml(milestone.reason)}${milestone.owner ? " Verantwoordelijke: " + escapeHtml(milestone.owner) + "." : ""}</p>`,
      },
      ...(open.length
        ? [
            {
              type: "table",
              head: ["Benodigd", "Status", "Verantwoordelijke"],
              rows: open.map(([name, status, owner]) => [
                escapeHtml(name),
                escapeHtml(status),
                escapeHtml(owner || "Nog niet bekend"),
              ]),
            },
          ]
        : []),
      ...(projectId === "dk" && milestone.forecast
        ? [{ type: "note", html: deKadeImpactLine() }]
        : []),
      ...(sources.length ? [{ type: "sources", items: sources }] : []),
    ],
  };
}
