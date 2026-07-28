const CONTACT_EMAIL = "TerminalAppliedSolutionsGroup@proton.me";

const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const aura = document.getElementById("cursorAura");
const yearElements = document.querySelectorAll("[data-current-year]");
const revealElements = document.querySelectorAll(".reveal");

function setMenuState(isOpen) {
  if (!menuButton || !mobileMenu) return;

  menuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("nav-open", isOpen);

  if (isOpen) {
    const firstLink = mobileMenu.querySelector("a");
    firstLink?.focus();
  } else {
    menuButton.focus({ preventScroll: true });
  }
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120 && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
    }
  });
}

if (aura && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      aura.style.left = `${event.clientX}px`;
      aura.style.top = `${event.clientY}px`;
      aura.style.opacity = "1";
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    aura.style.opacity = "0";
  });
}

yearElements.forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealElements.forEach((element) => element.classList.add("reveal-ready"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element) => observer.observe(element));
}

const copyButtons = document.querySelectorAll("[data-copy-email]");
copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const statusId = button.getAttribute("aria-describedby");
    const status = statusId ? document.getElementById(statusId) : null;

    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      if (status) status.textContent = "TASG email copied.";
    } catch (error) {
      if (status) status.textContent = CONTACT_EMAIL;
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
    const category = String(data.get("category") || "General");
    const organization = String(data.get("organization") || "Independent");
    const subject = `TASG ${category} Inquiry — ${organization}`;
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
      "The sender acknowledged that this initial inquiry contains no classified, export-controlled, proprietary, or operationally sensitive information."
    ].join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (formStatus) {
      formStatus.textContent = "Opening your email application with a prepared message. Review it before sending.";
    }

    window.location.href = mailto;
  });
}
