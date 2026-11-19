(function () {
  var views = ["home", "about", "projects", "contact"];
  var navBtns = document.querySelectorAll("nav button");

  function show(id, push) {
    if (views.indexOf(id) < 0) id = "home";
    views.forEach(function (v) { document.getElementById(v).classList.toggle("active", v === id) });
    navBtns.forEach(function (b) {
      if (b.dataset.go === id) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    document.title = (id === "home" ? "Jepherson I. Tunghay" : id.charAt(0).toUpperCase() + id.slice(1) + " – Jepherson I. Tunghay") + " – Portfolio";
    if (push && location.hash !== "#" + id) location.hash = id;
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-go]");
    if (t) { e.preventDefault(); show(t.dataset.go, true); }
  });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), false) });
  show(location.hash.slice(1), false);

  /* project filter */
  var fbtns = document.querySelectorAll("[data-filter]");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false") });
      document.querySelectorAll(".card").forEach(function (c) {
        c.hidden = !(b.dataset.filter === "all" || c.dataset.type === b.dataset.filter);
      });
    });
  });

  /* contact form */
  var form = document.getElementById("form");
  function setErr(id, msg) { document.getElementById("e-" + id).textContent = msg; return !msg; }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var n = document.getElementById("name").value.trim();
    var m = document.getElementById("email").value.trim();
    var t = document.getElementById("msg").value.trim();

    var ok = true;

    // Validate name
    ok = setErr("name", n ? "" : "Enter your name.") && ok;

    // Validate email
    ok = setErr(
      "email",
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)
        ? ""
        : "Enter a valid email, like name@example.com."
    ) && ok;

    // Validate message
    ok = setErr(
      "msg",
      t.length >= 10 ? "" : "Write at least 10 characters."
    ) && ok;

    var s = document.getElementById("status");

    if (!ok) {
      s.textContent = "";
      return;
    }

    // Send message through Web3Forms
    var button = form.querySelector('button[type="submit"]');

    button.disabled = true;
    button.textContent = "Sending...";
    s.textContent = "";

    try {
      var formData = new FormData(form);

      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (result.success) {
        s.textContent = "Message sent successfully! Thank you.";
        form.reset();

        // Clear validation messages
        setErr("name", "");
        setErr("email", "");
        setErr("msg", "");

      } else {
        s.textContent = "Error: " + (result.message || "Unknown error");
      }

    } catch (error) {
      s.textContent = "Something went wrong. Please try again.";
    }

    button.disabled = false;
    button.textContent = "Send message";
  });


  /* theme toggle */
  var root = document.documentElement;
  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  });
})();
