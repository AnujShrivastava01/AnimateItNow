/**
 * Live editor — HTML / CSS / JS in tabs with a sandboxed live preview.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "animateItNowCode";

  var STARTER = {
    html:
      '<div class="stage">\n' +
      '  <h1>Welcome to AnimateItNow</h1>\n' +
      '  <div class="box"></div>\n' +
      '  <button id="animateBtn">Animate</button>\n' +
      '</div>',
    css:
      'body {\n' +
      '  margin: 0;\n' +
      '  min-height: 100vh;\n' +
      '  display: grid;\n' +
      '  place-items: center;\n' +
      '  font-family: system-ui, sans-serif;\n' +
      '  background: linear-gradient(135deg, #6366f1, #8b5cf6);\n' +
      '}\n\n' +
      '.stage {\n' +
      '  display: grid;\n' +
      '  gap: 24px;\n' +
      '  justify-items: center;\n' +
      '  padding: 40px;\n' +
      '  text-align: center;\n' +
      '  color: #fff;\n' +
      '}\n\n' +
      '.box {\n' +
      '  width: 96px;\n' +
      '  height: 96px;\n' +
      '  border-radius: 24px;\n' +
      '  background: #fff;\n' +
      '  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.6s;\n' +
      '}\n\n' +
      '.box.animated {\n' +
      '  transform: rotate(180deg) scale(1.3);\n' +
      '  border-radius: 50%;\n' +
      '}\n\n' +
      'button {\n' +
      '  padding: 12px 28px;\n' +
      '  font: 600 1rem system-ui, sans-serif;\n' +
      '  color: #4338ca;\n' +
      '  background: #fff;\n' +
      '  border: 0;\n' +
      '  border-radius: 999px;\n' +
      '  cursor: pointer;\n' +
      '}',
    js:
      "document.getElementById('animateBtn').addEventListener('click', function () {\n" +
      "  document.querySelector('.box').classList.toggle('animated');\n" +
      "});"
  };

  var areas = {
    html: document.getElementById("htmlCode"),
    css: document.getElementById("cssCode"),
    js: document.getElementById("jsCode")
  };
  var output = document.getElementById("output");
  var autoRun = document.getElementById("autoRun");
  var tabs = document.querySelectorAll(".tab");
  var active = "html";
  var timer;

  function load() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    Object.keys(areas).forEach(function (k) {
      areas[k].value = saved && typeof saved[k] === "string" ? saved[k] : STARTER[k];
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ html: areas.html.value, css: areas.css.value, js: areas.js.value }));
    } catch (e) {}
  }

  function run() {
    // Escape closing script tags so user code can't break out of the wrapper.
    var js = areas.js.value.replace(/<\/script/gi, "<\\/script");
    output.srcdoc =
      "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><style>" +
      areas.css.value +
      "</style></head><body>" +
      areas.html.value +
      "<script>" + js + "<\/script></body></html>";
  }

  function schedule() {
    save();
    if (!autoRun.checked) return;
    clearTimeout(timer);
    timer = setTimeout(run, 350);
  }

  function switchTab(name) {
    active = name;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });
    Object.keys(areas).forEach(function (k) { areas[k].hidden = k !== name; });
    areas[name].focus();
  }

  tabs.forEach(function (t) { t.addEventListener("click", function () { switchTab(t.dataset.tab); }); });

  Object.keys(areas).forEach(function (k) {
    areas[k].addEventListener("input", schedule);
    // Tab key inserts two spaces instead of leaving the editor.
    areas[k].addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || e.shiftKey) return;
      e.preventDefault();
      var el = e.target, s = el.selectionStart;
      el.value = el.value.slice(0, s) + "  " + el.value.slice(el.selectionEnd);
      el.selectionStart = el.selectionEnd = s + 2;
      schedule();
    });
  });

  document.getElementById("runBtn").addEventListener("click", run);
  document.getElementById("refreshBtn").addEventListener("click", run);

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!window.confirm("Reset all code to the starter example?")) return;
    Object.keys(areas).forEach(function (k) { areas[k].value = STARTER[k]; });
    save();
    run();
  });

  var copyBtn = document.getElementById("copyBtn");
  copyBtn.addEventListener("click", function () {
    var text = areas[active].value;
    var done = function () {
      var label = copyBtn.querySelector("span");
      label.textContent = "Copied!";
      setTimeout(function () { label.textContent = "Copy"; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done);
    else { areas[active].select(); document.execCommand("copy"); done(); }
  });

  var fsBtn = document.getElementById("fullscreenBtn");
  fsBtn.addEventListener("click", function () {
    if (!document.fullscreenElement) output.requestFullscreen && output.requestFullscreen().catch(function () {});
    else document.exitFullscreen();
  });
  document.addEventListener("fullscreenchange", function () {
    fsBtn.firstElementChild.className = document.fullscreenElement ? "fas fa-compress" : "fas fa-expand";
  });

  load();
  run();
})();
