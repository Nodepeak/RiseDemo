const profile = {
  name: "Maartje Hoekstra",
  first: "Maartje",
  initials: "MH",
  role: "Projectontwikkelaar",
  company: "Stadsas Ontwikkeling",
};

const projects = [
  {
    id: "hk",
    name: "Havenkwartier",
    place: "Schiedam",
    homes: 212,
    phase: "Omgevingsplanwijziging",
    next: "Ontwerpbesluit omgevingsplan",
    nextDate: "15 jan",
    team: "Gemeente Schiedam, Studio Rietveld (stedenbouw)",
  },
  {
    id: "dk",
    name: "De Kade",
    place: "Zaandam",
    homes: 148,
    phase: "Definitief ontwerp",
    next: "Aanvraag omgevingsvergunning",
    nextDate: "22 jan",
    team: "Kroon Architecten, Akoestiek Zuid, Bouwbedrijf Van Dam",
  },
  {
    id: "pz",
    name: "Parkzijde",
    place: "Amersfoort",
    homes: 96,
    phase: "Voorlopig ontwerp",
    next: "Aanvraag omgevingsvergunning",
    nextDate: "2 mrt",
    team: "Bouwteam met Heijmerink Bouw, Atelier Noord",
  },
  {
    id: "mw",
    name: "Molenweide",
    place: "Houten",
    homes: 64,
    phase: "Haalbaarheid",
    next: "Intentieovereenkomst grondeigenaar",
    nextDate: "12 feb",
    team: "Familie Verbeek (grondeigenaar)",
  },
];

const documents = {
  "hk-ao": {
    project: "hk",
    folder: "Contracten & afspraken",
    title: "Anterieure overeenkomst Havenkwartier",
    kind: "Overeenkomst",
    date: "12 jun 2025",
    author: "Gemeente Schiedam / Stadsas",
    summary:
      "Overeenkomst met de gemeente over programma, kostenverhaal, openbare ruimte en planning. 14 afspraken, waarvan 3 met een termijn in de komende vier maanden.",
    body: [
      ["h", "Artikel 3 — Kostenverhaal"],
      [
        "p",
        "3.1 Ontwikkelaar betaalt aan de gemeente een exploitatiebijdrage van € 1.240.000, te voldoen in twee termijnen. De eerste termijn van 50% vervalt op het moment dat de omgevingsplanwijziging onherroepelijk is.",
      ],
      ["h", "Artikel 4 — Woningbouwprogramma"],
      [
        "p",
        "4.1 Het plan voorziet in circa 210 woningen, met een bandbreedte van 5% naar boven of beneden.",
      ],
      [
        "mark",
        "4.2 Ontwikkelaar realiseert binnen het plangebied ten minste 30% van het totaal aantal woningen in de categorie sociale huur, als bedoeld in de Woonvisie 2024 van de gemeente.",
        "p42",
      ],
      [
        "p",
        "4.3 Wijzigingen in het programma worden schriftelijk overeengekomen tussen partijen en vastgelegd in een addendum bij deze overeenkomst.",
      ],
      ["h", "Artikel 6 — Openbare ruimte"],
      [
        "p",
        "6.2 Het ontwerp voor de openbare ruimte wordt uiterlijk 1 maart 2027 ter goedkeuring aan de gemeente voorgelegd.",
      ],
    ],
  },
  "hk-prog": {
    project: "hk",
    folder: "Ontwerp",
    title: "Woningbouwprogramma v3",
    kind: "Programma",
    date: "18 nov 2026",
    author: "Studio Rietveld",
    summary:
      "Derde versie van het programma: 212 woningen, verdeeld over vier segmenten. Sociale huur gaat van 64 naar 53 woningen ten opzichte van v2.",
    body: [
      [
        "p",
        "Ten opzichte van versie 2 is het aandeel middenhuur vergroot om de businesscase sluitend te maken na de gestegen bouwkosten.",
      ],
      [
        "table",
        [
          ["Segment", "Aantal", "Aandeel"],
          ["Sociale huur", "53", "25%"],
          ["Middenhuur", "64", "30%"],
          ["Koop midden", "51", "24%"],
          ["Vrije sector", "44", "21%"],
          ["Totaal", "212", "100%"],
        ],
        "p-tab",
        1,
      ],
      [
        "p",
        "De verdeling is afgestemd met het ontwikkelteam. Afstemming met de gemeente volgt in de stuurgroep van december.",
      ],
    ],
  },
  "hk-mail-gem": {
    project: "hk",
    folder: "Correspondentie",
    title: "Mail gemeente — ruimte in het programma",
    kind: "E-mail",
    date: "3 okt 2026",
    author: "Ilse Bakker, gemeente Schiedam",
    summary:
      "Ambtelijke reactie: er is mogelijk ruimte om het programma te herzien. Geen formeel besluit.",
    body: [
      ["p", "Beste Maartje,"],
      [
        "mark",
        "Ambtelijk zien we ruimte om in de stuurgroep te verkennen of een verschuiving tussen sociale huur en middenhuur bespreekbaar is, gezien de ontwikkelingen in de bouwkosten. Dit vraagt uiteraard bestuurlijke instemming.",
        "pm1",
      ],
      [
        "p",
        "Ik stel voor dit in december te agenderen. Met vriendelijke groet, Ilse Bakker",
      ],
    ],
  },
  "hk-sg-sep": {
    project: "hk",
    folder: "Vergaderingen",
    title: "Verslag stuurgroep 9 september",
    kind: "Verslag",
    date: "10 sep 2026",
    author: "Stadsas",
    summary:
      "Voortgang ruimtelijke onderbouwing, planning omgevingsplanwijziging bevestigd op 15 januari.",
    body: [
      [
        "p",
        "Besluit: het ontwerpbesluit omgevingsplan gaat zoals gepland op 15 januari 2027 ter inzage.",
      ],
      [
        "p",
        "Actie: Stadsas levert programma v3 aan vóór de stuurgroep van december.",
      ],
    ],
  },
  "dk-mail-ak": {
    project: "dk",
    folder: "Correspondentie",
    title: "Mail Akoestiek Zuid — oplevering rapport",
    kind: "E-mail",
    date: "19 nov 2026",
    author: "Ruben Visser, Akoestiek Zuid",
    summary:
      "Adviseur meldt dat het akoestisch rapport vier weken later komt door aanvullende metingen langs het spoor.",
    body: [
      ["p", "Hoi Maartje,"],
      [
        "mark",
        "Door de aanvullende metingen langs de spoorzone wordt het akoestisch rapport naar verwachting op 8 januari opgeleverd, in plaats van 11 december. Een conceptversie van de gevelbelasting kunnen we eventueel eerder delen.",
        "pa1",
      ],
      ["p", "Excuses voor de vertraging. Groet, Ruben"],
    ],
  },
  "dk-plan": {
    project: "dk",
    folder: "Planning",
    title: "Projectplanning De Kade v7",
    kind: "Planning",
    date: "2 okt 2026",
    author: "Stadsas",
    summary:
      "Integrale planning tot start verkoop. Laatst aangepast op 2 oktober.",
    body: [
      [
        "table",
        [
          ["Taak", "Start", "Gereed", "Afhankelijk van"],
          ["Akoestisch onderzoek", "15 okt", "11 dec", "—"],
          [
            "Verwerken akoestiek in DO",
            "11 dec",
            "8 jan",
            "Akoestisch onderzoek",
          ],
          ["Bundelen aanvraag", "8 jan", "22 jan", "DO gereed"],
          [
            "Indiening omgevingsvergunning",
            "22 jan",
            "22 jan",
            "Bundelen aanvraag",
          ],
        ],
        "pp1",
        1,
      ],
    ],
  },
  "dk-ot-okt": {
    project: "dk",
    folder: "Vergaderingen",
    title: "Verslag ontwerpteam 30 oktober",
    kind: "Verslag",
    date: "31 okt 2026",
    author: "Kroon Architecten",
    summary:
      "Gevelopbouw spoorzijde wacht op akoestisch rapport. Brandweeradvies trappenhuis nog open.",
    body: [
      [
        "p",
        "De gevelopbouw aan de spoorzijde wordt definitief gemaakt zodra het akoestisch rapport er is.",
      ],
      ["p", "Actie (Kroon): brandweeradvies trappenhuis blok B opvragen en terugkoppelen in het ontwerpteam van 27 november."],
    ],
  },
  "pz-plan": {
    project: "pz",
    folder: "Planning",
    title: "Planning Parkzijde v4",
    kind: "Planning",
    date: "14 okt 2026",
    author: "Heijmerink Bouw",
    summary:
      "Planning bouwteamfase. Aanvraag omgevingsvergunning op 2 maart 2027.",
    body: [
      [
        "mark",
        "Indiening aanvraag omgevingsvergunning: 2 maart 2027. Benodigd: DO, constructief ontwerp, verkennend bodemonderzoek, stikstofberekening.",
        "pzp1",
      ],
      [
        "mark",
        "Route: omgevingsvergunning met een buitenplanse omgevingsplanactiviteit (BOPA). Onderhandeling anterieure overeenkomst start na de VO-raming en vastgoedexploitatie, half januari.",
        "pzp2",
      ],
      ["p", "Het DO wordt op 15 februari 2027 vastgesteld in het bouwteam."],
    ],
  },
  "pz-bt6": {
    project: "pz",
    folder: "Vergaderingen",
    title: "Verslag bouwteam #6",
    kind: "Verslag",
    date: "29 okt 2026",
    author: "Heijmerink Bouw",
    summary:
      "Besluiten over gevelmateriaal en installatieconcept. Actie: offertes bodemonderzoek opvragen.",
    body: [
      ["p", "Besluit: gevel in handvormsteen, kleur conform monster 3."],
      [
        "p",
        "Besluit: installatieconcept met collectieve bodemwarmtepomp wordt uitgewerkt.",
      ],
      [
        "mark",
        "Actie (Joost de Wit): offertes verkennend bodemonderzoek opvragen bij drie bureaus, terugkoppeling in bouwteam #7.",
        "pzb1",
      ],
      ["p", "Actie (Atelier Noord): gevelmonster 3 uitwerken."],
      ["p", "Actie (Heijmerink Bouw): kostenraming installaties terugkoppelen in bouwteam #7."],
    ],
  },
  "pz-offerte": {
    project: "pz",
    folder: "Onderzoeken",
    title: "Offerte bodemonderzoek — Geolab Midden",
    kind: "Offerte",
    date: "12 nov 2026",
    author: "Geolab Midden",
    summary:
      "Offerte voor verkennend bodemonderzoek NEN 5740. Geen opdrachtbevestiging gevonden.",
    body: [
      [
        "mark",
        "Doorlooptijd: circa 7 weken na opdracht, inclusief laboratoriumanalyses. Geldigheid offerte: 30 dagen.",
        "pzo1",
      ],
      ["p", "Prijs: € 6.850 excl. btw."],
    ],
  },
  "mw-haalb": {
    project: "mw",
    folder: "Onderzoeken",
    title: "Haalbaarheidsstudie Molenweide (concept)",
    kind: "Studie",
    date: "6 nov 2026",
    author: "Stadsas",
    summary:
      "Eerste verkenning van 64 grondgebonden woningen op de kavel van de familie Verbeek.",
    body: [
      [
        "p",
        "Uitgangspunt: 64 grondgebonden woningen, waarvan 30% sociale koop.",
      ],
      ["p", "De welstandsnota 2026 is nog niet in deze studie verwerkt."],
    ],
  },
  "mw-hov": {
    project: "mw",
    folder: "Vergaderingen",
    title: "Verslag haalbaarheidsoverleg 6 november",
    kind: "Verslag",
    date: "6 nov 2026",
    author: "Stadsas",
    summary: "De conceptstudie voor 64 woningen is besproken. Het team neemt de uitgangspunten mee naar het gesprek met de grondeigenaar.",
    body: [
      ["p", "Besproken: de studie verkent 64 grondgebonden woningen, waarvan 30% sociale koop. De welstandsnota 2026 moet nog worden verwerkt."],
      ["p", "Besluit: gebruik de conceptstudie als uitgangspunt voor het gesprek met de grondeigenaar."],
      ["p", "Actie (Maartje Hoekstra): deel de conceptstudie uiterlijk 13 november met het projectteam."],
    ],
  },
  "bd-werkwijze": {
    project: null,
    dossier: "bedrijf",
    folder: "Werkwijzen",
    title: "Procesmodel vastgoedontwikkeling",
    kind: "Procesmodel",
    date: "21 nov 2026",
    author: "Stadsas",
    summary:
      "Ons ontwikkelproces van initiatief tot exploitatie: 7 fasen, 5 besluitmomenten en 109 stappen, met per stap wat hard nodig is, wat al op een concept kan en wat elkaar beïnvloedt. Vicki gebruikt dit om te zien welke verbanden er zijn.",
    body: [
      ["p", "Elke fase eindigt met een besluit (gate) van directie of investeringscommissie. Per stap legt het model vast welke stukken nodig zijn om te starten en welke pas om af te ronden."],
      [
        "table",
        [
          ["Fase", "Besluit aan het eind"],
          ["1 Initiatief", "Initiatiebesluit"],
          ["2 Haalbaarheid", "Haalbaarheidsbesluit"],
          ["3 Planvorming", "Ontwikkelbesluit"],
          ["4 Ontwerp, vergunning & contractering", "Investeringsbesluit (start bouw)"],
          ["5 Realisatie", "–"],
          ["6 Oplevering & nazorg", "Projectafsluiting"],
          ["7 Exploitatie (optioneel)", "–"],
        ],
        "pm-fasen",
      ],
      ["h", "Hard, concept of pas bij afronding"],
      ["p", "Hard betekent: de definitieve versie is nodig om te starten. Concept: een tussenversie volstaat, je kunt vooruitwerken. Afronding: niet nodig om te starten, wel om af te ronden."],
      ["mark", "Aanvraag omgevingsvergunning: het brandveiligheidsadvies is een harde voorwaarde. Vooroverleg met de brandweer kan al op het VO; late brandweereisen dwingen vaak tot herontwerp van trappenhuizen of gevels.", "pm-brand"],
      ["mark", "Definitief ontwerp: vraagt definitieve onderzoeksrapporten (geluid, bodem, ecologie). Ook de aanvraag omgevingsvergunning heeft ze hard nodig. Rapporten verlopen: actualiseer ze vóór indiening als de procedure lang duurt.", "pm-onderzoek"],
      ["mark", "Programma en exploitatie sturen elkaar: de programmamix bepaalt het rendement en andersom. De anterieure overeenkomst legt programma en kostenverhaal vast en is nodig voordat de omgevingsplanwijziging ter inzage gaat.", "pm-programma"],
      ["mark", "Mobiliteits- en parkeerplan: start op het VO, zodat de parkeeroplossing in het DO landt. Risico: de gemeente accepteert een lagere parkeernorm niet.", "pm-parkeren"],
      ["mark", "Gemeentelijke kaders, zoals welstandsnota en woonvisie, zijn harde input voor programma en haalbaarheidsberekening. Die berekening is de basis voor het bod en de intentieovereenkomst met de grondeigenaar.", "pm-kaders"],
      ["h", "Vooruitwerken"],
      ["mark", "Anterieure overeenkomst: de onderhandeling kan parallel aan het VO starten, zonder te wachten op de definitieve VO-raming en exploitatie. Risico: toezeggingen over het programma komen terug als het VO nog wijzigt.", "pm-ao"],
    ],
  },
  "bd-ao-std": {
    project: null,
    dossier: "bedrijf",
    folder: "Standaarddocumenten",
    title: "Standaard anterieure overeenkomst",
    kind: "Model",
    date: "mrt 2025",
    author: "Juridische zaken",
    summary:
      "Ons model voor anterieure overeenkomsten, met toelichting per artikel.",
    body: [
      [
        "mark",
        "Programma-afspraken leggen we vast als bandbreedte (bijvoorbeeld 25–30%), niet als harde ondergrens, tenzij de directie anders besluit.",
        "bda1",
      ],
      ["p", "Wijzigingen altijd via een addendum."],
    ],
  },
  "bd-format-sg": {
    project: null,
    dossier: "bedrijf",
    folder: "Formats",
    title: "Format stuurgroepverslag",
    kind: "Format",
    date: "feb 2026",
    author: "Stadsas",
    summary: "Vaste opbouw voor verslagen van stuurgroepen met overheden.",
    body: [["p", "Opbouw: besluiten, acties, risico’s, volgende stuurgroep."]],
  },
  "bd-check-ov": {
    project: null,
    dossier: "bedrijf",
    folder: "Checklists",
    title: "Checklist aanvraag omgevingsvergunning",
    kind: "Checklist",
    date: "sep 2026",
    author: "Stadsas",
    summary:
      "Welke stukken bij een aanvraag horen en hoe lang ze doorgaans kosten.",
    body: [
      [
        "mark",
        "Verkennend bodemonderzoek (NEN 5740): reken op 6 tot 8 weken vanaf opdracht, inclusief lab. Rapport mag bij indiening niet ouder zijn dan 5 jaar.",
        "bdc1",
      ],
      ["p", "Akoestisch onderzoek wegverkeer en spoor: 8 tot 10 weken."],
    ],
  },
  "kd-woonvisie": {
    project: null,
    dossier: "kaders",
    folder: "Wonen & doelgroepen",
    title: "Woonvisie 2024 — gemeente Schiedam",
    kind: "Beleid",
    date: "2024",
    author: "Gemeente Schiedam",
    summary: "Gemeentelijke kaders voor het woningbouwprogramma.",
    body: [
      [
        "mark",
        "Bij nieuwbouwprojecten van meer dan 50 woningen is minimaal 30% sociale huur het uitgangspunt.",
        "kdw1",
      ],
    ],
  },
  "kd-parkeren": {
    project: null,
    dossier: "kaders",
    folder: "Mobiliteit",
    title: "Parkeernota Schiedam 2026",
    kind: "Beleid",
    date: "okt 2026",
    author: "Gemeente Schiedam",
    summary: "Nieuwe parkeernormen, sinds 1 oktober van kracht.",
    body: [
      [
        "mark",
        "Parkeernorm middenhuur binnen zone A: 0,6 per woning (was 0,8).",
        "kdp1",
      ],
    ],
  },
  "kd-welstand": {
    project: null,
    dossier: "kaders",
    folder: "Ruimtelijke kwaliteit",
    title: "Welstandsnota Houten 2026",
    kind: "Beleid",
    date: "nov 2026",
    author: "Gemeente Houten",
    summary: "Nieuwe welstandscriteria voor dorpsranden.",
    body: [
      [
        "p",
        "Dorpsranden: kapvormen en materialen aansluitend op het bestaande lint.",
      ],
    ],
  },
  "kd-beng": {
    project: null,
    dossier: "kaders",
    folder: "Duurzaamheid",
    title: "BENG en milieuprestatie (Bbl)",
    kind: "Regelgeving",
    date: "2026",
    author: "Rijksoverheid",
    summary: "Landelijke eisen voor energieprestatie en MPG.",
    body: [["p", "MPG-grenswaarde woningen: 0,8."]],
  },
};

const dossierGroups = {
  bedrijf: {
    name: "Bedrijfsdossier",
    intro:
      "Hoe wij werken: werkwijzen, formats, checklists en standaarddocumenten. Vicki gebruikt dit als referentie bij projectvragen.",
  },
  kaders: {
    name: "Beleidsdossier",
    intro:
      "Beleid, normen en uitgangspunten waar onze projecten aan moeten voldoen. Werknaam was “Beleidsdossiers”.",
  },
};

const signals = [
  {
    id: "s-hk",
    project: "hk",
    level: "vast",
    title: "11 sociale huurwoningen onder de afspraak",
    certaintyScope: "Afwijking van de afspraak",
    hook: "11 woningen minder dan afgesproken",
    milestone: "Ontwerpbesluit omgevingsplan",
    what: "Programma v3 bevat 53 sociale huurwoningen. Afgesproken is minimaal 64.",
    why: "Het programma ligt vast in de anterieure overeenkomst. Zonder akkoord van de gemeente op de afwijking kan het ontwerpbesluit omgevingsplan niet ter inzage.",
    claims: [
      ["vast", "Volgens ons procesmodel legt de anterieure overeenkomst het programma vast. Wijkt het programma af, dan moeten de exploitatie en de overeenkomst mee voordat de omgevingsplanwijziging ter inzage gaat.", "bd-werkwijze"],
      ["vast", "De overeenkomst noemt minimaal 30% sociale huur.", "hk-ao"],
      ["vast", "Programma v3 komt uit op 25%.", "hk-prog"],
      [
        "check",
        "Ik vind geen addendum of besluit dat de 30% wijzigt. Er is wel een mail waarin de gemeente ruimte ziet om het te bespreken.",
        "hk-mail-gem",
      ],
      [
        "vermoed",
        "Zonder akkoord kan de gemeente het ontwerpbesluit omgevingsplan aanhouden.",
        null,
      ],
    ],
    consequence: [
      ["Programma v3", "nu"],
      ["Stuurgroep met gemeente", "2 dec"],
      ["Ontwerpbesluit omgevingsplan", "15 jan"],
    ],
    sources: [
      ["bd-werkwijze", "pm-programma"],
      ["hk-ao", "p42"],
      ["hk-prog", "p-tab"],
      ["hk-mail-gem", "pm1"],
      ["kd-woonvisie", "kdw1"],
    ],
    steps: [
      {
        label: "Zoek een gewijzigde afspraak",
        intent: "agreements",
      },
      {
        label: "Maak een agendapunt voor de stuurgroep",
        primary: true,
        intent: "meeting-hk",
      },
      { label: "Schrijf een conceptvraag aan Ilse", intent: "draft-hk" },
    ],
  },
  {
    id: "s-dk",
    project: "dk",
    level: "vermoed",
    title: "Akoestisch rapport schuift vier weken op",
    certaintyScope: "Gevolg voor de vergunningaanvraag",
    hook: "Indiening vergunning schuift mogelijk mee",
    milestone: "Aanvraag omgevingsvergunning",
    what: "De adviseur meldt 8 januari als opleverdatum. De planning rekent met 11 december.",
    why: "Het ontwerp van de spoorgevel wacht op het rapport. De vergunningaanvraag kan daardoor later worden ingediend.",
    claims: [
      ["vast", "Volgens ons procesmodel kan het DO pas af met definitieve onderzoeksrapporten. Een concept is genoeg om te ontwerpen, niet om af te ronden.", "bd-werkwijze"],
      [
        "vast",
        "Het rapport komt op 8 januari (mail van 19 november).",
        "dk-mail-ak",
      ],
      [
        "vast",
        "De planning gaat nog uit van 11 december. De planning is niet aangepast.",
        "dk-plan",
      ],
      [
        "vermoed",
        "De aanvraag kan drie weken opschuiven als Kroon één week ontwerpwerk naar voren kan halen.",
        null,
      ],
      [
        "check",
        "Een concept van de gevelbelasting kan eerder komen. Daarmee kan de architect misschien al verder.",
        "dk-mail-ak",
      ],
    ],
    consequence: [
      ["Akoestisch rapport", "8 jan"],
      ["DO gereed", "29 jan"],
      ["Aanvraag omgevingsvergunning", "12 feb"],
    ],
    sources: [
      ["bd-werkwijze", "pm-onderzoek"],
      ["dk-mail-ak", "pa1"],
      ["dk-plan", "pp1"],
      ["dk-ot-okt", null],
    ],
    steps: [
      {
        label: "Reken de gevolgen voor de planning door",
        intent: "planning",
      },
      {
        label: "Maak een conceptmail aan Ruben",
        primary: true,
        intent: "draft-dk",
      },
      {
        label: "Bekijk in de planning",
        go: { view: "project", projectId: "dk", section: "planning" },
      },
    ],
  },
  {
    id: "s-pz",
    project: "pz",
    level: "check",
    title: "Bodemonderzoek nog niet bevestigd",
    certaintyScope: "Of het onderzoek is uitgezet",
    hook: "Offerte van Geolab Midden verloopt in december",
    milestone: "Aanvraag omgevingsvergunning",
    what: "De offerte verloopt op 12 december. In het dossier staat nog geen opdrachtbevestiging.",
    why: "Het onderzoek duurt circa zeven weken. Om de aanvraag van 2 maart te halen, moet de opdracht rond 5 januari uitstaan.",
    claims: [
      ["vast", "Volgens ons procesmodel heeft de aanvraag omgevingsvergunning definitieve onderzoeksrapporten nodig, dus ook het bodemonderzoek.", "bd-werkwijze"],
      [
        "vast",
        "De aanvraag van 2 maart vraagt een verkennend bodemonderzoek.",
        "pz-plan",
      ],
      [
        "vast",
        "Geolab Midden rekent 7 weken na opdracht. De offerte is geldig tot 12 december.",
        "pz-offerte",
      ],
      [
        "check",
        "Ik vind geen opdrachtbevestiging. Dat betekent niet dat er geen opdracht is: die kan buiten het dossier zijn afgehandeld.",
        null,
      ],
      [
        "vast",
        "Joost de Wit kreeg in bouwteam #6 de actie om offertes op te vragen.",
        "pz-bt6",
      ],
    ],
    consequence: [
      ["Besluit over offerte", "vóór 12 dec"],
      ["Opdracht bodemonderzoek", "rond 5 jan"],
      ["Rapport", "± 23 feb"],
      ["Aanvraag omgevingsvergunning", "2 mrt"],
    ],
    sources: [
      ["bd-werkwijze", "pm-onderzoek"],
      ["pz-plan", "pzp1"],
      ["pz-offerte", "pzo1"],
      ["pz-bt6", "pzb1"],
      ["bd-check-ov", "bdc1"],
    ],
    steps: [
      {
        label: "Maak een conceptmail aan Joost",
        intent: "draft-pz",
        primary: !0,
      },
      {
        label: "Koppel de opdrachtbevestiging",
        intent: "resolved-pz",
      },
      { label: "Bereid bouwteam #7 voor", intent: "meeting" },
    ],
  },
  {
    id: "s-pz2",
    project: "pz",
    level: "vermoed",
    title: "Anterieure overeenkomst kan nu al starten",
    certaintyScope: "Tijdwinst door vooruitwerken",
    hook: "Scheelt ongeveer 8 weken",
    milestone: "Aanvraag omgevingsvergunning",
    what: "De planning start de onderhandeling over de anterieure overeenkomst pas half januari, na de VO-raming en exploitatie.",
    why: "Bij een BOPA wil de gemeente het kostenverhaal geregeld hebben voordat de vergunning wordt verleend. Parallel aan het VO starten scheelt ongeveer 8 weken.",
    claims: [
      ["vast", "Parkzijde volgt de BOPA-route. De onderhandeling staat gepland na de VO-raming, half januari.", "pz-plan"],
      ["vast", "Volgens ons procesmodel kan de onderhandeling al parallel aan het VO starten.", "bd-werkwijze"],
      ["vermoed", "Rekenend met de middenwaarden uit het model (rest VO 4 weken, VO-raming 2,5, exploitatie 1,5) scheelt dat ongeveer 8 weken.", null],
      ["check", "Risico: toezeggingen over het programma komen terug als het VO nog wijzigt. Spreek af dat het programma voorlopig is tot de VO-raming.", null],
    ],
    consequence: [
      ["Startgesprek gemeente", "nu"],
      ["Concept anterieure overeenkomst", "± jan"],
      ["Vergunningverlening zonder wachten op kostenverhaal", "na 2 mrt"],
    ],
    sources: [
      ["pz-plan", "pzp2"],
      ["bd-werkwijze", "pm-ao"],
    ],
    steps: [
      { label: "Maak een conceptmail aan de gemeente", intent: "draft-pz-ao", primary: !0 },
      { label: "Reken de tijdwinst door", intent: "vooruitwerken-pz" },
    ],
  },
  {
    id: "s-hk2",
    project: "hk",
    level: "vermoed",
    title: "Mogelijk zijn minder parkeerplaatsen nodig",
    certaintyScope: "Of parkeerzone A hier geldt",
    hook: "Mogelijk 13 parkeerplaatsen minder nodig",
    milestone: "Ontwerpbesluit omgevingsplan",
    what: "De nieuwe parkeernota verlaagt de norm voor middenhuur in zone A van 0,8 naar 0,6. Het programma rekent nog met de oude norm.",
    why: "Als de locatie in zone A valt, zijn mogelijk 13 parkeerplaatsen minder nodig.",
    claims: [
      ["vast", "Volgens ons procesmodel bepaalt het mobiliteitsplan hoeveel parkeerplaatsen het ontwerp moet bevatten. Een lagere norm vraagt instemming van de gemeente.", "bd-werkwijze"],
      [
        "vast",
        "De parkeernota 2026 hanteert 0,6 voor middenhuur in zone A.",
        "kd-parkeren",
      ],
      [
        "vermoed",
        "Havenkwartier valt in zone A. Het kaartje bij de nota is niet eenduidig.",
        null,
      ],
    ],
    consequence: [
      ["Parkeernota", "1 okt"],
      ["Programma v4", "?"],
      ["Ontwerpbesluit omgevingsplan", "15 jan"],
    ],
    sources: [
      ["bd-werkwijze", "pm-parkeren"],
      ["kd-parkeren", "kdp1"],
      ["hk-prog", "p-tab"],
    ],
    steps: [{ label: "Controleer welke parkeerzone geldt", intent: "signal-hk-parking", primary: !0 }],
  },
  {
    id: "s-dk2",
    project: "dk",
    level: "check",
    title: "Brandweeradvies trappenhuis staat open",
    certaintyScope: "Of het advies al binnen is",
    hook: "Actie uit ontwerpteam nog niet afgerond",
    milestone: "DO gereed",
    what: "Het advies voor het trappenhuis van blok B staat nog niet in het dossier.",
    why: "De plattegrond van blok B kan nog wijzigen vóór het definitief ontwerp.",
    claims: [
      ["vast", "Volgens ons procesmodel is het brandweeradvies een harde voorwaarde voor de aanvraag omgevingsvergunning. Late brandweereisen dwingen vaak tot herontwerp van trappenhuizen.", "bd-werkwijze"],
      ["vast", "De actie staat in het verslag van 30 oktober.", "dk-ot-okt"],
      [
        "check",
        "Het advies is niet in het dossier gevonden. Mogelijk ligt het nog bij de architect.",
        null,
      ],
    ],
    consequence: [
      ["Brandweeradvies", "?"],
      ["DO gereed", "8 jan"],
    ],
    sources: [
      ["bd-werkwijze", "pm-brand"],["dk-ot-okt", null]],
    steps: [
      {
        label: "Maak een agendapunt voor het ontwerpteam",
        intent: "meeting",
        primary: !0,
      },
    ],
  },
  {
    id: "s-mw",
    project: "mw",
    level: "vast",
    title: "Nieuwe welstandsnota niet verwerkt",
    certaintyScope: "Welke nota de studie gebruikt",
    hook: "Haalbaarheidsstudie gaat uit van oude criteria",
    milestone: "Intentieovereenkomst",
    what: "De haalbaarheidsstudie verwerkt de nieuwe eisen voor dorpsranden nog niet.",
    why: "Andere eisen aan kapvorm en materiaal kunnen de bouwkosten en de afgesproken grondprijs beïnvloeden.",
    claims: [
      ["vast", "Volgens ons procesmodel is de welstandsnota harde input voor de haalbaarheidsberekening, en die is de basis voor het bod aan de grondeigenaar.", "bd-werkwijze"],
      [
        "vast",
        "De studie zegt zelf dat de nota nog niet is verwerkt.",
        "mw-haalb",
      ],
      ["vermoed", "De kavel ligt in een dorpsrand.", "kd-welstand"],
    ],
    consequence: [
      ["Welstandsnota", "nov"],
      ["Haalbaarheidsstudie", "27 nov"],
      ["Intentieovereenkomst", "12 feb"],
    ],
    sources: [
      ["bd-werkwijze", "pm-kaders"],
      ["mw-haalb", null],
      ["kd-welstand", null],
    ],
    steps: [{ label: "Toets de studie aan de welstandsnota", intent: "signal-mw-welstand", primary: !0 }],
  },
];

const schedules = {
  dk: {
    version: "Planning v7 · laatst aangepast 2 okt",
    rows: [
      {
        name: "Voorlopig ontwerp",
        who: "Kroon Architecten",
        start: [6, 27, 2026],
        end: [9, 2, 2026],
        done: !0,
      },
      {
        name: "Akoestisch onderzoek",
        who: "Akoestiek Zuid",
        start: [9, 15, 2026],
        end: [11, 11, 2026],
        signal: "s-dk",
      },
      {
        name: "Verwerken akoestiek in DO",
        who: "Kroon Architecten",
        start: [11, 11, 2026],
        end: [0, 8, 2027],
        dep: "Akoestisch onderzoek",
      },
      {
        name: "DO gereed",
        milestone: [0, 8, 2027],
        dep: "Verwerken akoestiek in DO",
      },
      {
        name: "Bundelen aanvraag",
        start: [0, 8, 2027],
        end: [0, 22, 2027],
        dep: "DO gereed",
      },
      {
        name: "Aanvraag omgevingsvergunning",
        milestone: [0, 22, 2027],
        key: !0,
        dep: "Bundelen aanvraag",
      },
      {
        name: "Start verkoop",
        milestone: [2, 15, 2027],
        dep: "Aanvraag omgevingsvergunning",
      },
    ],
  },
  hk: {
    version: "Planning v4 · laatst aangepast 9 sep",
    rows: [
      {
        name: "Programma uitwerken",
        who: "Studio Rietveld",
        start: [8, 15, 2026],
        end: [10, 18, 2026],
        done: !0,
      },
      {
        name: "Ruimtelijke onderbouwing",
        who: "Studio Rietveld",
        start: [9, 22, 2026],
        end: [11, 18, 2026],
      },
      {
        name: "Stuurgroep met gemeente",
        milestone: [11, 2, 2026],
      },
      {
        name: "Ontwerpbesluit omgevingsplan",
        milestone: [0, 15, 2027],
        key: !0,
        dep: "Programma + onderbouwing",
      },
      {
        name: "Ter inzage (6 weken)",
        start: [0, 28, 2027],
        end: [2, 11, 2027],
        dep: "Ontwerpbesluit omgevingsplan",
      },
    ],
  },
  pz: {
    version: "Planning v4 · laatst aangepast 14 okt",
    rows: [
      {
        name: "Voorlopig ontwerp",
        who: "Atelier Noord",
        start: [9, 1, 2026],
        end: [11, 15, 2026],
      },
      { name: "Bouwteam #7", milestone: [10, 25, 2026] },
      {
        name: "Verkennend bodemonderzoek",
        who: "Geolab Midden (offerte, nog geen opdracht)",
        start: [0, 5, 2027],
        end: [1, 23, 2027],
        signal: "s-pz",
      },
      {
        name: "Definitief ontwerp",
        who: "Atelier Noord",
        start: [11, 15, 2026],
        end: [1, 15, 2027],
        dep: "VO, start vooruitlopend op het ontwikkelbesluit",
      },
      {
        name: "Ontwikkelbesluit",
        milestone: [0, 22, 2027],
        dep: "VO-raming en vastgoedexploitatie",
      },
      {
        name: "Anterieure overeenkomst",
        who: "Gemeente Amersfoort",
        start: [0, 15, 2027],
        end: [4, 14, 2027],
        dep: "VO-raming en vastgoedexploitatie",
        signal: "s-pz2",
      },
      {
        name: "Aanvraag omgevingsvergunning",
        milestone: [2, 2, 2027],
        key: !0,
        dep: "DO + bodemonderzoek",
      },
    ],
  },
  mw: {
    version: "Planning v1 · laatst aangepast 6 nov",
    rows: [
      {
        name: "Haalbaarheidsstudie",
        who: "Stadsas",
        start: [9, 1, 2026],
        end: [10, 27, 2026],
      },
      { name: "Gesprek grondeigenaar", milestone: [11, 4, 2026], dep: "Haalbaarheidsstudie" },
      { name: "Intentieovereenkomst", milestone: [1, 12, 2027], key: !0, dep: "Bod grondeigenaar" },
      { name: "Haalbaarheidsbesluit", milestone: [2, 5, 2027], dep: "Intentieovereenkomst en haalbaarheidsrapport" },
    ],
  },
};

const meetings = [
  {
    id: "pz-bt7",
    project: "pz",
    title: "Bouwteam #7",
    date: "2026-11-25",
    time: "10:00",
    place: "Bouwkeet Parkzijde",
    people: [
      "Joost de Wit (projectmanager)",
      "Heijmerink Bouw",
      "Atelier Noord",
      "Maartje Hoekstra",
    ],
    proposal: [
      [
        "Bodemonderzoek: is de opdracht uitgezet?",
        "Nodig voor de aanvraag van 2 maart. Er is een offerte, maar ik vind geen opdracht.",
        "s-pz",
      ],
      [
        "Terugkoppeling offertes bodemonderzoek",
        "Opvolging van Joosts actie uit bouwteam #6.",
        "pz-bt6",
      ],
      [
        "Installatieconcept: bodemwarmtepomp",
        "Besloten in #6, uitwerking van Heijmerink verwacht.",
        "pz-bt6",
      ],
      [
        "Planning naar DO (15 feb)",
        "Nog 12 weken, inclusief de kerstweken.",
        "pz-plan",
      ],
    ],
    actions: [
      ["Joost de Wit", "Offertes bodemonderzoek opvragen", "open", "2026-11-25"],
      ["Atelier Noord", "Gevelmonster 3 uitwerken", "klaar"],
      ["Heijmerink Bouw", "Kostenraming installaties", "open", "2026-11-25"],
    ],
    decisions: [],
  },
  {
    id: "dk-ot",
    project: "dk",
    title: "Ontwerpteam",
    date: "2026-11-27",
    time: "13:30",
    place: "Teams",
    people: ["Kroon Architecten", "Akoestiek Zuid", "Maartje Hoekstra"],
    proposal: [
      [
        "Akoestisch rapport: concept gevelbelasting eerder?",
        "Ruben bood aan een concept eerder te delen.",
        "s-dk",
      ],
      ["Brandweeradvies trappenhuis blok B", "Vervolg op het actiepunt voor Kroon uit het vorige ontwerpteam.", "s-dk2"],
    ],
    actions: [["Kroon", "Brandweeradvies trappenhuis opvragen", "open", "2026-11-27"]],
    decisions: [],
  },
  {
    id: "hk-sg",
    project: "hk",
    title: "Stuurgroep met gemeente",
    date: "2026-12-02",
    time: "14:00",
    place: "Stadskantoor Schiedam",
    people: [
      "Ilse Bakker (gemeente)",
      "Wethouder Wonen",
      "Studio Rietveld",
      "Maartje Hoekstra",
    ],
    proposal: [
      [
        "Programma v3: 25% sociale huur",
        "Afwijking van de afspraak (30%). Vraagt bestuurlijk akkoord en een addendum.",
        "s-hk",
      ],
      [
        "Planning omgevingsplanwijziging",
        "Indiening blijft 15 januari, afhankelijk van het programma.",
        "hk-sg-sep",
      ],
    ],
    actions: [["Stadsas", "Programma v3 aanleveren", "klaar", "2026-12-02"]],
    decisions: [],
  },
  {
    id: "pz-bt6",
    project: "pz",
    title: "Bouwteam #6",
    date: "2026-10-28",
    time: "10:00",
    place: "Bouwkeet Parkzijde",
    people: ["Joost de Wit", "Heijmerink Bouw", "Atelier Noord"],
    decisions: [
      "Gevel in handvormsteen, kleur conform monster 3.",
      "Installatieconcept met collectieve bodemwarmtepomp.",
    ],
    actions: [
      ["Joost de Wit", "Offertes bodemonderzoek opvragen", "open", "2026-11-25"],
      ["Atelier Noord", "Gevelmonster 3 uitwerken", "klaar"],
      ["Heijmerink Bouw", "Kostenraming installaties", "open", "2026-11-25"],
    ],
    doc: "pz-bt6",
  },
  {
    id: "dk-ot-okt",
    project: "dk",
    title: "Ontwerpteam",
    date: "2026-10-30",
    time: "13:30",
    place: "Teams",
    people: ["Kroon Architecten", "Akoestiek Zuid"],
    decisions: ["Gevel spoorzijde volgt na akoestisch rapport."],
    actions: [["Kroon", "Brandweeradvies trappenhuis opvragen", "open", "2026-11-27"]],
    doc: "dk-ot-okt",
  },
  {
    id: "hk-sg-sep",
    project: "hk",
    title: "Stuurgroep met gemeente",
    date: "2026-09-09",
    time: "14:00",
    place: "Stadskantoor",
    people: ["Ilse Bakker", "Studio Rietveld"],
    decisions: ["Ontwerpbesluit omgevingsplan blijft 15 januari."],
    actions: [["Stadsas", "Programma v3 aanleveren", "klaar", "2026-12-02"]],
    doc: "hk-sg-sep",
  },
  {
    id: "mw-hov",
    project: "mw",
    title: "Haalbaarheidsoverleg",
    date: "2026-11-06",
    time: "10:00",
    place: "Stadsas",
    people: ["Projectteam Molenweide", "Maartje Hoekstra"],
    decisions: ["Gebruik de conceptstudie als uitgangspunt voor het gesprek met de grondeigenaar."],
    actions: [
      ["Maartje Hoekstra", "Conceptstudie delen met het projectteam", "klaar", "2026-11-13"],
    ],
    doc: "mw-hov",
  },
  {
    id: "mw-ge",
    project: "mw",
    title: "Gesprek grondeigenaar",
    date: "2026-12-04",
    time: "16:00",
    place: "Boerderij Verbeek",
    people: ["Familie Verbeek", "Maartje Hoekstra"],
    proposal: [
      [
        "Uitkomst haalbaarheidsstudie",
        "Concept van 6 nov; welstandsnota nog niet verwerkt.",
        "s-mw",
      ],
    ],
    actions: [
      [
        "Maartje Hoekstra",
        "Toets de welstandseisen voor de haalbaarheidsstudie",
        "open",
        "2026-12-04",
      ],
    ],
    decisions: [],
  },
];

const skills = [
  {
    id: "afspraken",
    name: "Afspraken toetsen",
    desc: "Toetst stukken aan gemaakte afspraken en overeenkomsten",
    agent: "afsprakenagent",
    example: "Toets programma v3 van @Havenkwartier aan de anterieure overeenkomst.",
  },
  {
    id: "vergelijk",
    name: "Documenten vergelijken",
    desc: "Zet versies of documenten naast elkaar",
    agent: "vergelijkingsagent",
    example: "Vergelijk versie 2 en versie 3 van het woningprogramma bij @Havenkwartier.",
  },
  {
    id: "planning",
    name: "Planning en afhankelijkheden",
    desc: "Rekent door welke mijlpalen geraakt worden",
    agent: "planningsagent",
    example: "Reken door hoe het latere akoestische rapport de planning van @DeKade raakt.",
  },
  {
    id: "overleg",
    name: "Overleg voorbereiden",
    desc: "Agenda op basis van afspraken, acties en signalen",
    agent: "overlegskill",
    example: "Maak een agenda voor Bouwteam #7 van @Parkzijde.",
  },
  {
    id: "notulen",
    name: "Notulen en actiepunten",
    desc: "Maakt een verslag met besluiten en acties",
    agent: "notulenskill",
    example: "Werk Bouwteam #6 van @Parkzijde uit als verslag met besluiten en actiepunten.",
  },
];

const initialConversations = [
  {
    id: "c-1",
    title: "Parkeernorm Havenkwartier na nieuwe nota",
    projects: ["hk"],
    when: "Gisteren",
    group: "Deze week",
    skill: null,
    messages: [
      {
        role: "user",
        text: "Wat betekent de nieuwe parkeernota voor @Havenkwartier?",
      },
      {
        role: "rise",
        blocks: [
          {
            type: "text",
            html: '<p>De parkeernota 2026 verlaagt de norm voor middenhuur in zone A van 0,8 naar 0,6 per woning<sup data-src="0">1</sup>. Met 64 middenhuurwoningen zijn dat er ongeveer 13 minder.</p><p>Of Havenkwartier in zone A valt, kan ik op het kaartje bij de nota niet met zekerheid zeggen. Dat moet je nog controleren.</p>',
          },
          {
            type: "sources",
            items: [
              ["kd-parkeren", "kdp1"],
              ["hk-prog", "p-tab"],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-2",
    title: "Verslag ontwerpteam De Kade uitgewerkt",
    projects: ["dk"],
    when: "Di 18 nov",
    group: "Deze week",
    skill: "notulen",
    messages: [
      {
        role: "user",
        text: "Werk mijn aantekeningen van het ontwerpteam uit tot een verslag.",
      },
      {
        role: "rise",
        blocks: [
          {
            type: "agent",
            agent: "notulenskill",
            verb: "Ik gebruik de notulenskill om je aantekeningen te ordenen.",
            steps: [
              "Aantekeningen gelezen",
              "2 besluiten en 1 actie herkend",
              "Verslag opgesteld volgens format",
            ],
            result: "Concept-verslag met 2 besluiten en 1 actiepunt.",
          },
          {
            type: "text",
            html: "<p>Het concept staat klaar. Eén actie heeft nog geen eigenaar: <strong>brandweeradvies trappenhuis blok B</strong>. Ik heb Kroon Architecten voorgesteld.</p>",
          },
          {
            type: "sources",
            items: [
              ["dk-ot-okt", null],
              ["bd-format-sg", null],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-3",
    title: "Welke stukken mis ik nog voor de aanvraag?",
    projects: ["pz"],
    when: "Do 13 nov",
    group: "Eerder",
    skill: null,
    messages: [
      {
        role: "user",
        text: "Welke stukken mis ik nog voor de aanvraag van @Parkzijde?",
      },
      {
        role: "rise",
        blocks: [
          {
            type: "text",
            html: '<p>Ik heb de checklist uit het bedrijfsdossier<sup data-src="0">1</sup> naast het projectdossier gelegd. Ik vond nog niet: het verkennend bodemonderzoek en de stikstofberekening. Het constructief ontwerp volgt met het DO.</p>',
          },
          {
            type: "sources",
            items: [
              ["bd-check-ov", "bdc1"],
              ["pz-plan", "pzp1"],
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c-4",
    title: "Grondprijs Molenweide tegen referenties",
    projects: ["mw"],
    when: "Ma 3 nov",
    group: "Eerder",
    skill: "vergelijk",
    messages: [
      {
        role: "user",
        text: "Vergelijk de grondprijs van @Molenweide met onze referentieprojecten.",
      },
      {
        role: "rise",
        blocks: [
          {
            type: "text",
            html: "<p>De gevraagde grondprijs ligt ongeveer 12% boven het gemiddelde van drie vergelijkbare projecten in de regio. De welstandseisen zijn daarin nog niet meegenomen.</p>",
          },
          { type: "sources", items: [["mw-haalb", null]] },
        ],
      },
    ],
  },
];

/* ── Gespreksgeschiedenis ─────────────────────────────────────────────
   Elk gesprek heeft een datum, een uitkomst en een plek: één project,
   projectoverstijgend (meer of geen projecten) of het dossier. */
Object.assign(initialConversations.find(({ id }) => id === "c-1"), { date: "2026-11-19", outcome: { glyph: "check", text: "Ongeveer 13 parkeerplaatsen minder nodig" } });
Object.assign(initialConversations.find(({ id }) => id === "c-2"), { date: "2026-11-18", outcome: { glyph: "doc", text: "Concept-verslag met 2 besluiten en 1 actiepunt" } });
Object.assign(initialConversations.find(({ id }) => id === "c-3"), { date: "2026-11-13", outcome: { glyph: "check", text: "Bodemonderzoek en stikstofberekening ontbreken" } });
Object.assign(initialConversations.find(({ id }) => id === "c-4"), { date: "2026-11-03", outcome: { glyph: "check", text: "Ligt ongeveer 12% boven de referenties" } });

const pastConversation = (id, date, projects, title, question, answer, sources, outcome, extra = {}) => ({
  id, date, projects, title, skill: null, outcome, ...extra,
  messages: [
    { role: "user", text: question },
    { role: "rise", blocks: [{ type: "text", html: answer }, { type: "sources", items: sources }] },
  ],
});

initialConversations.push(
  pastConversation("h-pz1", "2026-10-30", ["pz"], "Wat is er besloten in bouwteam #6?", "Wat is er besloten in bouwteam #6 van @Parkzijde?",
    "<p>Er zijn twee besluiten genomen: het VO gaat verder met de compacte variant, en de planning houdt de aanvraag op 2 maart. Joost de Wit vraagt offertes op voor het bodemonderzoek.</p>",
    [["pz-bt6", "pzb1"]], { glyph: "task", text: "2 besluiten, actie voor Joost: offertes bodemonderzoek" }),
  pastConversation("h-pz2", "2026-10-15", ["pz"], "Wat verandert er in planning v4?", "Wat is er veranderd in planning v4 van @Parkzijde?",
    "<p>De aanvraag omgevingsvergunning schuift naar 2 maart. De onderhandeling over de anterieure overeenkomst staat pas na de VO-raming, half januari.</p>",
    [["pz-plan", "pzp1"]], { glyph: "cal", text: "Aanvraag omgevingsvergunning nu op 2 maart" }),
  pastConversation("h-pz3", "2026-09-08", ["pz"], "Ontwerpbrief voor Atelier Noord", "Zet een ontwerpbrief op voor Atelier Noord voor het VO van @Parkzijde.",
    "<p>Ik heb de brief opgezet volgens de stappen voor het voorlopig ontwerp in ons procesmodel: programma, randvoorwaarden van de gemeente en de planning tot de aanvraag.</p>",
    [["bd-werkwijze", null]], { glyph: "doc", text: "Ontwerpbrief v1 in het projectdossier" }),
  pastConversation("h-pz4", "2026-08-12", ["pz"], "Haalbaarheidsrapport samengevat voor de stuurgroep", "Vat het haalbaarheidsrapport van @Parkzijde samen voor de stuurgroep.",
    "<p>Een notitie van twee pagina's volgens ons format: conclusie, financiële uitkomst, risico's en het gevraagde besluit om door te gaan naar het VO.</p>",
    [["bd-format-sg", null]], { glyph: "doc", text: "Notitie van 2 pagina's, gebruikt bij het besluit" }),
  pastConversation("h-pz5", "2026-06-24", ["pz"], "Welke onderzoeken zijn nodig voor de aanvraag?", "Welke onderzoeken hebben we straks nodig voor de aanvraag van @Parkzijde?",
    "<p>Volgens de checklist zes onderzoeken, waaronder een verkennend bodemonderzoek en een stikstofberekening. De andere vier zijn standaard voor een BOPA.</p>",
    [["bd-check-ov", "bdc1"]], { glyph: "task", text: "6 onderzoeken, waaronder bodem en stikstof" }),

  pastConversation("h-hk1", "2026-11-18", ["hk"], "Klopt programma v3 met de afspraken?", "Klopt het woningbouwprogramma v3 van @Havenkwartier nog met de anterieure overeenkomst?",
    "<p>Niet helemaal. De overeenkomst vraagt minstens 30% sociale huur. Programma v3 komt 11 woningen tekort.</p>",
    [["hk-prog", null], ["hk-ao", "p42"]], { glyph: "alert", text: "11 sociale huurwoningen onder de afspraak" }),
  pastConversation("h-hk2", "2026-10-06", ["hk"], "Mail van de gemeente over het programma", "Wat vraagt de gemeente in de mail over ruimte in het programma van @Havenkwartier?",
    "<p>De gemeente wil weten hoe het programma zich verhoudt tot de woonvisie, en vraagt om een voorstel vóór de volgende stuurgroep.</p>",
    [["hk-mail-gem", null]], { glyph: "mail", text: "Kern van de mail en wat je moet beantwoorden" }),
  pastConversation("h-hk3", "2026-09-11", ["hk"], "Verslag stuurgroep 9 september", "Werk mijn aantekeningen van de stuurgroep van @Havenkwartier uit.",
    "<p>Het verslag staat klaar volgens het format, met drie besluiten en vier acties.</p>",
    [["hk-sg-sep", null], ["bd-format-sg", null]], { glyph: "doc", text: "Verslag met 3 besluiten en 4 acties" }),
  pastConversation("h-hk4", "2025-05-20", ["hk"], "Afspraken in de concept-overeenkomst", "Welke afspraken staan er in de concept anterieure overeenkomst van @Havenkwartier?",
    "<p>Veertien afspraken, waarvan drie met een termijn. De belangrijkste: minstens 30% sociale huur en een exploitatiebijdrage in twee termijnen.</p>",
    [["hk-ao", null]], { glyph: "task", text: "14 afspraken, 3 met een termijn" }),

  pastConversation("h-dk1", "2026-11-19", ["dk"], "Wat betekent de vertraging van het akoestisch rapport?", "Wat betekent het als het akoestisch rapport van @DeKade vier weken later komt?",
    "<p>Het rapport is nodig voor de aanvraag van 22 januari. Zonder buffer in de planning komt die datum onder druk.</p>",
    [["dk-mail-ak", null], ["dk-plan", null]], { glyph: "alert", text: "Aanvraag van 22 januari komt onder druk" }),
  pastConversation("h-dk2", "2026-10-02", ["dk"], "Planning v7 nagelopen", "Loop planning v7 van @DeKade na op afhankelijkheden.",
    "<p>Twee stappen hangen zonder buffer aan elkaar: het akoestisch rapport en de aanvraag omgevingsvergunning.</p>",
    [["dk-plan", null]], { glyph: "cal", text: "2 afhankelijkheden zonder buffer" }),
  pastConversation("h-dk3", "2026-09-15", ["dk"], "Wat moet nog langs de brandweer?", "Welke onderdelen van het VO van @DeKade moeten nog langs de brandweer?",
    "<p>Het trappenhuis van blok B. De rest valt binnen de standaard voor de aanvraag.</p>",
    [["bd-check-ov", null]], { glyph: "task", text: "Trappenhuis blok B vraagt advies" }),
  pastConversation("h-dk4", "2026-08-04", ["dk"], "VO naast het programma van eisen", "Leg het VO van @DeKade naast het programma van eisen.",
    "<p>Vier afwijkingen, waarvan één met een kostengevolg: de bergingen in blok A.</p>",
    [["dk-plan", null]], { glyph: "check", text: "4 afwijkingen, 1 met kostengevolg" }),

  pastConversation("h-mw1", "2026-11-10", ["mw"], "Wat vraagt de welstandsnota voor dorpsranden?", "Wat vraagt de nieuwe welstandsnota voor de dorpsrand bij @Molenweide?",
    "<p>Andere eisen aan kapvorm en materiaal. De haalbaarheidsstudie rekent nog met de oude criteria.</p>",
    [["kd-welstand", null], ["mw-haalb", null]], { glyph: "alert", text: "Eisen aan kapvorm en materiaal, studie nog niet bijgewerkt" }),
  pastConversation("h-mw2", "2026-11-06", ["mw"], "Verslag haalbaarheidsoverleg", "Wat is er afgesproken in het haalbaarheidsoverleg van @Molenweide?",
    "<p>Het bod aan de familie Verbeek volgt pas na de herziene haalbaarheidsstudie.</p>",
    [["mw-hov", null]], { glyph: "task", text: "Bod pas na de herziene studie" }),
  pastConversation("h-mw3", "2026-08-20", ["mw"], "Eerste verkenning van de kavel", "Wat kan er ongeveer op de kavel van @Molenweide?",
    "<p>Uitgaande van de huidige regels ongeveer 64 grondgebonden woningen. Dat is het uitgangspunt voor de haalbaarheidsstudie.</p>",
    [["mw-haalb", null]], { glyph: "check", text: "64 woningen als uitgangspunt" }),

  pastConversation("h-x1", "2026-11-17", ["dk", "pz", "mw"], "Welke projecten raakt de nieuwe BENG-norm?", "Welke van onze projecten raakt de BENG-aanscherping?",
    "<p>De Kade en Parkzijde moeten de milieuprestatie herrekenen. Molenweide zit nog vóór het ontwerp en kan de nieuwe norm direct meenemen.</p>",
    [["kd-beng", null]], { glyph: "check", text: "De Kade en Parkzijde moeten herrekenen" }),
  pastConversation("h-x2", "2026-11-10", ["dk", "pz"], "Risico's van De Kade en Parkzijde vergeleken", "Vergelijk de risico's van @DeKade en @Parkzijde.",
    "<p>Bij allebei is de vergunningsdatum het grootste risico: bij De Kade door het akoestisch rapport, bij Parkzijde door het bodemonderzoek.</p>",
    [["dk-plan", null], ["pz-plan", null]], { glyph: "grid", text: "Bij beide is de vergunningsdatum het grootste risico" }, { skill: "vergelijk" }),
  pastConversation("h-x3", "2026-10-28", [], "Kwartaaloverzicht voor de directie", "Maak een kort overzicht van onze vier projecten voor de directie.",
    "<p>Per project de fase, de eerstvolgende mijlpaal en het grootste risico, op één pagina.</p>",
    [["dk-plan", null], ["pz-plan", null], ["hk-prog", null], ["mw-haalb", null]], { glyph: "doc", text: "Overzicht van één pagina" }),

  pastConversation("h-d1", "2026-11-14", [], "Standaardclausules anterieure overeenkomst", "Welke clausules gebruiken we standaard in een anterieure overeenkomst?",
    "<p>Zeven vaste clausules. Bij twee maak je per project een keuze: de verdeling van het kostenverhaal en de termijn voor de openbare ruimte.</p>",
    [["bd-ao-std", null]], { glyph: "doc", text: "7 standaardclausules, 2 met een keuze" }, { scope: "dossier" }),
  pastConversation("h-d2", "2026-10-21", [], "Wat hoort er in een stuurgroepverslag?", "Wat moet er in een stuurgroepverslag volgens ons format?",
    "<p>Zes vaste onderdelen, met besluiten en acties altijd apart en met een eigenaar.</p>",
    [["bd-format-sg", null]], { glyph: "doc", text: "6 vaste onderdelen" }, { scope: "dossier" }),
  pastConversation("h-d3", "2026-09-30", [], "Wat kunnen we vooruitwerken?", "Welke stappen in ons procesmodel kunnen we vooruitwerken?",
    "<p>Twaalf stappen kunnen eerder starten. De anterieure overeenkomst parallel aan het VO levert het meeste tijd op.</p>",
    [["bd-werkwijze", null]], { glyph: "forward", text: "12 stappen, de anterieure overeenkomst levert het meest op" }, { scope: "dossier" }),
);

/* Projecthistorie: fases (nieuwste eerst), het besluit dat de fase opende en wat Vicki onthoudt */
const projectHistory = {
  pz: {
    phases: [
      { name: "Voorlopig ontwerp", from: "2026-08-28", gate: { title: "Haalbaarheidsbesluit", text: "De stuurgroep besloot door te gaan naar het VO", date: "2026-08-27" } },
      { name: "Haalbaarheid", from: "2026-04-01" },
    ],
    memory: [
      { level: "vast", text: "Parkzijde volgt de BOPA-route. De aanvraag staat op 2 maart.", date: "2026-10-15" },
      { level: "vermoed", text: "De anterieure overeenkomst kan parallel aan het VO starten. Dat scheelt ongeveer 8 weken.", date: "2026-11-20" },
      { level: "check", text: "Er is nog geen opdrachtbevestiging voor het bodemonderzoek.", date: "2026-11-13" },
    ],
  },
  hk: {
    phases: [
      { name: "Omgevingsplanwijziging", from: "2026-06-01", gate: { title: "Principeverzoek akkoord", text: "De gemeente werkt mee aan de omgevingsplanwijziging", date: "2026-05-28" } },
      { name: "Haalbaarheid en afspraken", from: "2025-03-01" },
    ],
    memory: [
      { level: "vast", text: "Minstens 30% sociale huur, vastgelegd in de anterieure overeenkomst.", date: "2025-06-12" },
      { level: "vermoed", text: "Met de nieuwe parkeernota zijn ongeveer 13 parkeerplaatsen minder nodig.", date: "2026-11-19" },
      { level: "check", text: "Programma v3 heeft 11 sociale huurwoningen te weinig.", date: "2026-11-18" },
    ],
  },
  dk: {
    phases: [
      { name: "Definitief ontwerp", from: "2026-10-06", gate: { title: "Ontwikkelbesluit", text: "Het VO is vastgesteld, door naar het DO", date: "2026-10-05" } },
      { name: "Voorlopig ontwerp", from: "2026-07-27" },
    ],
    memory: [
      { level: "vast", text: "Het akoestisch rapport komt vier weken later dan gepland.", date: "2026-11-19" },
      { level: "vermoed", text: "Daardoor komt de aanvraag van 22 januari onder druk.", date: "2026-11-19" },
      { level: "check", text: "Het brandweeradvies voor het trappenhuis van blok B heeft nog geen eigenaar.", date: "2026-11-18" },
    ],
  },
  mw: {
    phases: [
      { name: "Haalbaarheid", from: "2026-09-15", gate: { title: "Initiatiebesluit", text: "Start van de haalbaarheidsstudie", date: "2026-09-14" } },
      { name: "Initiatief", from: "2026-07-01" },
    ],
    memory: [
      { level: "vast", text: "De haalbaarheidsstudie rekent nog met de oude welstandscriteria.", date: "2026-11-10" },
      { level: "vermoed", text: "De gevraagde grondprijs ligt ongeveer 12% boven de referenties.", date: "2026-11-03" },
      { level: "check", text: "Het bod aan de grondeigenaar wacht op de herziene studie.", date: "2026-11-06" },
    ],
  },
};
