  (() => {
    const BETA_CODES = ["4949", "148", "312"];
    const BETA_KEY = "tomasekBetaUnlocked";
    const DEVICE_KEY = "tomasekDevice";
    const SETTINGS_KEY = "tomasekSettings";
    const SCORES_KEY = "tomasekScores";

    const state = {
      device: localStorage.getItem(DEVICE_KEY) || "pc",
      settings: loadSettings(),
      scores: JSON.parse(localStorage.getItem(SCORES_KEY) || "{}"),
      current: null,
      raf: 0,
      running: false,
      engine: null,
    };

    function loadSettings() {
      return Object.assign({
        sound: true,
        difficulty: "normal",
        pcZoom: true,
        particles: true,
      }, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
    }
    function saveSettings() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    }
    function saveScores() {
      localStorage.setItem(SCORES_KEY, JSON.stringify(state.scores));
    }

    const $ = (id) => document.getElementById(id);
    const canvas = $("gameCanvas");
    const ctx = canvas.getContext("2d");
    const domGame = $("domGame");
    const touchPad = $("touchPad");

    function showScreen(id) {
      ["betaScreen", "deviceScreen", "hubScreen"].forEach((s) => $(s).classList.remove("active"));
      $("playerScreen").classList.remove("active");
      if (id === "playerScreen") $("playerScreen").classList.add("active");
      else $(id).classList.add("active");
    }

    function setViewportForDevice() {
      const meta = $("viewportMeta");
      const mobile = state.device === "mobile";
      document.body.classList.toggle("device-mobile", mobile);
      document.body.classList.toggle("no-zoom", mobile);
      if (mobile) {
        meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover");
      } else if (state.settings.pcZoom) {
        meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes");
      } else {
        meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
      }
      $("deviceChip").textContent = state.device.toUpperCase();
    }

    function diffMul() {
      return state.settings.difficulty === "easy" ? 0.75 : state.settings.difficulty === "hard" ? 1.35 : 1;
    }

    function beep(kind = "ok") {
      if (!state.settings.sound) return;
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.value = kind === "bad" ? 140 : kind === "win" ? 660 : 420;
        g.gain.value = 0.04;
        o.start();
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.12);
        o.stop(ac.currentTime + 0.13);
        setTimeout(() => ac.close(), 200);
      } catch (_) {}
    }

    function setScore(n) {
      $("liveScore").textContent = String(Math.floor(n));
    }
    function setBest(id, n) {
      const best = Math.max(state.scores[id] || 0, Math.floor(n));
      state.scores[id] = best;
      saveScores();
      $("bestScore").textContent = String(best);
    }

    /* ---------- Games catalog ---------- */
    const GAMES = [
      { id: "flappy", name: "Flappy Duck", emoji: "🦆", blurb: "Tap / space to flap past pipes.", type: "canvas", pad: "one" },
      { id: "snake", name: "Neon Snake", emoji: "🐍", blurb: "Eat orbs. Don't hit yourself.", type: "canvas", pad: "dir", wide: true },
      { id: "pong", name: "Pulse Pong", emoji: "🏓", blurb: "Keep the pulse alive.", type: "canvas", pad: "dir", wide: true },
      { id: "breakout", name: "Brick Pulse", emoji: "🧱", blurb: "Break every brick.", type: "canvas", pad: "dir", wide: true },
      { id: "dodge", name: "Asteroid Dodge", emoji: "☄️", blurb: "Survive the swarm.", type: "canvas", pad: "dir" },
      { id: "catcher", name: "Orb Catch", emoji: "✨", blurb: "Catch falling orbs.", type: "canvas", pad: "dir", wide: true },
      { id: "runner", name: "Dash Runner", emoji: "🏃", blurb: "Jump the gaps forever.", type: "canvas", pad: "one", wide: true },
      { id: "shooter", name: "Sky Blaster", emoji: "🚀", blurb: "Blast incoming targets.", type: "canvas", pad: "dir" },
      { id: "reaction", name: "Reaction Lab", emoji: "⚡", blurb: "Tap when it flashes.", type: "canvas", pad: "one", wide: true },
      { id: "stack", name: "Stack Drop", emoji: "📦", blurb: "Time the drop. Build high.", type: "canvas", pad: "one" },
      { id: "whack", name: "Tap Targets", emoji: "🎯", blurb: "Hit targets before they fade.", type: "canvas", pad: "one", wide: true },
      { id: "memory", name: "Memory Match", emoji: "🧠", blurb: "Find all pairs.", type: "dom", pad: "none" },
      { id: "ttt", name: "Tic Tac Toe", emoji: "⭕", blurb: "Beat the bot.", type: "dom", pad: "none" },
      { id: "merge", name: "Merge 2048", emoji: "🔢", blurb: "Swipe or arrow keys.", type: "dom", pad: "dir", wide: true },
      { id: "aim", name: "Precision Aim", emoji: "🏹", blurb: "Hit the moving mark.", type: "canvas", pad: "one", wide: true },
    ];

    function renderGrid() {
      $("gamesGrid").innerHTML = GAMES.map((g) => `
        <button type="button" class="game-card" data-id="${g.id}">
          <div>
            <div class="game-emoji">${g.emoji}</div>
            <h3>${g.name}</h3>
            <p>${g.blurb}</p>
          </div>
          <div class="game-meta">best ${state.scores[g.id] || 0}</div>
        </button>
      `).join("");
      $("gamesGrid").querySelectorAll(".game-card").forEach((btn) => {
        btn.addEventListener("click", () => openGame(btn.dataset.id));
      });
    }

    /* ---------- Engine helpers ---------- */
    function clearEngine() {
      state.running = false;
      cancelAnimationFrame(state.raf);
      state.engine = null;
      window.onkeydown = null;
      canvas.onclick = null;
      canvas.onpointerdown = null;
      canvas.onpointermove = null;
      canvas.onpointerup = null;
      domGame.style.display = "none";
      canvas.style.display = "block";
      domGame.innerHTML = "";
    }

    function rand(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function openGame(id) {
      const meta = GAMES.find((g) => g.id === id);
      if (!meta) return;
      clearEngine();
      state.current = meta;
      $("playerTitle").textContent = meta.name;
      $("bestScore").textContent = String(state.scores[id] || 0);
      setScore(0);
      canvas.classList.toggle("wide", !!meta.wide);
      $("controlHint").textContent = meta.blurb + (state.device === "pc"
        ? " · Keyboard / click"
        : " · Use the touch controls");

      // touch pad layout
      if (meta.pad === "none") {
        touchPad.style.display = "none";
      } else {
        touchPad.style.display = "";
        touchPad.className = "touch-pad " + (meta.pad === "dir" ? "dir" : "one");
        if (meta.pad === "dir") {
          touchPad.innerHTML = `
            <button type="button" class="touch-btn up" data-act="up">▲</button>
            <button type="button" class="touch-btn left" data-act="left">◀</button>
            <button type="button" class="touch-btn action" data-act="action">●</button>
            <button type="button" class="touch-btn right" data-act="right">▶</button>`;
        } else {
          touchPad.innerHTML = `<button type="button" class="touch-btn" data-act="action">TAP / ACTION</button>`;
        }
      }

      showScreen("playerScreen");
      startGame(id);
    }

    function startGame(id) {
      clearEngine();
      state.running = true;
      const starters = {
        flappy: startFlappy,
        snake: startSnake,
        pong: startPong,
        breakout: startBreakout,
        dodge: startDodge,
        catcher: startCatcher,
        runner: startRunner,
        shooter: startShooter,
        reaction: startReaction,
        stack: startStack,
        whack: startWhack,
        memory: startMemory,
        ttt: startTtt,
        merge: startMerge,
        aim: startAim,
      };
      starters[id]();
    }

    function bindAction(fn) {
      const fire = (e) => { e && e.preventDefault && e.preventDefault(); fn(); };
      window.onkeydown = (e) => {
        if (["Space", "ArrowUp", "KeyW", "Enter"].includes(e.code)) fire(e);
      };
      canvas.onclick = fire;
      canvas.onpointerdown = (e) => { e.preventDefault(); fire(e); };
      touchPad.onclick = (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        if (btn.dataset.act === "action" || btn.dataset.act === "up") fire(e);
      };
    }

    function bindDirs(onDir, onAction) {
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right", Space: "action" };
      window.onkeydown = (e) => {
        const d = map[e.code];
        if (!d) return;
        e.preventDefault();
        if (d === "action") onAction && onAction();
        else onDir && onDir(d);
      };
      touchPad.onclick = (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        if (btn.dataset.act === "action") onAction && onAction();
        else onDir && onDir(btn.dataset.act);
      };
    }

    /* ===== FLAPPY DUCK ===== */
    function startFlappy() {
      const W = canvas.width, H = canvas.height;
      let bird = { x: 80, y: H / 2, v: 0 }, pipes = [], score = 0, dead = false, t = 0;
      const grav = 0.35 * diffMul(), gap = 130 / Math.sqrt(diffMul());
      const flap = () => { if (!dead) { bird.v = -6.2; beep(); } else { startFlappy(); } };
      bindAction(flap);
      function spawn() {
        const top = rand(60, H - gap - 80);
        pipes.push({ x: W + 20, top, gap, passed: false });
      }
      spawn();
      function loop() {
        if (!state.running) return;
        t++;
        ctx.fillStyle = "#0b1220"; ctx.fillRect(0, 0, W, H);
        // ground
        ctx.fillStyle = "#122018"; ctx.fillRect(0, H - 28, W, 28);
        if (!dead) {
          bird.v += grav; bird.y += bird.v;
          if (t % Math.floor(90 / diffMul()) === 0) spawn();
          pipes.forEach((p) => p.x -= 2.4 * diffMul());
          pipes = pipes.filter((p) => p.x > -60);
          pipes.forEach((p) => {
            ctx.fillStyle = "#5eead4";
            ctx.fillRect(p.x, 0, 44, p.top);
            ctx.fillRect(p.x, p.top + p.gap, 44, H);
            if (!p.passed && p.x + 44 < bird.x) { p.passed = true; score++; setScore(score); setBest("flappy", score); beep("win"); }
            const hit = bird.x + 14 > p.x && bird.x - 14 < p.x + 44 && (bird.y - 12 < p.top || bird.y + 12 > p.top + p.gap);
            if (hit || bird.y > H - 40 || bird.y < 0) { dead = true; beep("bad"); }
          });
        }
        // bird
        ctx.beginPath();
        ctx.fillStyle = "#e8d5b7";
        ctx.arc(bird.x, bird.y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#04120f";
        ctx.beginPath(); ctx.arc(bird.x + 5, bird.y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath(); ctx.moveTo(bird.x + 12, bird.y); ctx.lineTo(bird.x + 22, bird.y + 3); ctx.lineTo(bird.x + 12, bird.y + 6); ctx.fill();
        if (dead) {
          ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "#f4f4f0"; ctx.font = "700 22px Space Grotesk"; ctx.textAlign = "center";
          ctx.fillText("Game over · tap to retry", W / 2, H / 2);
        }
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== SNAKE ===== */
    function startSnake() {
      const cell = 20, cols = Math.floor(canvas.width / cell), rows = Math.floor(canvas.height / cell);
      let snake = [{ x: 8, y: 8 }], dir = { x: 1, y: 0 }, next = { x: 1, y: 0 }, food = { x: 12, y: 8 }, score = 0, acc = 0;
      const speed = 7 * diffMul();
      bindDirs((d) => {
        if (d === "up" && dir.y !== 1) next = { x: 0, y: -1 };
        if (d === "down" && dir.y !== -1) next = { x: 0, y: 1 };
        if (d === "left" && dir.x !== 1) next = { x: -1, y: 0 };
        if (d === "right" && dir.x !== -1) next = { x: 1, y: 0 };
      });
      let last = performance.now();
      function placeFood() {
        do { food = { x: Math.floor(rand(0, cols)), y: Math.floor(rand(0, rows)) }; }
        while (snake.some((s) => s.x === food.x && s.y === food.y));
      }
      function loop(now) {
        if (!state.running) return;
        acc += (now - last) / 1000; last = now;
        while (acc > 1 / speed) {
          acc -= 1 / speed;
          dir = next;
          const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
          const hitWall = head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows;
          if (hitWall || snake.some((s) => s.x === head.x && s.y === head.y)) {
            beep("bad"); startSnake(); return;
          }
          snake.unshift(head);
          if (head.x === food.x && head.y === food.y) {
            score++; setScore(score); setBest("snake", score); beep("win"); placeFood();
          } else snake.pop();
        }
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#5eead4";
        snake.forEach((s, i) => {
          ctx.globalAlpha = 1 - i * 0.03;
          ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#e8d5b7";
        ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4);
        state.raf = requestAnimationFrame(loop);
      }
      placeFood();
      state.raf = requestAnimationFrame(loop);
    }

    /* ===== PONG ===== */
    function startPong() {
      const W = canvas.width, H = canvas.height;
      let py = H / 2 - 40, ey = H / 2 - 40, ball = { x: W / 2, y: H / 2, vx: 3.2 * diffMul(), vy: 2.2 }, score = 0;
      bindDirs((d) => { if (d === "up") py -= 28; if (d === "down") py += 28; });
      canvas.onpointermove = (e) => {
        const r = canvas.getBoundingClientRect();
        py = ((e.clientY - r.top) / r.height) * H - 40;
      };
      function loop() {
        if (!state.running) return;
        py = clamp(py, 0, H - 80);
        ey += clamp((ball.y - (ey + 40)) * 0.08 * diffMul(), -5.5, 5.5);
        ey = clamp(ey, 0, H - 80);
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.y < 8 || ball.y > H - 8) ball.vy *= -1;
        if (ball.x < 28 && ball.y > py && ball.y < py + 80) { ball.vx = Math.abs(ball.vx) * 1.03; ball.x = 28; beep(); }
        if (ball.x > W - 28 && ball.y > ey && ball.y < ey + 80) { ball.vx = -Math.abs(ball.vx) * 1.03; ball.x = W - 28; }
        if (ball.x < 0) { beep("bad"); startPong(); return; }
        if (ball.x > W) { score++; setScore(score); setBest("pong", score); beep("win"); ball = { x: W / 2, y: H / 2, vx: 3.2 * diffMul(), vy: rand(-3, 3) }; }
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#5eead4"; ctx.fillRect(12, py, 10, 80); ctx.fillRect(W - 22, ey, 10, 80);
        ctx.beginPath(); ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2); ctx.fill();
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== BREAKOUT ===== */
    function startBreakout() {
      const W = canvas.width, H = canvas.height;
      let px = W / 2 - 40, ball = { x: W / 2, y: H - 60, vx: 3 * diffMul(), vy: -3.2 * diffMul() }, score = 0;
      const bricks = [];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) bricks.push({ x: 16 + c * 42, y: 40 + r * 22, alive: true });
      bindDirs((d) => { if (d === "left") px -= 30; if (d === "right") px += 30; }, () => {});
      canvas.onpointermove = (e) => {
        const r = canvas.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * W - 40;
      };
      function loop() {
        if (!state.running) return;
        px = clamp(px, 0, W - 80);
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x < 8 || ball.x > W - 8) ball.vx *= -1;
        if (ball.y < 8) ball.vy *= -1;
        if (ball.y > H - 28 && ball.x > px && ball.x < px + 80) { ball.vy = -Math.abs(ball.vy); ball.y = H - 28; }
        if (ball.y > H) { beep("bad"); startBreakout(); return; }
        bricks.forEach((b) => {
          if (!b.alive) return;
          if (ball.x > b.x && ball.x < b.x + 38 && ball.y > b.y && ball.y < b.y + 16) {
            b.alive = false; ball.vy *= -1; score += 10; setScore(score); setBest("breakout", score); beep("win");
          }
        });
        if (bricks.every((b) => !b.alive)) { score += 100; setScore(score); setBest("breakout", score); startBreakout(); return; }
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#5eead4"; ctx.fillRect(px, H - 20, 80, 10);
        ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill();
        bricks.forEach((b, i) => {
          if (!b.alive) return;
          ctx.fillStyle = i % 2 ? "#5eead4" : "#e8d5b7";
          ctx.fillRect(b.x, b.y, 38, 16);
        });
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== DODGE ===== */
    function startDodge() {
      const W = canvas.width, H = canvas.height;
      let p = { x: W / 2, y: H - 70 }, rocks = [], score = 0, t = 0;
      const keys = { left: false, right: false, up: false, down: false };
      bindDirs((d) => { keys.left = keys.right = keys.up = keys.down = false; keys[d] = true; setTimeout(() => keys[d] = false, 120); });
      window.onkeydown = (e) => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
        if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
        if (e.code === "ArrowUp" || e.code === "KeyW") keys.up = true;
        if (e.code === "ArrowDown" || e.code === "KeyS") keys.down = true;
      };
      window.onkeyup = (e) => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
        if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
        if (e.code === "ArrowUp" || e.code === "KeyW") keys.up = false;
        if (e.code === "ArrowDown" || e.code === "KeyS") keys.down = false;
      };
      touchPad.onclick = (e) => {
        const btn = e.target.closest("[data-act]"); if (!btn) return;
        keys[btn.dataset.act] = true; setTimeout(() => keys[btn.dataset.act] = false, 140);
      };
      function loop() {
        if (!state.running) return;
        t++;
        const sp = 3.2 * diffMul();
        if (keys.left) p.x -= sp; if (keys.right) p.x += sp; if (keys.up) p.y -= sp; if (keys.down) p.y += sp;
        p.x = clamp(p.x, 16, W - 16); p.y = clamp(p.y, 16, H - 16);
        if (t % Math.max(12, Math.floor(28 / diffMul())) === 0) rocks.push({ x: rand(10, W - 10), y: -20, r: rand(10, 22), vy: rand(2.2, 4.5) * diffMul() });
        rocks.forEach((r) => r.y += r.vy);
        rocks = rocks.filter((r) => r.y < H + 30);
        if (t % 30 === 0) { score++; setScore(score); setBest("dodge", score); }
        for (const r of rocks) {
          const dx = r.x - p.x, dy = r.y - p.y;
          if (Math.hypot(dx, dy) < r.r + 12) { beep("bad"); startDodge(); return; }
        }
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#5eead4"; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#94a3b8";
        rocks.forEach((r) => { ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.fill(); });
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== CATCHER ===== */
    function startCatcher() {
      const W = canvas.width, H = canvas.height;
      let px = W / 2, orbs = [], score = 0, t = 0;
      bindDirs((d) => { if (d === "left") px -= 36; if (d === "right") px += 36; });
      canvas.onpointermove = (e) => {
        const r = canvas.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * W;
      };
      function loop() {
        if (!state.running) return;
        t++; px = clamp(px, 30, W - 30);
        if (t % Math.max(18, Math.floor(40 / diffMul())) === 0) orbs.push({ x: rand(20, W - 20), y: -10, vy: rand(2, 4) * diffMul(), good: Math.random() > 0.2 });
        orbs.forEach((o) => o.y += o.vy);
        orbs = orbs.filter((o) => {
          if (o.y > H - 36 && Math.abs(o.x - px) < 40) {
            if (o.good) { score += 5; setScore(score); setBest("catcher", score); beep("win"); }
            else { beep("bad"); score = Math.max(0, score - 8); setScore(score); }
            return false;
          }
          return o.y < H + 20;
        });
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#5eead4"; ctx.fillRect(px - 35, H - 28, 70, 14);
        orbs.forEach((o) => {
          ctx.fillStyle = o.good ? "#e8d5b7" : "#f87171";
          ctx.beginPath(); ctx.arc(o.x, o.y, 9, 0, Math.PI * 2); ctx.fill();
        });
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== RUNNER ===== */
    function startRunner() {
      const W = canvas.width, H = canvas.height;
      let y = H - 80, v = 0, onGround = true, obstacles = [], score = 0, t = 0, speed = 4 * diffMul();
      const jump = () => { if (onGround) { v = -11; onGround = false; beep(); } };
      bindAction(jump);
      function loop() {
        if (!state.running) return;
        t++; speed = 4 * diffMul() + t * 0.003;
        v += 0.55; y += v;
        if (y >= H - 80) { y = H - 80; v = 0; onGround = true; }
        if (t % Math.max(40, Math.floor(70 / diffMul())) === 0) obstacles.push({ x: W + 20, w: 28, h: rand(30, 55) });
        obstacles.forEach((o) => o.x -= speed);
        obstacles = obstacles.filter((o) => o.x > -40);
        if (t % 12 === 0) { score++; setScore(score); setBest("runner", score); }
        for (const o of obstacles) {
          if (80 < o.x + o.w && 80 + 24 > o.x && y < H - 40 && y + 24 > H - 40 - o.h) {
            beep("bad"); startRunner(); return;
          }
        }
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#1a2330"; ctx.fillRect(0, H - 40, W, 40);
        ctx.fillStyle = "#5eead4"; ctx.fillRect(80, y, 24, 24);
        ctx.fillStyle = "#e8d5b7";
        obstacles.forEach((o) => ctx.fillRect(o.x, H - 40 - o.h, o.w, o.h));
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== SHOOTER ===== */
    function startShooter() {
      const W = canvas.width, H = canvas.height;
      let px = W / 2, bullets = [], foes = [], score = 0, t = 0;
      bindDirs((d) => { if (d === "left") px -= 28; if (d === "right") px += 28; }, () => {
        bullets.push({ x: px, y: H - 50, vy: -8 }); beep();
      });
      canvas.onpointerdown = (e) => {
        const r = canvas.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * W;
        bullets.push({ x: px, y: H - 50, vy: -8 }); beep();
      };
      function loop() {
        if (!state.running) return;
        t++; px = clamp(px, 20, W - 20);
        if (t % Math.max(25, Math.floor(45 / diffMul())) === 0) foes.push({ x: rand(20, W - 20), y: -20, vy: rand(1.5, 3) * diffMul(), r: 14 });
        bullets.forEach((b) => b.y += b.vy);
        foes.forEach((f) => f.y += f.vy);
        bullets = bullets.filter((b) => b.y > -10);
        foes = foes.filter((f) => {
          if (f.y > H) { beep("bad"); score = Math.max(0, score - 5); setScore(score); return false; }
          for (let i = bullets.length - 1; i >= 0; i--) {
            if (Math.hypot(bullets[i].x - f.x, bullets[i].y - f.y) < f.r + 4) {
              bullets.splice(i, 1); score += 10; setScore(score); setBest("shooter", score); beep("win"); return false;
            }
          }
          return true;
        });
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#5eead4";
        ctx.beginPath(); ctx.moveTo(px, H - 50); ctx.lineTo(px - 14, H - 28); ctx.lineTo(px + 14, H - 28); ctx.fill();
        ctx.fillStyle = "#e8d5b7"; bullets.forEach((b) => { ctx.fillRect(b.x - 2, b.y, 4, 10); });
        ctx.fillStyle = "#f87171"; foes.forEach((f) => { ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill(); });
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== REACTION ===== */
    function startReaction() {
      const W = canvas.width, H = canvas.height;
      let mode = "wait", waitUntil = performance.now() + rand(900, 2500) / diffMul(), score = 0, flashAt = 0;
      const tap = () => {
        if (mode === "wait") { mode = "fail"; beep("bad"); setTimeout(startReaction, 700); }
        else if (mode === "go") {
          const ms = performance.now() - flashAt;
          const pts = Math.max(0, Math.round(500 - ms));
          score += pts; setScore(score); setBest("reaction", score); beep("win");
          mode = "result"; setTimeout(startReaction, 900);
        }
      };
      bindAction(tap);
      function loop() {
        if (!state.running) return;
        const now = performance.now();
        if (mode === "wait" && now >= waitUntil) { mode = "go"; flashAt = now; beep(); }
        ctx.fillStyle = mode === "go" ? "#134e4a" : "#0b0d12";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f4f4f0"; ctx.font = "700 24px Space Grotesk"; ctx.textAlign = "center";
        if (mode === "wait") ctx.fillText("Wait for teal…", W / 2, H / 2);
        if (mode === "go") ctx.fillText("TAP!", W / 2, H / 2);
        if (mode === "fail") ctx.fillText("Too early", W / 2, H / 2);
        if (mode === "result") ctx.fillText("Nice", W / 2, H / 2);
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== STACK ===== */
    function startStack() {
      const W = canvas.width, H = canvas.height;
      let y = 40, dir = 1, speed = 3 * diffMul(), stack = [{ x: W / 2 - 50, w: 100 }], score = 0, moving = true;
      const drop = () => {
        if (!moving) return;
        const prev = stack[stack.length - 1];
        const curX = xNow();
        const left = Math.max(prev.x, curX);
        const right = Math.min(prev.x + prev.w, curX + prev.w);
        const w = right - left;
        if (w < 12) { beep("bad"); startStack(); return; }
        stack.push({ x: left, w });
        score++; setScore(score); setBest("stack", score); beep("win");
        speed += 0.15 * diffMul(); y += 28;
        if (y > H - 120) { stack.forEach((s) => {}); /* visual only */ }
        moving = true;
      };
      let phase = 0;
      function xNow() { return (Math.sin(phase) * 0.5 + 0.5) * (W - stack[stack.length - 1].w); }
      bindAction(drop);
      function loop() {
        if (!state.running) return;
        phase += 0.045 * speed;
        const prev = stack[stack.length - 1];
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        stack.forEach((s, i) => {
          ctx.fillStyle = i % 2 ? "#5eead4" : "#99f6e4";
          const yy = H - 40 - (stack.length - i) * 28;
          ctx.fillRect(s.x, yy, s.w, 26);
        });
        ctx.fillStyle = "#e8d5b7";
        ctx.fillRect(xNow(), 50, prev.w, 26);
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== WHACK ===== */
    function startWhack() {
      const W = canvas.width, H = canvas.height;
      let targets = [], score = 0, t = 0;
      const hit = (x, y) => {
        for (let i = targets.length - 1; i >= 0; i--) {
          const tg = targets[i];
          if (Math.hypot(tg.x - x, tg.y - y) < tg.r) {
            targets.splice(i, 1); score += 10; setScore(score); setBest("whack", score); beep("win"); return;
          }
        }
      };
      canvas.onpointerdown = (e) => {
        const r = canvas.getBoundingClientRect();
        hit(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
      };
      touchPad.onclick = () => {};
      window.onkeydown = null;
      function loop() {
        if (!state.running) return;
        t++;
        if (t % Math.max(20, Math.floor(35 / diffMul())) === 0) targets.push({ x: rand(40, W - 40), y: rand(40, H - 40), r: 28, life: 90 });
        targets.forEach((tg) => tg.life--);
        targets = targets.filter((tg) => tg.life > 0);
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        targets.forEach((tg) => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(94,234,212,${tg.life / 90})`;
          ctx.arc(tg.x, tg.y, tg.r, 0, Math.PI * 2); ctx.fill();
        });
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== AIM ===== */
    function startAim() {
      const W = canvas.width, H = canvas.height;
      let target = { x: W / 2, y: H / 2, vx: 2.5 * diffMul(), vy: 1.8 * diffMul(), r: 22 }, score = 0;
      const shoot = (x, y) => {
        if (Math.hypot(target.x - x, target.y - y) < target.r + 8) {
          score += 15; setScore(score); setBest("aim", score); beep("win");
          target.vx *= -1.05; target.vy *= 1.05; target.r = Math.max(12, target.r - 0.4);
        } else beep("bad");
      };
      canvas.onpointerdown = (e) => {
        const r = canvas.getBoundingClientRect();
        shoot(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H);
      };
      bindAction(() => shoot(target.x + rand(-30, 30), target.y + rand(-30, 30)));
      function loop() {
        if (!state.running) return;
        target.x += target.vx; target.y += target.vy;
        if (target.x < 30 || target.x > W - 30) target.vx *= -1;
        if (target.y < 30 || target.y > H - 30) target.vy *= -1;
        ctx.fillStyle = "#0b0d12"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#5eead4"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(target.x, target.y, 4, 0, Math.PI * 2); ctx.fillStyle = "#e8d5b7"; ctx.fill();
        state.raf = requestAnimationFrame(loop);
      }
      loop();
    }

    /* ===== MEMORY ===== */
    function startMemory() {
      canvas.style.display = "none";
      domGame.style.display = "block";
      const icons = ["🦆", "🚀", "🎯", "🐍", "⚡", "🧱", "✨", "🏓"];
      const deck = [...icons, ...icons].sort(() => Math.random() - 0.5).map((v, i) => ({ id: i, v, flipped: false, matched: false }));
      let first = null, lock = false, score = 0, matched = 0;
      const render = () => {
        domGame.innerHTML = `<div class="memory-grid">${deck.map((c) => `
          <button type="button" class="mem-card ${c.flipped || c.matched ? "flipped" : ""} ${c.matched ? "matched" : ""}" data-i="${c.id}">
            ${c.flipped || c.matched ? c.v : ""}
          </button>`).join("")}</div>`;
        domGame.querySelectorAll(".mem-card").forEach((btn) => {
          btn.onclick = () => {
            const card = deck[+btn.dataset.i];
            if (lock || card.flipped || card.matched) return;
            card.flipped = true; render();
            if (!first) { first = card; return; }
            lock = true;
            if (first.v === card.v) {
              first.matched = card.matched = true; matched += 2; score += 20;
              setScore(score); setBest("memory", score); beep("win"); first = null; lock = false; render();
              if (matched === deck.length) beep("win");
            } else {
              beep("bad");
              setTimeout(() => { first.flipped = false; card.flipped = false; first = null; lock = false; render(); }, 550);
            }
          };
        });
      };
      render();
    }

    /* ===== TIC TAC TOE ===== */
    function startTtt() {
      canvas.style.display = "none";
      domGame.style.display = "block";
      let board = Array(9).fill(""), turn = "X", over = false, score = state.scores.ttt || 0;
      setScore(score); $("bestScore").textContent = String(state.scores.ttt || 0);
      const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      const winner = () => wins.map((l) => (board[l[0]] && board[l[0]] === board[l[1]] && board[l[1]] === board[l[2]] ? board[l[0]] : null)).find(Boolean);
      const bot = () => {
        const empty = board.map((v, i) => v ? null : i).filter((v) => v !== null);
        if (!empty.length) return;
        // prefer win/block
        for (const mark of ["O", "X"]) {
          for (const i of empty) {
            board[i] = mark; if (winner() === mark) { if (mark === "O") return; board[i] = ""; if (mark === "X") { board[i] = "O"; return; } }
            board[i] = "";
          }
        }
        board[empty[Math.floor(Math.random() * empty.length)]] = "O";
      };
      const render = () => {
        const w = winner();
        domGame.innerHTML = `<div class="ttt-grid">${board.map((v, i) => `<button class="ttt-cell" data-i="${i}">${v}</button>`).join("")}</div>
          <p class="hint">${w ? (w === "X" ? "You win!" : "Bot wins") : board.every(Boolean) ? "Draw" : "Your turn (X)"}</p>`;
        if (w === "X") { score += 1; setScore(score); setBest("ttt", score); beep("win"); over = true; }
        if (w === "O") { beep("bad"); over = true; }
        domGame.querySelectorAll(".ttt-cell").forEach((btn) => {
          btn.onclick = () => {
            const i = +btn.dataset.i;
            if (over || board[i]) return;
            board[i] = "X";
            if (!winner() && board.some((x) => !x)) bot();
            render();
          };
        });
      };
      render();
    }

    /* ===== 2048 ===== */
    function startMerge() {
      canvas.style.display = "none";
      domGame.style.display = "block";
      let grid = Array.from({ length: 4 }, () => Array(4).fill(0));
      let score = 0;
      const add = () => {
        const empty = [];
        grid.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
        if (!empty.length) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
      };
      const slide = (row) => {
        const arr = row.filter(Boolean);
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i] === arr[i + 1]) { arr[i] *= 2; score += arr[i]; arr.splice(i + 1, 1); }
        }
        while (arr.length < 4) arr.push(0);
        return arr;
      };
      const rotate = () => { grid = grid[0].map((_, c) => grid.map((row) => row[c]).reverse()); };
      const move = (dir) => {
        const before = JSON.stringify(grid);
        const ops = { left: 0, up: 1, right: 2, down: 3 };
        let n = ops[dir] || 0;
        while (n--) rotate();
        grid = grid.map(slide);
        n = (4 - (ops[dir] || 0)) % 4;
        while (n--) rotate();
        if (JSON.stringify(grid) !== before) { add(); setScore(score); setBest("merge", score); beep(); }
        render();
      };
      const colors = { 0: "#1a1f2a", 2: "#1f2a2a", 4: "#1d3a36", 8: "#134e4a", 16: "#0f766e", 32: "#5eead4", 64: "#99f6e4", 128: "#e8d5b7", 256: "#fbbf24", 512: "#f59e0b", 1024: "#f87171", 2048: "#fff" };
      const render = () => {
        domGame.innerHTML = `<div class="grid2048">${grid.flat().map((v) => `<div class="tile2048" style="background:${colors[v] || "#5eead4"};color:${v >= 32 && v < 128 ? "#04120f" : "#f4f4f0"}">${v || ""}</div>`).join("")}</div>
          <p class="hint">Arrows / swipe · reach 2048</p>`;
      };
      add(); add(); render(); setScore(0);
      bindDirs((d) => move(d));
      let sx = 0, sy = 0;
      domGame.ontouchstart = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
      domGame.ontouchend = (e) => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
        else move(dy > 0 ? "down" : "up");
      };
    }

    /* ---------- UI wiring ---------- */
    function openSettings() {
      $("togSound").classList.toggle("on", state.settings.sound);
      $("togZoom").classList.toggle("on", state.settings.pcZoom);
      $("togFx").classList.toggle("on", state.settings.particles);
      $("setDifficulty").value = state.settings.difficulty;
      $("settingsOverlay").classList.add("open");
    }
    function closeSettings() {
      $("settingsOverlay").classList.remove("open");
      setViewportForDevice();
    }

    $("betaForm").onsubmit = (e) => {
      e.preventDefault();
      const code = $("betaCode").value.trim();
      if (!BETA_CODES.includes(code)) {
        $("betaError").textContent = "Wrong code. Try again.";
        return;
      }
      sessionStorage.setItem(BETA_KEY, "1");
      showScreen("deviceScreen");
    };

    document.querySelectorAll(".device-opt").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".device-opt").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.device = btn.dataset.device;
      };
    });

    $("confirmDevice").onclick = () => {
      localStorage.setItem(DEVICE_KEY, state.device);
      setViewportForDevice();
      renderGrid();
      showScreen("hubScreen");
    };

    $("switchDevice").onclick = () => {
      clearEngine();
      showScreen("deviceScreen");
      document.querySelectorAll(".device-opt").forEach((b) => b.classList.toggle("selected", b.dataset.device === state.device));
    };

    $("backHub").onclick = () => { clearEngine(); renderGrid(); showScreen("hubScreen"); };
    $("restartGame").onclick = () => { if (state.current) startGame(state.current.id); };
    $("openSettings").onclick = openSettings;
    $("openSettings2").onclick = openSettings;
    $("closeSettings").onclick = closeSettings;
    $("settingsOverlay").onclick = (e) => { if (e.target.id === "settingsOverlay") closeSettings(); };

    $("togSound").onclick = () => {
      state.settings.sound = !state.settings.sound;
      $("togSound").classList.toggle("on", state.settings.sound);
      saveSettings();
    };
    $("togZoom").onclick = () => {
      state.settings.pcZoom = !state.settings.pcZoom;
      $("togZoom").classList.toggle("on", state.settings.pcZoom);
      saveSettings();
      setViewportForDevice();
    };
    $("togFx").onclick = () => {
      state.settings.particles = !state.settings.particles;
      $("togFx").classList.toggle("on", state.settings.particles);
      saveSettings();
    };
    $("setDifficulty").onchange = () => {
      state.settings.difficulty = $("setDifficulty").value;
      saveSettings();
    };
    $("resetScores").onclick = () => {
      if (!confirm("Reset all high scores?")) return;
      state.scores = {};
      saveScores();
      renderGrid();
      $("bestScore").textContent = "0";
    };

    // boot
    if (sessionStorage.getItem(BETA_KEY) === "1") {
      if (localStorage.getItem(DEVICE_KEY)) {
        state.device = localStorage.getItem(DEVICE_KEY);
        setViewportForDevice();
        renderGrid();
        showScreen("hubScreen");
        document.querySelectorAll(".device-opt").forEach((b) => b.classList.toggle("selected", b.dataset.device === state.device));
      } else showScreen("deviceScreen");
    } else showScreen("betaScreen");
  })();
