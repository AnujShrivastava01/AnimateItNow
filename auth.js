/**
 * Authentication screens (login, sign up, reset password).
 * There is no backend yet: submissions are validated client-side and the
 * success path is simulated before sending the visitor back to the home page.
 */
(function () {
  "use strict";
  var form = document.querySelector(".auth__form");
  if (!form) return;
  var mode = form.dataset.auth;
  var status = document.getElementById("authStatus");

  // Show / hide password
  document.querySelectorAll(".pw-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.dataset.toggle);
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.firstElementChild.className = show ? "far fa-eye-slash" : "far fa-eye";
    });
  });

  function setError(id, message) {
    var input = document.getElementById(id);
    var out = document.getElementById(id + "Error");
    if (!input || !out) return;
    out.textContent = message || "";
    input.closest(".field").classList.toggle("has-error", !!message);
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  var rules = {
    name: function (v) { return v.length < 2 ? "Please enter your full name." : ""; },
    email: function (v) {
      if (!v) return "Email is required.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
    },
    password: function (v) {
      if (!v) return "Password is required.";
      return v.length < 6 ? "Password must be at least 6 characters." : "";
    },
    confirmPassword: function (v) {
      return v !== document.getElementById("password").value ? "Passwords do not match." : "";
    }
  };

  function validate(id) {
    var input = document.getElementById(id);
    if (!input || !rules[id]) return true;
    var msg = rules[id](input.value.trim());
    setError(id, msg);
    return !msg;
  }

  form.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("blur", function () { if (input.value) validate(input.id); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validate(input.id);
    });
  });

  var messages = {
    login: "Signed in — redirecting…",
    signup: "Account created — redirecting…",
    forgot: "Password updated — redirecting to log in…"
  };
  var destination = { login: "index.html", signup: "index.html", forgot: "loginpage.html" };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ids = Array.prototype.map.call(form.querySelectorAll("input"), function (i) { return i.id; });
    var ok = ids.map(validate).every(Boolean);
    if (!ok) {
      var first = form.querySelector(".has-error input");
      if (first) first.focus();
      return;
    }
    var btn = form.querySelector(".auth__submit");
    btn.disabled = true;
    btn.querySelector(".btn__label").hidden = true;
    btn.querySelector(".btn__spin").hidden = false;
    setTimeout(function () {
      status.textContent = messages[mode];
      status.classList.add("is-ok");
      setTimeout(function () { window.location.href = destination[mode]; }, 900);
    }, 900);
  });
})();
