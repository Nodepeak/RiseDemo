// Vicki: de assistent van Rise als levend figuurtje.
// Het figuur wordt inline getekend (zodat het blijft staan tussen renders door).
// De toestand komt uit data-state op de <svg>; gezicht, mond, blik en korte
// reacties lopen via attributen en CSS-variabelen op <html>, omdat morph die
// niet terugzet. Zo blijft Vicki bewegen terwijl de app opnieuw rendert.

// Uitstraling: "klei" (standaard), "inkt" of "druppel".
const VICKI_LOOK = "klei";

function vickiFigure(pose = "idle", look = VICKI_LOOK) {
  return `<svg class="vicki-live" viewBox="0 0 240 256" data-state="${pose}" data-look="${look}" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="vk-skin-inkt" cx="34%" cy="24%" r="85%"><stop offset="0" stop-color="#3A4177"/><stop offset=".5" stop-color="#1C2050"/><stop offset="1" stop-color="#0B0D26"/></radialGradient>
      <radialGradient id="vk-skin-klei" cx="34%" cy="24%" r="85%"><stop offset="0" stop-color="#FFF8F2"/><stop offset=".55" stop-color="#FBE6D7"/><stop offset="1" stop-color="#EFC9B0"/></radialGradient>
      <radialGradient id="vk-skin-druppel" cx="34%" cy="30%" r="85%"><stop offset="0" stop-color="#FFC39A"/><stop offset=".5" stop-color="#FF8A55"/><stop offset="1" stop-color="#F0602F"/></radialGradient>
      <radialGradient id="vk-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#FFD27A" stop-opacity=".9"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse class="vk-shadow" cx="120" cy="238" rx="50" ry="7"/>
    <g class="vk-float"><g class="vk-lean"><g class="vk-react"><g class="vk-breath">
      <path class="vk-body vk-body--pebble" d="M120,44 C168,44 192,74 192,130 C192,184 162,212 120,212 C78,212 48,184 48,130 C48,74 72,44 120,44 Z"/>
      <path class="vk-body vk-body--drop" d="M146,30 C150,70 194,92 194,142 C194,186 162,212 120,212 C78,212 46,186 46,142 C46,90 100,66 146,30 Z"/>
      <path class="vk-rim vk-rim--pebble" d="M70,84 C78,64 96,54 116,52" fill="none" stroke-width="6" stroke-linecap="round"/>
      <path class="vk-rim vk-rim--drop" d="M66,112 C76,90 98,76 120,62" fill="none" stroke-width="6" stroke-linecap="round"/>
      <path class="vk-rim vk-rim--soft" d="M180,154 C176,178 162,194 140,202" fill="none" stroke-width="4" stroke-linecap="round"/>
      <g class="vk-face">
        <ellipse class="vk-cheek" cx="78" cy="136" rx="11" ry="6.5"/>
        <ellipse class="vk-cheek" cx="162" cy="136" rx="11" ry="6.5"/>
        <g class="vk-eyes"><g class="vk-eyes-in">
          <g class="vk-eye-open"><g class="vk-blink">
            <ellipse class="vk-ink" cx="98" cy="114" rx="10.5" ry="14"/>
            <ellipse class="vk-ink" cx="142" cy="114" rx="10.5" ry="14"/>
            <circle class="vk-glint" cx="101.5" cy="108" r="3.8"/><circle class="vk-glint" cx="145.5" cy="108" r="3.8"/>
            <circle class="vk-glint vk-glint--s" cx="95" cy="120" r="1.7"/><circle class="vk-glint vk-glint--s" cx="139" cy="120" r="1.7"/>
          </g></g>
          <path class="vk-eye-happy vk-line" d="M87,118 Q98,102 109,118 M131,118 Q142,102 153,118" fill="none" stroke-width="6" stroke-linecap="round"/>
          <path class="vk-eye-shut vk-line" d="M87,114 Q98,123 109,114 M131,114 Q142,123 153,114" fill="none" stroke-width="5" stroke-linecap="round"/>
        </g></g>
        <path class="vk-brow vk-brow--l vk-line" d="M86,89 Q96,82 108,86" fill="none" stroke-width="5" stroke-linecap="round"/>
        <path class="vk-brow vk-brow--r vk-line" d="M132,86 Q144,82 154,89" fill="none" stroke-width="5" stroke-linecap="round"/>
        <g class="vk-mouth">
          <path class="vk-m vk-line" data-m="smile" d="M109,140 Q120,150 131,140" fill="none" stroke-width="5" stroke-linecap="round"/>
          <path class="vk-m vk-ink" data-m="grin" d="M105,137 Q120,161 135,137 Q120,142 105,137 Z" stroke-linejoin="round"/>
          <path class="vk-m vk-ink" data-m="a" d="M110,139 Q120,155 130,139 Q120,143 110,139 Z"/>
          <path class="vk-m vk-ink" data-m="e" d="M107,140 Q120,150 133,140 Q120,145 107,140 Z"/>
          <ellipse class="vk-m vk-ink" data-m="o" cx="120" cy="144" rx="5.5" ry="6.5"/>
          <ellipse class="vk-m vk-ink" data-m="yawn" cx="120" cy="146" rx="8" ry="10"/>
          <path class="vk-m vk-line" data-m="m" d="M112,143 L128,143" fill="none" stroke-width="5" stroke-linecap="round"/>
          <path class="vk-m vk-line" data-m="hmm" d="M111,145 Q116,140 121,144 T131,142" fill="none" stroke-width="4.5" stroke-linecap="round"/>
        </g>
      </g>
      <g class="vk-hand vk-hand--l"><g class="vk-hand-in"><circle cx="36" cy="170" r="15" class="vk-mitt"/><path class="vk-rim" d="M27,164 Q30,159 36,158" fill="none" stroke-width="3" stroke-linecap="round"/></g></g>
      <g class="vk-hand vk-hand--r"><g class="vk-hand-in"><circle cx="204" cy="170" r="15" class="vk-mitt"/><path class="vk-rim" d="M195,164 Q198,159 204,158" fill="none" stroke-width="3" stroke-linecap="round"/></g></g>
    </g></g></g>
      <g class="vk-spark"><g class="vk-spark-in">
        <circle cx="204" cy="40" r="20" fill="url(#vk-glow)" class="vk-spark-glow"/>
        <path class="vk-spark-star" d="M204,27 C206,36 207,38 217,40 C207,42 206,44 204,53 C202,44 201,42 191,40 C201,38 202,36 204,27 Z"/>
      </g></g>
      <g class="vk-rays vk-line"><path d="M222,26 L229,19 M226,44 L235,45 M209,16 L211,7" fill="none" stroke-width="4" stroke-linecap="round"/></g>
      <g class="vk-bursts">
        <path d="M44,52 l2,6 6,2 -6,2 -2,6 -2,-6 -6,-2 6,-2 Z"/><path d="M196,84 l1.6,4.8 4.8,1.6 -4.8,1.6 -1.6,4.8 -1.6,-4.8 -4.8,-1.6 4.8,-1.6 Z"/><path d="M70,20 l1.4,4 4,1.4 -4,1.4 -1.4,4 -1.4,-4 -4,-1.4 4,-1.4 Z"/>
      </g>
      <g class="vk-zzz"><text x="184" y="48">z</text><text x="198" y="30">z</text><text x="214" y="12">z</text></g>
    </g>
  </svg>`;
}

(() => {
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const figure = () => document.querySelector(".dock .vicki-live") || document.querySelector(".vicki-live");
  const pose = () => figure()?.dataset.state ?? "idle";
  const later = (fn, ms) => setTimeout(fn, ms);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const inDock = () => Boolean(document.querySelector(".dock .vicki-live"));

  // ---- Gezicht: één plek bepaalt uitdrukking en mond ----------------------
  let reactFace = null;
  let mood = "awake"; // awake | drowsy | sleep
  let hovering = false;
  let talkMouth = null;

  const faceFor = {
    idle: "neutral", noticed: "bright", listening: "listen", thinking: "think", talking: "talk",
  };
  const mouthFor = {
    neutral: "smile", bright: "smile", glad: "a", listen: "smile", think: "hmm", talk: "smile",
    grin: "grin", notice: "o", surprise: "o", sleep: "o", yawn: "yawn", blush: "smile", proud: "grin", doubt: "m",
  };
  function face() {
    if (reactFace) return reactFace;
    if (mood === "sleep") return "sleep";
    if (mood === "drowsy") return "yawn";
    const base = faceFor[pose()] ?? "neutral";
    if (hovering && (base === "neutral" || base === "bright")) return "glad";
    return base;
  }
  function paint() {
    const f = face();
    root.dataset.vickiFace = f;
    root.dataset.vickiMouth = talkMouth ?? mouthFor[f] ?? "smile";
    root.dataset.vickiMood = mood;
  }

  // ---- Korte reacties -----------------------------------------------------
  const reactions = {
    hop: ["grin", 1000], nod: [null, 560], wave: ["grin", 1700], boop: ["glad", 420], wake: ["surprise", 900],
    notice: ["notice", 1300], stretch: ["yawn", 1500], blush: ["blush", 2000], twirl: ["proud", 1300],
    shake: ["doubt", 900], toss: ["bright", 1500], look: [null, 2000],
  };
  let reactTimer = 0;
  function react(name) {
    const [f, ms] = reactions[name] ?? [null, 800];
    if (calm.matches) { reactFace = f; paint(); clearTimeout(reactTimer); reactTimer = later(() => { reactFace = null; paint(); }, ms); return; }
    delete root.dataset.vickiReact;
    void root.offsetWidth; // zelfde reactie direct opnieuw kunnen starten
    root.dataset.vickiReact = name;
    reactFace = f;
    paint();
    clearTimeout(reactTimer);
    reactTimer = later(() => {
      if (root.dataset.vickiReact === name) delete root.dataset.vickiReact;
      reactFace = null;
      paint();
    }, ms);
  }

  // ---- Knipperen ---------------------------------------------------------
  function blinkOnce(ms = 120) {
    root.dataset.vickiBlink = "";
    later(() => delete root.dataset.vickiBlink, ms);
  }
  (function blink() {
    if (!calm.matches && !document.hidden && mood === "awake") {
      blinkOnce();
      if (Math.random() < 0.25) later(() => blinkOnce(110), 260);
    }
    later(blink, 2200 + Math.random() * 4200);
  })();

  // ---- Kijken: ogen, gezicht en lichaam draaien mee met de muis ----------
  let pointer = null;
  let frame = 0;
  let holdLookUntil = 0;
  function lookTo(x, y, tilt = x * 0.55) {
    root.style.setProperty("--vk-lx", `${x.toFixed(2)}px`);
    root.style.setProperty("--vk-ly", `${y.toFixed(2)}px`);
    root.style.setProperty("--vk-tilt", `${tilt.toFixed(2)}deg`);
  }
  function holdLook(x, y, ms) {
    holdLookUntil = Date.now() + ms;
    lookTo(x, y);
    later(follow, ms + 20);
  }
  function follow() {
    frame = 0;
    const vk = figure();
    if (!vk || calm.matches || Date.now() < holdLookUntil) return;
    if (mood === "sleep") return lookTo(0, 2, 0);
    if (pose() === "thinking") return lookTo(5, -6, 2);
    if (!pointer) return lookTo(0, 0);
    const box = vk.getBoundingClientRect();
    const dx = pointer.x - (box.left + box.width * 0.5);
    const dy = pointer.y - (box.top + box.height * 0.45);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, distance / (box.width * 2.2));
    lookTo((dx / distance) * 7 * reach, (dy / distance) * 5.5 * reach);
  }

  // ---- Wakker blijven, of indutten bij lange stilte ------------------------
  let lastActive = Date.now();
  let sleepGrace = 0;
  function activity() {
    if (Date.now() < sleepGrace) return;
    lastActive = Date.now();
    if (mood !== "awake") {
      const wasAsleep = mood === "sleep";
      mood = "awake";
      paint();
      if (wasAsleep) { react("wake"); later(() => react("wave"), 950); }
    }
  }
  setInterval(() => {
    if (calm.matches || document.hidden || !figure()) return;
    const quiet = Date.now() - lastActive;
    const restful = ["idle", "noticed"].includes(pose()) && !document.querySelector(".dock--open");
    if (!restful) return;
    if (mood === "awake" && quiet > 45000) {
      mood = "drowsy";
      paint();
      root.dataset.vickiReact = "stretch";
      later(() => { if (mood === "drowsy") { mood = "sleep"; delete root.dataset.vickiReact; paint(); follow(); } }, 2200);
    }
  }, 1000);

  addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    activity();
    if (!frame) frame = requestAnimationFrame(follow);
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer = null; follow(); });
  addEventListener("keydown", activity);
  addEventListener("scroll", activity, { passive: true, capture: true });

  // ---- Hover, aaien en aanraken ----------------------------------------------
  let hoverTimer = 0;
  document.addEventListener("pointerover", (event) => {
    const on = event.target.closest?.(".dock-trigger, .vicki-stage");
    if (!on || hovering) return;
    hovering = true;
    paint();
    clearTimeout(hoverTimer);
    hoverTimer = later(() => { if (hovering && !root.dataset.vickiReact) react("blush"); }, 1600);
  });
  document.addEventListener("pointerout", (event) => {
    const from = event.target.closest?.(".dock-trigger, .vicki-stage");
    if (!from || from.contains(event.relatedTarget)) return;
    hovering = false;
    clearTimeout(hoverTimer);
    paint();
  });
  let pokes = [];
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest?.(".dock-trigger, .vicki-stage")) return;
    pokes = [...pokes.filter((t) => Date.now() - t < 1400), Date.now()];
    if (pokes.length >= 4) { pokes = []; return react("twirl"); }
    react("boop");
  });

  // ---- Typen in het invoerveld: Vicki kijkt mee en knikt -------------------
  let lastNod = 0;
  document.addEventListener("input", (event) => {
    if (!["dock-input", "vicki-say-input"].includes(event.target.id)) return;
    holdLook(-5, 6, 1300);
    if (Date.now() - lastNod > 1500 && event.target.value.length % 10 === 1) {
      lastNod = Date.now();
      react("nod");
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.closest(".dock-bar")) react("nod");
  }, true);

  // ---- Praten: de mond volgt de letters ------------------------------------
  const vowelMouth = { a: "a", e: "e", i: "e", o: "o", u: "o", y: "e" };
  function mouthForChar(char, index) {
    const c = (char || "").toLowerCase();
    if (vowelMouth[c]) return vowelMouth[c];
    if (/[bmp]/.test(c)) return "m";
    if (/[\s.,!?…]/.test(c)) return "smile";
    return index % 2 ? "e" : "a";
  }
  let chatter = 0;
  function startChatter() {
    if (chatter || calm.matches) return;
    const tick = () => {
      talkMouth = pick(["a", "e", "o", "a", "m", "e", "a"]);
      paint();
      chatter = later(tick, 85 + Math.random() * 75);
    };
    tick();
  }
  function stopChatter() {
    clearTimeout(chatter);
    chatter = 0;
    talkMouth = null;
    paint();
  }

  // Tekst letter voor letter laten verschijnen alsof Vicki het zegt.
  let saying = null;
  function say(target, text, { delay = 0, onDone } = {}) {
    const token = {};
    saying = token;
    const get = typeof target === "function" ? target : () => target;
    const el0 = get();
    if (el0) el0.textContent = "";
    later(() => {
      if (saying !== token) return;
      root.dataset.vickiTalk = "";
      let shown = 0;
      const step = () => {
        const el = get();
        if (saying !== token || !el) return done(false);
        shown = Math.min(text.length, shown + 2);
        el.textContent = text.slice(0, shown);
        talkMouth = mouthForChar(text[shown - 1], shown);
        paint();
        if (shown < text.length) later(step, /[.,!?]/.test(text[shown - 1]) ? 160 : 42);
        else done(true);
      };
      step();
    }, calm.matches ? 0 : delay);
    function done(finished) {
      if (saying === token) saying = null;
      delete root.dataset.vickiTalk;
      talkMouth = null;
      const el = get();
      if (el) el.textContent = text;
      paint();
      onDone?.(finished);
    }
  }

  // ---- Fidgets: kleine gebaren als er niets te doen is ---------------------
  (function fidget() {
    later(fidget, 11000 + Math.random() * 13000);
    const vk = figure();
    if (!vk || calm.matches || document.hidden || root.dataset.vickiReact || saying || mood !== "awake") return;
    if (!["idle", "noticed"].includes(pose())) return;
    if (hovering) return;
    const move = pick(["look", "look", "wave", "stretch", "toss", "toss", "hop"]);
    if (move === "look") {
      react("look");
      holdLook(-7, 1, 800);
      later(() => holdLook(7, -3, 800), 850);
      return;
    }
    if (move === "toss") holdLook(3, -7, 1300);
    react(move);
  })();

  // ---- Reageren op de app: toestand, tips --------------------------------------
  let lastState = null;
  let lastTip = "";
  const tipSpan = () => document.querySelector(".vicki-bubble .vicki-tip-open span");
  function onChange() {
    const state = pose();
    if (state !== lastState) {
      if (["thinking", "talking"].includes(lastState) && ["listening", "idle", "noticed"].includes(state)) react("hop");
      if (state === "noticed" && lastState && lastState !== "noticed") later(() => react("notice"), 900);
      if (state === "talking") startChatter();
      else if (lastState === "talking") stopChatter();
      if (state === "listening") activity();
      lastState = state;
      follow();
      paint();
    }
    if (saying) return;
    const span = tipSpan();
    const text = span?.textContent ?? "";
    if (!span) { lastTip = ""; return; }
    if (text === lastTip) return;
    const first = !lastTip;
    lastTip = text;
    if (calm.matches) return;
    if (!first) react("notice");
    say(tipSpan, text, { delay: first ? 1250 : 450 });
  }
  const start = () => {
    paint();
    const app = document.getElementById("app");
    if (app) {
      new MutationObserver(onChange).observe(app, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["data-state"] });
      onChange();
    }
    // Eerste kennismaking per sessie: even zwaaien.
    if (inDock() && !sessionStorage.getItem("vicki-hi")) {
      sessionStorage.setItem("vicki-hi", "1");
      later(() => react("wave"), 700);
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  // Heeft de pagina meer tips, dan laat Vicki er rustig nog een paar zien, en stopt dan.
  setInterval(() => {
    if (typeof state === "undefined" || typeof currentVickiTips !== "function") return;
    const dock = state.dock;
    if (document.hidden || calm.matches || saying || dock.open || dock.tipDismissed || dock.about || mood !== "awake") return;
    if (document.querySelector(".dock-trigger:hover, .vicki-bubble:hover, .vicki-bubble :focus")) return;
    const tips = currentVickiTips(currentDockContext());
    const next = (dock.tipIndex ?? 0) + 1;
    if (next >= tips.length) return;
    dock.tipIndex = next;
    render();
  }, 38000);

  // Voor de speeltuin en voor voorlezen.
  window.vicki = {
    react,
    say,
    lookTo: holdLook,
    talk: (on) => (on ? startChatter() : stopChatter()),
    sleep: () => { sleepGrace = Date.now() + 1800; mood = "sleep"; paint(); follow(); },
    wake: () => { sleepGrace = 0; activity(); },
    get mood() { return mood; },
  };
})();
