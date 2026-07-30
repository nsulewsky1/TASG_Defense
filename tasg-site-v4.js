
const CONTACT_EMAIL = "TerminalAppliedSolutionsGroup@proton.me";

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
      "The sender acknowledged that this initial inquiry contains no classified, export-controlled, proprietary, procurement-sensitive, or operationally sensitive information."
    ].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (formStatus) formStatus.textContent = "Opening your email application with a prepared message.";
    window.location.href = mailto;
  });
}

// SNARE Drone Intercept Game
(function () {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;

  const scoreEl = document.getElementById("scoreValue");
  const waveEl = document.getElementById("waveValue");
  const healthEl = document.getElementById("healthValue");
  const gameStateEl = document.getElementById("gameState");
  const leaderboardEl = document.getElementById("leaderboard");
  const startBtn = document.getElementById("gameStart");
  const pauseBtn = document.getElementById("gamePause");
  const resetBtn = document.getElementById("gameReset");

  const ctx = canvas.getContext("2d");
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  const baseWidth = 960;
  const baseHeight = 540;
  canvas.width = baseWidth * DPR;
  canvas.height = baseHeight * DPR;
  ctx.scale(DPR, DPR);

  let memoryLeaderboard = [];

  function readLeaderboard() {
    try {
      const raw = window.localStorage.getItem("tasgDroneGameLeaderboard");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return memoryLeaderboard;
    }
  }

  function writeLeaderboard(entries) {
    memoryLeaderboard = entries;
    try {
      window.localStorage.setItem("tasgDroneGameLeaderboard", JSON.stringify(entries));
      window.localStorage.setItem("tasgGameMinQualify", String(entries[entries.length - 1]?.score || 0));
    } catch {
      // The game still works when storage is unavailable; scores persist only for the current page session.
    }
  }

  const state = {
    running: false,
    paused: false,
    over: false,
    score: 0,
    wave: 1,
    health: 100,
    cooldown: 0,
    time: 0,
    spawnTimer: 0,
    lastFrame: 0,
    reticle: { x: baseWidth / 2, y: baseHeight * 0.35 },
    launcher: { x: baseWidth / 2, y: baseHeight - 58 },
    projectiles: [],
    nets: [],
    drones: [],
    particles: [],
    grenades: []
  };

  function syncHud() {
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (waveEl) waveEl.textContent = String(state.wave);
    if (healthEl) healthEl.textContent = String(Math.max(0, Math.round(state.health)));
    if (gameStateEl) {
      if (state.over) gameStateEl.textContent = "Game over";
      else if (!state.running) gameStateEl.textContent = "Ready";
      else if (state.paused) gameStateEl.textContent = "Paused";
      else gameStateEl.textContent = "Engaged";
    }
  }

  function resetGame() {
    state.running = false;
    state.paused = false;
    state.over = false;
    state.score = 0;
    state.wave = 1;
    state.health = 100;
    state.cooldown = 0;
    state.time = 0;
    state.spawnTimer = 0;
    state.projectiles = [];
    state.nets = [];
    state.drones = [];
    state.particles = [];
    state.grenades = [];
    syncHud();
    draw();
  }

  function startGame() {
    if (state.over) resetGame();
    state.running = true;
    state.paused = false;
    syncHud();
  }

  function pauseGame() {
    if (!state.running || state.over) return;
    state.paused = !state.paused;
    syncHud();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnDrone() {
    const speedScale = 1 + (state.wave - 1) * 0.12;
    const typeRoll = Math.random();
    const drone = {
      x: rand(80, baseWidth - 80),
      y: -30,
      vx: rand(-10, 10) * 0.04,
      vy: rand(48, 76) * speedScale,
      size: rand(16, 22),
      type: typeRoll > 0.74 ? "kamikaze" : "grenadier",
      hp: 1,
      dropCooldown: rand(1.2, 2.8),
      wobble: rand(0, Math.PI * 2)
    };
    state.drones.push(drone);
  }

  function fireProjectile() {
    if (!state.running || state.paused || state.over) return;
    if (state.cooldown > 0) return;
    const dx = state.reticle.x - state.launcher.x;
    const dy = state.reticle.y - state.launcher.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const speed = 460;
    state.projectiles.push({
      x: state.launcher.x,
      y: state.launcher.y,
      vx: dx / length * speed,
      vy: dy / length * speed,
      life: 0,
      maxLife: 0.78,
      targetX: state.reticle.x,
      targetY: state.reticle.y
    });
    state.cooldown = 0.55;
  }

  function createNet(x, y) {
    state.nets.push({ x, y, radius: 12, maxRadius: 72, age: 0, life: 0.58 });
  }

  function destroyDrone(drone, bonus = 10) {
    state.score += bonus;
    for (let i = 0; i < 8; i += 1) {
      state.particles.push({ x: drone.x, y: drone.y, vx: rand(-90, 90), vy: rand(-90, 90), life: rand(0.3, 0.7), color: Math.random() > 0.5 ? "#ef3340" : "#56b7ff" });
    }
  }

  function takeDamage(amount) {
    state.health -= amount;
    if (state.health <= 0) {
      state.health = 0;
      state.over = true;
      state.running = false;
      syncHud();
      saveScore();
    }
  }

  function saveScore() {
    const board = readLeaderboard();
    const minimumQualify = Number(board[board.length - 1]?.score || 0);
    if (state.score <= 0) { renderLeaderboard(); return; }
    if (board.length < 10 || state.score >= minimumQualify) {
      const name = (window.prompt("New score recorded. Enter your name for the top 10:", "Operator") || "Operator").trim().slice(0, 18) || "Operator";
      board.push({ name, score: state.score, wave: state.wave, date: new Date().toISOString().slice(0, 10) });
      board.sort((a, b) => b.score - a.score);
      writeLeaderboard(board.slice(0, 10));
    }
    renderLeaderboard();
  }

  function renderLeaderboard() {
    if (!leaderboardEl) return;
    const board = readLeaderboard();
    if (board.length === 0) {
      leaderboardEl.innerHTML = '<div class="leaderboard-item"><div class="leaderboard-rank">—</div><div class="leaderboard-name">No scores yet</div><div class="leaderboard-score">Launch the simulator</div></div>';
      return;
    }
    leaderboardEl.innerHTML = board.map((entry, index) => `
      <div class="leaderboard-item">
        <div class="leaderboard-rank">${index + 1}</div>
        <div>
          <div class="leaderboard-name">${entry.name}</div>
          <div style="color:var(--muted);font-size:.85rem">Wave ${entry.wave} • ${entry.date}</div>
        </div>
        <div class="leaderboard-score">${entry.score}</div>
      </div>
    `).join("");
  }

  function update(dt) {
    if (!state.running || state.paused || state.over) return;
    state.time += dt;
    state.cooldown = Math.max(0, state.cooldown - dt);

    const targetWave = 1 + Math.floor(state.score / 150);
    state.wave = Math.max(state.wave, targetWave);

    const spawnRate = Math.max(0.34, 1.2 - state.wave * 0.08);
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnDrone();
      if (Math.random() < Math.min(0.15 + state.wave * 0.03, 0.45)) spawnDrone();
      state.spawnTimer = spawnRate;
    }

    state.projectiles = state.projectiles.filter((projectile) => {
      projectile.life += dt;
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      if (projectile.life >= projectile.maxLife || projectile.y < 0 || projectile.x < -50 || projectile.x > baseWidth + 50) {
        createNet(projectile.x, projectile.y);
        return false;
      }
      return true;
    });

    state.nets = state.nets.filter((net) => {
      net.age += dt;
      net.radius = Math.min(net.maxRadius, net.radius + 160 * dt);
      state.drones = state.drones.filter((drone) => {
        if (Math.hypot(drone.x - net.x, drone.y - net.y) <= net.radius) {
          destroyDrone(drone, drone.type === "kamikaze" ? 18 : 12);
          return false;
        }
        return true;
      });
      return net.age < net.life;
    });

    state.drones = state.drones.filter((drone) => {
      drone.wobble += dt * 4;
      const baseTargetX = drone.type === "kamikaze" ? state.launcher.x : drone.x + Math.sin(drone.wobble) * 28;
      const dx = baseTargetX - drone.x;
      drone.x += (dx * 0.35 + drone.vx) * dt;
      drone.y += drone.vy * dt;
      drone.dropCooldown -= dt;

      if (drone.type === "grenadier" && drone.dropCooldown <= 0 && drone.y > 120) {
        state.grenades.push({ x: drone.x, y: drone.y + 10, vy: rand(120, 160), radius: 6 });
        drone.dropCooldown = rand(2.2, 3.6);
      }

      if (drone.type === "kamikaze" && drone.y >= state.launcher.y - 12 && Math.abs(drone.x - state.launcher.x) < 44) {
        destroyDrone(drone, 0);
        takeDamage(18);
        return false;
      }

      if (drone.y > baseHeight + 40) {
        takeDamage(drone.type === "kamikaze" ? 14 : 8);
        return false;
      }
      return true;
    });

    state.grenades = state.grenades.filter((grenade) => {
      grenade.y += grenade.vy * dt;
      if (grenade.y >= state.launcher.y - 10 && Math.abs(grenade.x - state.launcher.x) < 64) {
        takeDamage(10);
        for (let i = 0; i < 10; i += 1) {
          state.particles.push({ x: grenade.x, y: state.launcher.y - 12, vx: rand(-100, 100), vy: rand(-120, 20), life: rand(0.25, 0.6), color: "#ef3340" });
        }
        return false;
      }
      return grenade.y <= baseHeight + 12;
    });

    state.particles = state.particles.filter((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.985;
      particle.vy = particle.vy * 0.985 + 30 * dt;
      return particle.life > 0;
    });

    syncHud();
  }

  function drawQuadcopter(x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, 0);
    ctx.lineTo(size * 0.5, 0);
    ctx.moveTo(-size * 0.22, -size * 0.22);
    ctx.lineTo(size * 0.22, size * 0.22);
    ctx.moveTo(size * 0.22, -size * 0.22);
    ctx.lineTo(-size * 0.22, size * 0.22);
    ctx.stroke();
    ctx.strokeRect(-size * 0.18, -size * 0.18, size * 0.36, size * 0.36);
    [-size * 0.68, size * 0.68].forEach((cx) => {
      [-size * 0.55, size * 0.55].forEach((cy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.24, 0, Math.PI * 2);
        ctx.stroke();
      });
    });
    ctx.restore();
  }

  function drawNet(x, y, radius, alpha = 1) {
    ctx.save();
    ctx.strokeStyle = `rgba(216,190,160,${0.85 * alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i += 1) {
      const a = (Math.PI * 2 / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, baseWidth, baseHeight);

    // sky gradient and terrain
    const grad = ctx.createLinearGradient(0, 0, 0, baseHeight);
    grad.addColorStop(0, "#0b1621");
    grad.addColorStop(1, "#0a1218");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // grid
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= baseWidth; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, baseHeight); ctx.stroke();
    }
    for (let y = 0; y <= baseHeight; y += 48) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(baseWidth, y); ctx.stroke();
    }
    ctx.restore();

    // friendly positions
    [{x:180,y:470},{x:280,y:430},{x:720,y:448}].forEach((node) => {
      ctx.fillStyle = "rgba(86,183,255,.25)";
      ctx.beginPath(); ctx.arc(node.x, node.y, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#56b7ff";
      ctx.beginPath(); ctx.arc(node.x, node.y, 6, 0, Math.PI * 2); ctx.fill();
    });

    // base/launcher
    ctx.fillStyle = "#d8bea0";
    ctx.fillRect(state.launcher.x - 22, state.launcher.y - 8, 44, 18);
    ctx.fillRect(state.launcher.x - 8, state.launcher.y - 38, 16, 36);
    ctx.beginPath();
    ctx.moveTo(state.launcher.x - 34, state.launcher.y + 10);
    ctx.lineTo(state.launcher.x + 34, state.launcher.y + 10);
    ctx.lineTo(state.launcher.x + 52, state.launcher.y + 28);
    ctx.lineTo(state.launcher.x - 52, state.launcher.y + 28);
    ctx.closePath();
    ctx.fillStyle = "#16202a";
    ctx.fill();

    // line to reticle
    ctx.strokeStyle = "rgba(216,190,160,.35)";
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(state.launcher.x, state.launcher.y - 32);
    ctx.lineTo(state.reticle.x, state.reticle.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // projectiles and nets
    state.projectiles.forEach((projectile) => {
      ctx.fillStyle = "#d8bea0";
      ctx.beginPath(); ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2); ctx.fill();
    });
    state.nets.forEach((net) => drawNet(net.x, net.y, net.radius, 1 - net.age / net.life));

    // drones
    state.drones.forEach((drone) => {
      drawQuadcopter(drone.x, drone.y, drone.size, drone.type === "kamikaze" ? "#ff5b66" : "#ef3340");
      if (drone.type === "kamikaze") {
        ctx.fillStyle = "rgba(239,51,64,.12)";
        ctx.beginPath(); ctx.arc(drone.x, drone.y, 18, 0, Math.PI * 2); ctx.fill();
      }
    });

    // grenades
    state.grenades.forEach((grenade) => {
      ctx.fillStyle = "#ef3340";
      ctx.beginPath(); ctx.arc(grenade.x, grenade.y, grenade.radius, 0, Math.PI * 2); ctx.fill();
    });

    // particles
    state.particles.forEach((particle) => {
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, particle.life * 1.7));
      ctx.beginPath(); ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });

    // reticle
    ctx.strokeStyle = state.cooldown > 0 ? "rgba(239,51,64,.75)" : "rgba(86,183,255,.8)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(state.reticle.x, state.reticle.y, 18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(state.reticle.x - 28, state.reticle.y); ctx.lineTo(state.reticle.x + 28, state.reticle.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(state.reticle.x, state.reticle.y - 28); ctx.lineTo(state.reticle.x, state.reticle.y + 28); ctx.stroke();

    // overlay text
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "700 12px Inter, sans-serif";
    ctx.fillText("SNARE INTERCEPT TRAINING SIMULATOR", 20, 26);
    ctx.fillStyle = "rgba(86,183,255,.95)";
    ctx.fillText("FRIENDLY POSITIONS", 20, baseHeight - 18);
    ctx.fillStyle = "rgba(239,51,64,.95)";
    ctx.fillText("HOSTILE FPV QUADCOPTERS", baseWidth - 210, 26);

    if (!state.running && !state.over) {
      ctx.fillStyle = "rgba(7,10,13,.62)";
      ctx.fillRect(0, 0, baseWidth, baseHeight);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "800 28px Inter, sans-serif";
      ctx.fillText("Click Start Mission", baseWidth / 2, baseHeight / 2 - 18);
      ctx.font = "500 16px Inter, sans-serif";
      ctx.fillText("Move your mouse to aim. Click or press Space to fire a net. Stop drones before they reach the position.", baseWidth / 2, baseHeight / 2 + 18);
      ctx.textAlign = "left";
    }

    if (state.paused) {
      ctx.fillStyle = "rgba(7,10,13,.56)";
      ctx.fillRect(0, 0, baseWidth, baseHeight);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "800 34px Inter, sans-serif";
      ctx.fillText("Paused", baseWidth / 2, baseHeight / 2);
      ctx.textAlign = "left";
    }

    if (state.over) {
      ctx.fillStyle = "rgba(7,10,13,.68)";
      ctx.fillRect(0, 0, baseWidth, baseHeight);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "800 34px Inter, sans-serif";
      ctx.fillText("Position Overrun", baseWidth / 2, baseHeight / 2 - 16);
      ctx.font = "500 18px Inter, sans-serif";
      ctx.fillText(`Final score: ${state.score} • Wave ${state.wave}`, baseWidth / 2, baseHeight / 2 + 20);
      ctx.fillText("Press Start Mission to run again.", baseWidth / 2, baseHeight / 2 + 50);
      ctx.textAlign = "left";
    }
  }

  function loop(timestamp) {
    if (!state.lastFrame) state.lastFrame = timestamp;
    const dt = Math.min(0.033, (timestamp - state.lastFrame) / 1000);
    state.lastFrame = timestamp;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function updatePointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    state.reticle.x = (event.clientX - rect.left) / rect.width * baseWidth;
    state.reticle.y = (event.clientY - rect.top) / rect.height * baseHeight;
  }

  canvas.addEventListener("pointermove", (event) => {
    updatePointerPosition(event);
  });
  canvas.addEventListener("pointerdown", (event) => {
    updatePointerPosition(event);
    fireProjectile();
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") { event.preventDefault(); fireProjectile(); }
    if (event.key.toLowerCase() === "p") pauseGame();
  });

  startBtn?.addEventListener("click", startGame);
  pauseBtn?.addEventListener("click", pauseGame);
  resetBtn?.addEventListener("click", () => { resetGame(); renderLeaderboard(); });

  renderLeaderboard();
  resetGame();
  requestAnimationFrame(loop);
})();
