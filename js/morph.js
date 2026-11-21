/* Lichtgewicht DOM-morph: werkt de bestaande DOM bij naar nieuwe HTML in plaats
   van alles te vervangen. Daardoor blijven focus, scrollposities en lopende
   CSS-transities behouden, en spelen intro-animaties alleen voor elementen die
   echt nieuw zijn. Elementen met een exit-animatie (data-exit) krijgen eerst
   de klasse .is-leaving voordat ze verdwijnen. */
(() => {
  const EXIT_SELECTOR = ".drawer, .scrim, .pop, .toast, .dock-panel, .routes-panel, .mobile-nav-scrim, .palette, .palette-scrim";

  const keyOf = (node) =>
    node.nodeType === 1 ? node.id || node.getAttribute("data-key") || null : null;

  function isSame(a, b) {
    if (a.nodeType !== b.nodeType) return false;
    if (a.nodeType !== 1) return true;
    if (a.tagName !== b.tagName) return false;
    return keyOf(a) === keyOf(b);
  }

  function leave(el) {
    if (el.nodeType !== 1 || !el.matches(EXIT_SELECTOR) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.remove();
      return;
    }
    el.setAttribute("data-leaving", "");
    el.classList.add("is-leaving");
    el.inert = true;
    const done = () => el.remove();
    const animations = el.getAnimations();
    if (!animations.length) return done();
    Promise.allSettled(animations.map((a) => a.finished)).then(done);
  }

  function syncAttributes(from, to) {
    for (const { name } of [...from.attributes]) {
      if (!to.hasAttribute(name) && !(from.tagName === "DETAILS" && name === "open") && name !== "data-leaving") {
        from.removeAttribute(name);
      }
    }
    for (const { name, value } of [...to.attributes]) {
      if (from.getAttribute(name) !== value) from.setAttribute(name, value);
    }
  }

  function morphNode(from, to) {
    if (from.nodeType !== 1) {
      if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
      return;
    }
    syncAttributes(from, to);
    const active = document.activeElement === from;
    if (from.tagName === "TEXTAREA") {
      if (!active && from.value !== to.value) from.value = to.value;
      return;
    }
    if (from.tagName === "INPUT") {
      if (from.type === "checkbox" || from.type === "radio") from.checked = to.hasAttribute("checked");
      else if (!active && from.value !== (to.getAttribute("value") ?? "")) from.value = to.getAttribute("value") ?? "";
      return;
    }
    morphChildren(from, to);
    if (from.tagName === "SELECT") {
      const chosen = to.querySelector("option[selected]");
      if (chosen && !active) from.value = chosen.value;
    }
  }

  function skipLeaving(node) {
    while (node && node.nodeType === 1 && node.hasAttribute("data-leaving")) node = node.nextSibling;
    return node;
  }

  function morphChildren(from, to) {
    let cursor = skipLeaving(from.firstChild);
    for (const next of [...to.childNodes]) {
      let match = null;
      const key = keyOf(next);
      if (key) {
        for (let n = cursor; n; n = n.nextSibling) {
          if (n.nodeType === 1 && !n.hasAttribute("data-leaving") && isSame(n, next)) {
            match = n;
            break;
          }
        }
      } else if (cursor && isSame(cursor, next) && !keyOf(cursor)) {
        match = cursor;
      }
      if (match) {
        if (match === cursor) cursor = skipLeaving(cursor.nextSibling);
        else from.insertBefore(match, cursor);
        morphNode(match, next);
      } else {
        from.insertBefore(next, cursor);
      }
    }
    while (cursor) {
      const after = skipLeaving(cursor.nextSibling);
      leave(cursor);
      cursor = after;
    }
  }

  window.morph = function morph(target, html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    morphChildren(target, template.content);
  };
})();
