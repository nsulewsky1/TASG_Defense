const contactEmail = "TerminalAppliedSolutionsGroup@proton.me";
const emailSubject = "Private TASG Inquiry";
const mailtoUrl =
  `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}`;

const header = document.getElementById("siteHeader");
const aura = document.getElementById("cursorAura");
const modal = document.getElementById("accessModal");
const copyStatus = document.getElementById("copyStatus");
const yearElement = document.getElementById("year");

/* Header effect */

if (header) {
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}

/* Cursor glow */

if (aura) {
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

/* Scroll reveal */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.13
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* Automatic copyright year */

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Private inquiry modal */

if (modal) {
  const modalActions = modal.querySelector(".modal-actions");

  const descriptionParagraph = modal.querySelector(
    "p:not(.eyebrow):not(.contact-email):not(.copy-status)"
  );

  if (descriptionParagraph) {
    descriptionParagraph.textContent =
      "Qualified partners and mission organizations may contact TASG directly. Initial inquiries should avoid controlled, proprietary, export-restricted, or operationally sensitive information.";
  }

  /* Create or update visible email address */

  let contactEmailBlock = modal.querySelector(".contact-email");

  if (!contactEmailBlock) {
    contactEmailBlock = document.createElement("p");
    contactEmailBlock.className = "contact-email";

    if (modalActions) {
      modal.insertBefore(contactEmailBlock, modalActions);
    }
  }

  if (contactEmailBlock) {
    contactEmailBlock.innerHTML = "";

    const emailLink = document.createElement("a");
    emailLink.href = mailtoUrl;
    emailLink.textContent = contactEmail;

    contactEmailBlock.appendChild(emailLink);
  }

  /* Create email button if the older HTML does not contain one */

  if (
    modalActions &&
    !modalActions.querySelector('a[href^="mailto:"]')
  ) {
    const emailButton = document.createElement("a");

    emailButton.className = "button button-primary";
    emailButton.href = mailtoUrl;
    emailButton.innerHTML = "Email TASG <span>↗</span>";

    modalActions.prepend(emailButton);
  }

  /* Support either the old or new copy-button ID */

  const copyButton =
    document.getElementById("copyContactEmail") ||
    document.getElementById("copyContactInstruction");

  if (copyButton) {
    copyButton.id = "copyContactEmail";
    copyButton.textContent = "Copy email";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(contactEmail);

        if (copyStatus) {
          copyStatus.textContent = "TASG email copied.";
        }
      } catch (error) {
        if (copyStatus) {
          copyStatus.textContent = contactEmail;
        }
      }
    });
  }

  const openAccessModal = () => {
    if (!modal.open) {
      modal.showModal();
    }

    document.body.classList.add("modal-open");
  };

  const closeAccessModal = () => {
    if (modal.open) {
      modal.close();
    }

    document.body.classList.remove("modal-open");
  };

  document
    .querySelectorAll("[data-open-access]")
    .forEach((button) => {
      button.addEventListener("click", openAccessModal);
    });

  document
    .querySelectorAll("[data-close-access]")
    .forEach((button) => {
      button.addEventListener("click", closeAccessModal);
    });

  modal.addEventListener("click", (event) => {
    const bounds = modal.getBoundingClientRect();

    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedOutside) {
      closeAccessModal();
    }
  });

  modal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });

  modal.addEventListener("cancel", () => {
    document.body.classList.remove("modal-open");
  });
}
