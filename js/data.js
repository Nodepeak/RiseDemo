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
    phase: "Bestemmingsplan",
    next: "Indiening ontwerp-bestemmingsplan",
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
        "3.1 Ontwikkelaar betaalt aan de gemeente een exploitatiebijdrage van € 1.240.000, te voldoen in twee termijnen. De eerste termijn van 50% vervalt op het moment dat het bestemmingsplan onherroepelijk is.",
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
      "Voortgang ruimtelijke onderbouwing, planning bestemmingsplan bevestigd op 15 januari.",
    body: [
      [
        "p",
        "Besluit: de indiening van het ontwerp-bestemmingsplan blijft gepland op 15 januari 2027.",
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
    title: "Werkwijze ontwikkelproces",
    kind: "Werkwijze",
    date: "jan 2026",
    author: "Stadsas",
    summary:
      "Hoe Stadsas een project doorloopt, van acquisitie tot oplevering, met beslismomenten per fase.",
    body: [
      ["p", "Elke fase eindigt met een go/no-go in het investeringscomité."],
      [
        "p",
        "Afwijkingen van gemaakte afspraken met overheden worden binnen twee weken gemeld aan de directie.",
      ],
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
      "Hoe wij werken: werkwijzen, formats, checklists en standaarddocumenten. Rise gebruikt dit als referentie bij projectvragen.",
  },
  kaders: {
    name: "Kaders",
    intro:
      "Beleid, normen en uitgangspunten waar onze projecten aan moeten voldoen. Werknaam was “Beleidsdossiers”.",
  },
};

const signals = [
  {
    id: "s-hk",
    project: "hk",
    level: "vast",
    title: "Sociale huur onder de afspraak",
    certaintyScope: "Afwijking van de afspraak",
    hook: "11 woningen minder dan afgesproken",
    milestone: "Indiening ontwerp-bestemmingsplan",
    what: "Programma v3 telt 53 sociale huurwoningen (25%). De overeenkomst vraagt er minimaal 64 (30%).",
    why: "Het programma ligt aan de basis van het ontwerp-bestemmingsplan. Een afwijking vraagt akkoord van de gemeente vóór indiening.",
    claims: [
      ["vast", "De overeenkomst noemt minimaal 30% sociale huur.", "hk-ao"],
      ["vast", "Programma v3 komt uit op 25%.", "hk-prog"],
      [
        "check",
        "Ik vind geen addendum of besluit dat de 30% wijzigt. Er is wel een mail waarin de gemeente ruimte ziet om het te bespreken.",
        "hk-mail-gem",
      ],
      [
        "vermoed",
        "Zonder akkoord kan de gemeente het ontwerp-bestemmingsplan aanhouden.",
        null,
      ],
    ],
    consequence: [
      ["Programma v3", "nu"],
      ["Stuurgroep met gemeente", "2 dec"],
      ["Ontwerp-bestemmingsplan", "15 jan"],
    ],
    sources: [
      ["hk-ao", "p42"],
      ["hk-prog", "p-tab"],
      ["hk-mail-gem", "pm1"],
      ["kd-woonvisie", "kdw1"],
    ],
    steps: [
      {
        label: "Laat de afsprakenagent zoeken naar een gewijzigde afspraak",
        intent: "agreements",
      },
      {
        label: "Zet het op de agenda van de stuurgroep (2 dec)",
        cta: "Bereid de stuurgroep voor",
        primary: true,
        intent: "meeting-hk",
      },
      { label: "Concept-vraag aan Ilse Bakker (gemeente)", intent: "draft-hk" },
    ],
  },
  {
    id: "s-dk",
    project: "dk",
    level: "vermoed",
    title: "Akoestisch rapport komt later",
    certaintyScope: "Gevolg voor de vergunningaanvraag",
    hook: "Indiening vergunning schuift mogelijk mee",
    milestone: "Aanvraag omgevingsvergunning",
    what: "Akoestiek Zuid noemt 8 januari als opleverdatum in zijn mail. De planning gaat uit van 11 december.",
    why: "Het definitief ontwerp voor de spoorgevel wacht op het rapport. Daardoor kan ook de vergunningaanvraag opschuiven.",
    claims: [
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
      ["dk-mail-ak", "pa1"],
      ["dk-plan", "pp1"],
      ["dk-ot-okt", null],
    ],
    steps: [
      {
        label: "Laat de planningsagent de gevolgen doorrekenen",
        intent: "planning",
      },
      {
        label: "Vraag Ruben om het concept van de gevelbelasting",
        cta: "Maak een conceptmail aan Ruben",
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
    what: "Het dossier bevat een offerte voor bodemonderzoek die op 12 december verloopt. De opdrachtbevestiging ontbreekt in het dossier.",
    why: "Het onderzoek duurt circa zeven weken. Om de aanvraag van 2 maart te halen, moet de opdracht rond 5 januari uitstaan.",
    claims: [
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
      ["pz-plan", "pzp1"],
      ["pz-offerte", "pzo1"],
      ["pz-bt6", "pzb1"],
      ["bd-check-ov", "bdc1"],
    ],
    steps: [
      {
        label: "Vraag Joost of het onderzoek al is uitgezet",
        cta: "Maak een conceptmail aan Joost",
        intent: "draft-pz",
        primary: !0,
      },
      {
        label: "Het is geregeld: koppel de bevestiging",
        intent: "resolved-pz",
      },
      { label: "Zet het op de agenda van bouwteam #7", intent: "meeting" },
    ],
  },
  {
    id: "s-hk2",
    project: "hk",
    level: "vermoed",
    title: "Nieuwe parkeernorm verlaagt de opgave",
    certaintyScope: "Of parkeerzone A hier geldt",
    hook: "Mogelijk 13 parkeerplaatsen minder nodig",
    milestone: "Indiening ontwerp-bestemmingsplan",
    what: "De nieuwe parkeernota verlaagt de norm voor middenhuur in zone A van 0,8 naar 0,6. Het programma rekent nog met de oude norm.",
    why: "Minder parkeerplaatsen kan ruimte geven in de businesscase. Dat kan ook helpen bij het gesprek over sociale huur.",
    claims: [
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
      ["Ontwerp-bestemmingsplan", "15 jan"],
    ],
    sources: [
      ["kd-parkeren", "kdp1"],
      ["hk-prog", "p-tab"],
    ],
    steps: [{ label: "Toets met Rise welke parkeerzone hier geldt", intent: "signal-hk-parking", primary: !0 }],
  },
  {
    id: "s-dk2",
    project: "dk",
    level: "check",
    title: "Brandweeradvies trappenhuis staat open",
    certaintyScope: "Of het advies al binnen is",
    hook: "Actie uit ontwerpteam nog niet afgerond",
    milestone: "DO gereed",
    what: "Kroon Architecten zou het brandweeradvies voor trappenhuis blok B opvragen. Ik zie nog geen advies binnenkomen.",
    why: "Het advies kan de plattegrond van blok B veranderen. Dat is lastig als het pas na het DO komt.",
    claims: [
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
    sources: [["dk-ot-okt", null]],
    steps: [
      {
        label: "Zet op agenda ontwerpteam (27 nov)",
        cta: "Bereid het ontwerpteam voor",
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
    what: "Houten heeft een nieuwe welstandsnota met eisen voor dorpsranden. Volgens de haalbaarheidsstudie is die nog niet verwerkt.",
    why: "Kapvormen en materialen kunnen de bouwkosten veranderen, en daarmee de grondprijs in de intentieovereenkomst.",
    claims: [
      [
        "vast",
        "De studie zegt zelf dat de nota nog niet is verwerkt.",
        "mw-haalb",
      ],
      ["vermoed", "De kavel ligt in een dorpsrand.", "kd-welstand"],
    ],
    consequence: [
      ["Welstandsnota", "nov"],
      ["Haalbaarheidsstudie", "dec"],
      ["Intentieovereenkomst", "12 feb"],
    ],
    sources: [
      ["mw-haalb", null],
      ["kd-welstand", null],
    ],
    steps: [{ label: "Leg de welstandsnota naast de haalbaarheidsstudie", intent: "signal-mw-welstand", primary: !0 }],
  },
];

const schedules = {
  dk: {
    version: "Planning v7 · laatst aangepast 2 okt",
    rows: [
      {
        name: "Schetsontwerp",
        start: [8, 1, 2026],
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
        start: [9, 15, 2026],
        end: [11, 18, 2026],
      },
      {
        name: "Stuurgroep met gemeente",
        milestone: [11, 2, 2026],
      },
      {
        name: "Indiening ontwerp-bestemmingsplan",
        milestone: [0, 15, 2027],
        key: !0,
        dep: "Programma + onderbouwing",
      },
      {
        name: "Ter inzage",
        start: [1, 1, 2027],
        end: [2, 15, 2027],
        dep: "Indiening",
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
      },
      { name: "Definitief ontwerp", start: [11, 15, 2026], end: [1, 15, 2027] },
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
        start: [9, 1, 2026],
        end: [11, 20, 2026],
      },
      { name: "Gesprek grondeigenaar", milestone: [11, 4, 2026] },
      { name: "Intentieovereenkomst", milestone: [1, 12, 2027], key: !0 },
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
        "Planning bestemmingsplan",
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
    decisions: ["Indiening ontwerp-bestemmingsplan blijft 15 januari."],
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
