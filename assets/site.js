(function () {
  var KIT_FORM_ID = "";

  // Subscribe panel toggle (edition pages)
  var toggle = document.querySelector("[data-sub-toggle]");
  var panel = document.getElementById("sub-panel");
  if (toggle && panel) {
    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) { var i = panel.querySelector("input"); if (i) i.focus(); }
    }
    toggle.addEventListener("click", function () { setOpen(panel.hidden); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) setOpen(false);
    });
  }

  // Subscribe forms -> Kit
  document.querySelectorAll("[data-subscribe]").forEach(function (form) {
    var msg = form.querySelector(".sub-msg");
    var btn = form.querySelector("button");
    function say(text, cls) { msg.textContent = text; msg.className = "sub-msg " + (cls || ""); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector("input").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say("Please enter a valid email address.", "err"); return; }
      if (!KIT_FORM_ID) { say("Subscriptions open very soon. Check back next week.", "err"); return; }
      btn.disabled = true; say("Subscribing…");
      var body = new FormData(); body.append("email_address", email);
      fetch("https://app.kit.com/forms/" + KIT_FORM_ID + "/subscriptions", { method: "POST", body: body, mode: "no-cors" })
        .then(function () { say("Thanks! Check your inbox to confirm your subscription.", "ok"); form.querySelector("input").value = ""; })
        .catch(function () { say("Something went wrong. Please try again.", "err"); })
        .finally(function () { btn.disabled = false; });
    });
  });
})();
