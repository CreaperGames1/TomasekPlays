/**
 * TomasekPlays seasonal themes + owners gate.
 * Christmas redeem available from 1 December 2026 (public).
 * Owners app: OWN4 required each launch; Christmas theme anytime.
 */
(function () {
  const THEME_KEY = "tomasekTheme";
  const OWN_SESSION_KEY = "tomasekOwnUnlocked";
  const OWNERS_FLAG_KEY = "tomasekOwnersApp";
  const CHRISTMAS_START = new Date(2026, 11, 1); // 1 Dec 2026 local
  const OWNERS_DAILY_CODE = "OWN4";

  /** Capture ?owners=1 before the site strips the query from the URL. */
  function captureOwnersFlag() {
    try {
      if (/[?&]owners=1(?:&|$)/.test(location.search || "")) {
        sessionStorage.setItem(OWNERS_FLAG_KEY, "1");
        window.TOMASEK_OWNERS = true;
      }
      if (window.TOMASEK_OWNERS === true) {
        sessionStorage.setItem(OWNERS_FLAG_KEY, "1");
      }
      try {
        if (window.top && window.top !== window && window.top.TOMASEK_OWNERS === true) {
          sessionStorage.setItem(OWNERS_FLAG_KEY, "1");
          window.TOMASEK_OWNERS = true;
        }
      } catch (_) {}
    } catch (_) {}
  }

  function isOwnersApp() {
    try {
      captureOwnersFlag();
      if (window.TOMASEK_OWNERS === true) return true;
      if (sessionStorage.getItem(OWNERS_FLAG_KEY) === "1") return true;
      return /[?&]owners=1(?:&|$)/.test(location.search || "");
    } catch (_) {
      return false;
    }
  }

  function christmasOpen() {
    if (isOwnersApp()) return true;
    const now = new Date();
    const start = new Date(CHRISTMAS_START.getFullYear(), CHRISTMAS_START.getMonth(), CHRISTMAS_START.getDate());
    return now >= start;
  }

  function applyTheme(name) {
    document.body.classList.toggle("theme-christmas", name === "christmas");
    try {
      if (name) localStorage.setItem(THEME_KEY, name);
      else localStorage.removeItem(THEME_KEY);
    } catch (_) {}
  }

  function restoreTheme() {
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === "christmas" && christmasOpen()) applyTheme("christmas");
      else if (t === "christmas" && !christmasOpen()) applyTheme("");
    } catch (_) {}
  }

  function ensureFxHost() {
    let fx = document.getElementById("seasonFx");
    if (fx) return fx;
    fx = document.createElement("div");
    fx.id = "seasonFx";
    fx.className = "season-fx";
    fx.setAttribute("aria-hidden", "true");
    document.body.appendChild(fx);
    return fx;
  }

  function playChristmasAnim() {
    const fx = ensureFxHost();
    const picks = ["tree", "snow", "gift", "star"];
    const kind = picks[(Math.random() * picks.length) | 0];
    let html = "";
    if (kind === "tree") {
      html = `<div class="stage"><div class="xmas-tree"><span class="star">★</span><span class="mid"></span><span class="trunk"></span></div><div class="label">Merry Christmas</div></div>`;
    } else if (kind === "snow") {
      const flakes = Array.from({ length: 42 }, (_, i) => {
        const left = (Math.random() * 100).toFixed(1);
        const delay = (Math.random() * 0.6).toFixed(2);
        const dur = (1.4 + Math.random() * 1.4).toFixed(2);
        const size = (3 + Math.random() * 6).toFixed(0);
        return `<i style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s;width:${size}px;height:${size}px"></i>`;
      }).join("");
      html = `<div class="stage"><div class="snow-burst">${flakes}</div><div class="xmas-star" style="font-size:3.2rem">❄</div><div class="label">Let it snow</div></div>`;
    } else if (kind === "gift") {
      html = `<div class="stage"><div class="xmas-gift"><span class="bow">🎀</span></div><div class="label">Gift unlocked</div></div>`;
    } else {
      html = `<div class="stage"><div class="xmas-star">★</div><div class="label">Season's greetings</div></div>`;
    }
    fx.innerHTML = html;
    fx.classList.remove("on");
    void fx.offsetWidth;
    fx.classList.add("on");
    clearTimeout(playChristmasAnim._t);
    playChristmasAnim._t = setTimeout(() => fx.classList.remove("on"), 2800);
  }

  function christmasStartDate() {
    return new Date(CHRISTMAS_START.getFullYear(), CHRISTMAS_START.getMonth(), CHRISTMAS_START.getDate(), 0, 0, 0, 0);
  }

  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return { days, hours: pad(hours), mins: pad(mins), secs: pad(secs), done: ms <= 0 };
  }

  let waitTimer = null;

  function closeChristmasWait() {
    if (waitTimer) {
      clearInterval(waitTimer);
      waitTimer = null;
    }
    const el = document.getElementById("xmasWait");
    if (el) el.classList.remove("on");
  }

  function showChristmasWait() {
    let el = document.getElementById("xmasWait");
    if (!el) {
      el = document.createElement("div");
      el.id = "xmasWait";
      el.className = "xmas-wait";
      el.innerHTML = `
        <div class="box">
          <h2>Not out yet</h2>
          <p class="msg" id="xmasWaitMsg">Christmas theme unlocks on 1 December 2026.</p>
          <div class="timer" aria-live="polite">
            <div class="unit"><b id="xmasD">0</b><span>Days</span></div>
            <div class="unit"><b id="xmasH">00</b><span>Hours</span></div>
            <div class="unit"><b id="xmasM">00</b><span>Mins</span></div>
            <div class="unit"><b id="xmasS">00</b><span>Secs</span></div>
          </div>
          <p class="sub">Come back when the timer hits zero — then redeem CHRISTMAS again.</p>
          <button type="button" id="xmasWaitClose">Got it</button>
        </div>`;
      document.body.appendChild(el);
      el.addEventListener("click", (e) => {
        if (e.target.id === "xmasWait") closeChristmasWait();
      });
      el.querySelector("#xmasWaitClose").addEventListener("click", closeChristmasWait);
    }

    const tick = () => {
      const left = christmasStartDate().getTime() - Date.now();
      const c = formatCountdown(left);
      const d = el.querySelector("#xmasD");
      const h = el.querySelector("#xmasH");
      const m = el.querySelector("#xmasM");
      const s = el.querySelector("#xmasS");
      if (d) d.textContent = String(c.days);
      if (h) h.textContent = c.hours;
      if (m) m.textContent = c.mins;
      if (s) s.textContent = c.secs;
      if (c.done) {
        el.querySelector("#xmasWaitMsg").textContent = "Christmas is live — redeem CHRISTMAS again!";
        el.querySelector("#xmasWaitMsg").style.color = "#7dffb3";
        closeChristmasWait();
        if (christmasOpen()) {
          applyTheme("christmas");
          playChristmasAnim();
        }
      }
    };

    if (waitTimer) clearInterval(waitTimer);
    tick();
    waitTimer = setInterval(tick, 1000);
    el.classList.add("on");
  }

  function redeemChristmas() {
    if (!christmasOpen()) {
      showChristmasWait();
      return {
        ok: false,
        wait: true,
        message: "Christmas theme unlocks on 1 December 2026.",
      };
    }
    applyTheme("christmas");
    playChristmasAnim();
    return { ok: true, message: "Christmas theme on — enjoy the snow!" };
  }

  /** Extra redeem handlers for pages to call */
  window.TomasekSeason = {
    isOwnersApp,
    christmasOpen,
    redeemChristmas,
    playChristmasAnim,
    applyTheme,
    restoreTheme,
    showChristmasWait,
    closeChristmasWait,
    OWNERS_DAILY_CODE,
    handleRedeem(code) {
      if (code === "CHRISTMAS") return redeemChristmas();
      return null;
    },
  };

  function mountOwnersGate() {
    if (!isOwnersApp()) return;
    try {
      if (sessionStorage.getItem(OWN_SESSION_KEY) === "1") return;
    } catch (_) {}

    const gate = document.createElement("div");
    gate.className = "own-gate on";
    gate.id = "ownGate";
    gate.innerHTML = `
      <div class="box">
        <h2>Owners build</h2>
        <p>Enter <strong>OWN4</strong> to open the app. After that, redeem <strong>CHRISTMAS</strong> anytime for the Christmas theme.</p>
        <form id="ownForm" autocomplete="off">
          <label>Owners code
            <input id="ownCode" maxlength="24" placeholder="OWN4" required autocapitalize="characters" spellcheck="false" />
          </label>
          <p class="err" id="ownErr"></p>
          <button type="submit">Enter app</button>
        </form>
      </div>`;
    document.body.appendChild(gate);

    const input = gate.querySelector("#ownCode");
    const bump = () => {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const next = String(input.value || "").toUpperCase();
      if (input.value !== next) {
        input.value = next;
        try { input.setSelectionRange(start, end); } catch (_) {}
      }
    };
    input.addEventListener("input", bump);

    gate.querySelector("#ownForm").addEventListener("submit", (e) => {
      e.preventDefault();
      bump();
      const entered = String(input.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (entered !== OWNERS_DAILY_CODE) {
        gate.querySelector("#ownErr").textContent = "Wrong code. Enter OWN4.";
        return;
      }
      try { sessionStorage.setItem(OWN_SESSION_KEY, "1"); } catch (_) {}
      gate.classList.remove("on");
      gate.remove();
    });

    setTimeout(() => input.focus(), 200);
  }

  function boot() {
    restoreTheme();
    mountOwnersGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
