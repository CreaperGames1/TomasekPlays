/**
 * TomasekPlays seasonal themes + owners daily gate.
 * Christmas redeem available from 1 December 2026 (public).
 * Owners app (?owners=1) can use Christmas anytime + daily OWN4 unlock.
 */
(function () {
  const THEME_KEY = "tomasekTheme";
  const OWN_DAY_KEY = "tomasekOwnDay";
  const CHRISTMAS_START = new Date(2026, 11, 1); // 1 Dec 2026 local
  const OWNERS_DAILY_CODE = "OWN4";

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function isOwnersApp() {
    try {
      if (window.TOMASEK_OWNERS === true) return true;
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

  function redeemChristmas() {
    if (!christmasOpen()) {
      return {
        ok: false,
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
    OWNERS_DAILY_CODE,
    todayKey,
    handleRedeem(code) {
      if (code === "CHRISTMAS") return redeemChristmas();
      return null;
    },
  };

  function mountOwnersGate() {
    if (!isOwnersApp()) return;
    if (localStorage.getItem(OWN_DAY_KEY) === todayKey()) return;

    const gate = document.createElement("div");
    gate.className = "own-gate on";
    gate.id = "ownGate";
    gate.innerHTML = `
      <div class="box">
        <h2>Owners build</h2>
        <p>Enter today's owners code to continue. Extra redeem codes (Christmas and more) work here.</p>
        <form id="ownForm" autocomplete="off">
          <label>Daily code
            <input id="ownCode" maxlength="24" placeholder="CODE" required autocapitalize="characters" spellcheck="false" />
          </label>
          <p class="err" id="ownErr"></p>
          <button type="submit">Unlock for today</button>
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
        gate.querySelector("#ownErr").textContent = "Wrong code. Try again.";
        return;
      }
      try { localStorage.setItem(OWN_DAY_KEY, todayKey()); } catch (_) {}
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
