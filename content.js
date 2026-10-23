// Accordion behaviour for the legacy FAQ markup used on content pages.
document.querySelectorAll(".faq-item").forEach(function (item) {
  var q = item.querySelector(".faq-question");
  if (!q) return;
  q.setAttribute("tabindex", "0");
  q.setAttribute("role", "button");
  function toggle() {
    var open = item.classList.toggle("active");
    q.setAttribute("aria-expanded", String(open));
  }
  q.addEventListener("click", toggle);
  q.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});
