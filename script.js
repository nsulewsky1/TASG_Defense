const header = document.getElementById('siteHeader');
const aura = document.getElementById('cursorAura');
const modal = document.getElementById('accessModal');
const copyButton = document.getElementById('copyContactInstruction');
const copyStatus = document.getElementById('copyStatus');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

window.addEventListener('pointermove', (event) => {
  aura.style.left = `${event.clientX}px`;
  aura.style.top = `${event.clientY}px`;
  aura.style.opacity = '1';
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

function openAccessModal() {
  modal.showModal();
  document.body.classList.add('modal-open');
}

function closeAccessModal() {
  modal.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('[data-open-access]').forEach((button) => {
  button.addEventListener('click', openAccessModal);
});

document.querySelectorAll('[data-close-access]').forEach((button) => {
  button.addEventListener('click', closeAccessModal);
});

modal.addEventListener('click', (event) => {
  const bounds = modal.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) closeAccessModal();
});

copyButton.addEventListener('click', async () => {
  const instruction = 'In script.js, replace the preview modal behavior with the preferred TASG mailto address, secure contact form URL, or approved intake workflow.';
  try {
    await navigator.clipboard.writeText(instruction);
    copyStatus.textContent = 'Setup instruction copied.';
  } catch {
    copyStatus.textContent = instruction;
  }
});
