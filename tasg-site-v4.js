
const CONTACT_EMAIL = "Nick@tasgdefense.com";

const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (header) {
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setMenuState(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("nav-open", open);
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!open);
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1140) setMenuState(false);
  });
}

document.querySelectorAll("[data-current-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});


document.querySelectorAll("[data-reveal]").forEach((el) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-visible");
    return;
  }
  document.documentElement.classList.add("js-reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
  observer.observe(el);
});


document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.getAttribute("aria-describedby");
    const target = targetId ? document.getElementById(targetId) : null;
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      if (target) target.textContent = "TASG email copied to your clipboard.";
    } catch {
      if (target) target.textContent = CONTACT_EMAIL;
    }
  });
});

const inquiryForm = document.getElementById("inquiryForm");
if (inquiryForm) {
  const formStatus = document.getElementById("formStatus");
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!inquiryForm.reportValidity()) return;
    const data = new FormData(inquiryForm);
    const category = String(data.get("category") || "General Inquiry");
    const organization = String(data.get("organization") || "Independent");
    const subject = `TASG ${category} Inquiry - ${organization}`;
    const body = [
      `Engagement category: ${category}`,
      `Name: ${data.get("name") || ""}`,
      `Organization: ${organization}`,
      `Role / title: ${data.get("role") || ""}`,
      `Work email: ${data.get("email") || ""}`,
      "",
      "Nonproprietary message:",
      String(data.get("message") || ""),
      "",
      "The sender acknowledged that this initial inquiry contains no classified, export-controlled, proprietary, procurement-sensitive, or operationally sensitive information."
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formStatus) formStatus.textContent = "Opening your email application with a prepared message.";
    window.location.href = mailto;
  });
}
