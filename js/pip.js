// Pip: de assistent als levend figuurtje in de dock.
// Het figuur wordt inline getekend (zodat het blijft staan tussen renders door),
// de toestand komt uit data-state; korte reacties lopen via attributen op <html>,
// omdat morph die niet terugzet.

function pipFigure(pose = "idle") {
  return `<svg class="pip-live" viewBox="0 0 280 310" data-state="${pose}" aria-hidden="true" focusable="false">
    <g class="pip-hop"><g class="pip-body"><g class="pip-breath"><g class="pip-react">
      <path class="pip-back" d="M 75,246 C 48,244 48,217 60,177 C 78,115 105,58 132,47 C 159,36 176,53 163,94 L 132,205 C 121,244 98,266 75,246 Z" fill="none" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="pip-front" d="M 60,177 C 78,115 105,58 132,47 C 159,36 176,53 163,94" fill="none" stroke-width="30" stroke-linecap="round"/>
      <g class="pip-arm">
        <path class="pip-front" d="M 69,237 C 82,201 101,177 134,161 C 163,147 191,144 216,125" fill="none" stroke-width="29" stroke-linecap="round"/>
        <path class="pip-tip" d="M 157,150 C 180,143 200,136 216,125" fill="none" stroke-width="10" stroke-linecap="round"/>
      </g>
      <g class="pip-look"><g class="pip-talk">
        <g class="pip-blink">
          <rect class="pip-eye" x="135" y="43" width="7" height="15" rx="3.5"/>
          <rect class="pip-eye" x="152" y="45" width="7" height="15" rx="3.5"/>
        </g>
        <path class="pip-happy" d="M 133,54 Q 138.5,45 144,54 M 150,56 Q 155.5,47 161,56" fill="none" stroke-width="5" stroke-linecap="round"/>
      </g></g>
      <path class="pip-attention" d="M 187,33 L 192,23 M 201,48 L 212,43" fill="none" stroke-width="5" stroke-linecap="round"/>
      <g class="pip-dots"><circle cx="190" cy="30" r="5"/><circle cx="207" cy="19" r="6.5"/><circle cx="226" cy="9" r="8"/></g>
    </g></g></g></g>
  </svg>`;
}

(() => {
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const figure = () => document.querySelector(".dock .pip-live");
  const later = (fn, ms) => setTimeout(fn, ms);
  let lastTip = "";
  let typing = false;

  // Korte reacties: knik, blij, zwaai, rek, opmerken.
  let reactTimer = 0;
  function react(name, ms) {
    if (calm.matches) return;
    root.dataset.pipReact = name;
    clearTimeout(reactTimer);
    reactTimer = later(() => {
      if (root.dataset.pipReact === name) delete root.dataset.pipReact;
    }, ms);
  }

  // Knipperen op een onregelmatig ritme, soms twee keer achter elkaar.
  function blinkOnce(ms = 130) {
    root.dataset.pipBlink = "";
    later(() => delete root.dataset.pipBlink, ms);
  }
  (function blink() {
    if (!calm.matches && !document.hidden) {
      blinkOnce();
      if (Math.random() < 0.22) later(() => blinkOnce(120), 300);
    }
    later(blink, 2600 + Math.random() * 4600);
  })();

  // Oogjes volgen rustig de muis; tijdens typen kijkt Pip naar het invoerveld.
  let pointer = null;
  let frame = 0;
  let typingUntil = 0;
  function lookTo(x, y) {
    root.style.setProperty("--pip-lx", `${x.toFixed(1)}px`);
    root.style.setProperty("--pip-ly", `${y.toFixed(1)}px`);
  }
  function follow() {
    frame = 0;
    const pip = figure();
    if (!pip || calm.matches || Date.now() < typingUntil) return;
    if (!pointer) return lookTo(0, 0);
    const box = pip.getBoundingClientRect();
    const dx = pointer.x - (box.left + box.width * 0.54);
    const dy = pointer.y - (box.top + box.height * 0.17);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, distance / 240);
    lookTo((dx / distance) * 8 * reach, (dy / distance) * 6 * reach);
  }
  addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(follow);
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer = null; follow(); });

  let lastNod = 0;
  document.addEventListener("input", (event) => {
    if (event.target.id !== "dock-input") return;
    typingUntil = Date.now() + 1400;
    lookTo(-4, 7);
    later(follow, 1450);
    if (Date.now() - lastNod > 1600 && event.target.value.length % 12 === 1) {
      lastNod = Date.now();
      react("nod", 520);
    }
  });
  document.addEventListener("submit", (event) => {
    if (event.target.closest(".dock-bar")) react("nod", 520);
  }, true);

  // Af en toe een klein gebaar als Pip niets te doen heeft.
  (function fidget() {
    later(fidget, 15000 + Math.random() * 15000);
    const pip = figure();
    if (!pip || calm.matches || document.hidden || root.dataset.pipReact || typing) return;
    if (!["idle", "noticed"].includes(pip.dataset.state)) return;
    if (document.querySelector(".dock-trigger:hover")) return;
    const move = ["wave", "stretch", "around"][Math.floor(Math.random() * 3)];
    if (move !== "around") return react(move, 1500);
    lookTo(-8, 1);
    later(() => lookTo(7, -3), 900);
    later(follow, 1900);
  })();

  // Tips verschijnen alsof Pip ze uitspreekt: letter voor letter, terwijl hij beweegt.
  function speakTip(span, text, delay) {
    typing = true;
    span.textContent = "";
    later(() => {
      root.dataset.pipTalk = "";
      let shown = 0;
      const step = () => {
        const current = document.querySelector(".pip-bubble .pip-tip-open span");
        if (!current || lastTip !== text) return done();
        shown += 2;
        current.textContent = text.slice(0, shown);
        if (shown < text.length) later(step, 34);
        else done();
      };
      step();
    }, delay);
    function done() {
      typing = false;
      delete root.dataset.pipTalk;
      const current = document.querySelector(".pip-bubble .pip-tip-open span");
      if (current && lastTip === text) current.textContent = text;
    }
  }

  let lastState = null;
  function onChange() {
    const pip = figure();
    const state = pip?.dataset.state ?? null;
    if (state !== lastState) {
      if (["thinking", "talking"].includes(lastState) && ["listening", "idle"].includes(state)) react("happy", 1700);
      lastState = state;
    }
    if (typing) return;
    const span = document.querySelector(".pip-bubble .pip-tip-open span");
    const text = span?.textContent ?? "";
    if (!span) { lastTip = ""; return; }
    if (text === lastTip) return;
    const first = !lastTip;
    lastTip = text;
    if (calm.matches) return;
    if (!first) react("notice", 1700);
    speakTip(span, text, first ? 1250 : 450);
  }
  const start = () => {
    const app = document.getElementById("app");
    if (!app) return;
    new MutationObserver(onChange).observe(app, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["data-state"] });
    onChange();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  // Heeft de pagina meer tips, dan laat Pip er rustig nog een paar zien, en stopt dan.
  setInterval(() => {
    if (typeof state === "undefined" || typeof currentPipTips !== "function") return;
    const dock = state.dock;
    if (document.hidden || calm.matches || typing || dock.open || dock.tipDismissed || dock.about) return;
    if (document.querySelector(".dock-trigger:hover, .pip-bubble:hover, .pip-bubble :focus")) return;
    const tips = currentPipTips(currentDockContext());
    const next = (dock.tipIndex ?? 0) + 1;
    if (next >= tips.length) return;
    dock.tipIndex = next;
    render();
  }, 38000);
})();
