(() => {
  const I18n = window.TomasekI18n;
  const t = (key) => (I18n ? I18n.t(key) : key);

  const MORSE = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
    H: "....", CH: "----", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--",
    N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
    U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
    0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
    5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
    "'": ".----.", '"': ".-..-.", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
    "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.",
    "-": "-....-", _: "..--.-", "@": ".--.-."
  };

  const DIACRITICS = {
    Á: "A", Ä: "A", Č: "C", Ď: "D", É: "E", Ě: "E", Í: "I", Ň: "N",
    Ó: "O", Ö: "O", Ř: "R", Š: "S", Ť: "T", Ú: "U", Ů: "U", Ü: "U",
    Ý: "Y", Ž: "Z"
  };

  const MNEMONICS = {
    cz: {
      A: "akát", B: "blýskavice", C: "cílovníci", D: "dálava", E: "erb",
      F: "filipíny", G: "grónská zem", H: "hrachovina", CH: "chvátá k nám",
      I: "jehla", J: "jasmín bílý", K: "kocourkov", L: "lupínek", M: "mává",
      N: "nástup", O: "ó náš pán", P: "papírníci", Q: "kvílí orkán", R: "rameno",
      S: "sobota", T: "trám", U: "učený", V: "vyvolený", W: "wagón klád",
      X: "Xénokratés", Y: "ýgar mává", Z: "známá žena"
    },
    sk: {
      A: "akát", B: "blýskavica", C: "cielovníci", D: "ďaleko", E: "erb",
      F: "filipíny", G: "grónska zem", H: "hrachovina", CH: "chváta k nám",
      I: "ihla", J: "jazmín biely", K: "kocúrkov", L: "lístok", M: "máva",
      N: "nástup", O: "ó náš pán", P: "papiernici", Q: "kvíli orkán", R: "rameno",
      S: "sobota", T: "tráma", U: "učený", V: "vyvolený", W: "vagón klád",
      X: "Xénokratés", Y: "ýgar máva", Z: "známa žena"
    },
    de: {
      A: "Anton", B: "Berta", C: "Cäsar", D: "Dora", E: "Emil",
      F: "Friedrich", G: "Gustav", H: "Heinrich", CH: "Charlotte",
      I: "Ida", J: "Julius", K: "Kaufmann", L: "Ludwig", M: "Martha",
      N: "Nordpol", O: "Otto", P: "Paula", Q: "Quelle", R: "Richard",
      S: "Samuel", T: "Theodor", U: "Ulrich", V: "Viktor", W: "Wilhelm",
      X: "Xanthippe", Y: "Ypsilon", Z: "Zacharias"
    },
    en: {
      A: "alpha", B: "bravo", C: "charlie", D: "delta", E: "echo",
      F: "foxtrot", G: "golf", H: "hotel", CH: "CH",
      I: "india", J: "juliet", K: "kilo", L: "lima", M: "mike",
      N: "november", O: "oscar", P: "papa", Q: "quebec", R: "romeo",
      S: "sierra", T: "tango", U: "uniform", V: "victor", W: "whiskey",
      X: "x-ray", Y: "yankee", Z: "zulu"
    }
  };

  const LETTERS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "CH", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
  ];

  const REVERSE = Object.create(null);
  for (const [ch, code] of Object.entries(MORSE)) REVERSE[code] = ch;

  const textIn = document.getElementById("text-in");
  const morseIn = document.getElementById("morse-in");
  const czechCh = document.getElementById("czech-ch");
  const wpmRange = document.getElementById("wpm");
  const wpmVal = document.getElementById("wpm-val");
  const playBtn = document.getElementById("play");
  const stopBtn = document.getElementById("stop");
  const copyBtn = document.getElementById("copy");
  const swapBtn = document.getElementById("swap");
  const beacon = document.getElementById("beacon");
  const status = document.getElementById("status");
  const alphaGrid = document.getElementById("alpha-grid");

  let syncing = false;
  let audioCtx = null;
  let playToken = 0;

  function lang() {
    return I18n ? I18n.getLang() : "en";
  }

  function useChDefault() {
    const l = lang();
    return l === "cz" || l === "sk" || l === "de";
  }

  function normalizeLetter(ch) {
    const up = ch.toUpperCase();
    return DIACRITICS[up] || up;
  }

  function textToMorse(raw) {
    const useCh = czechCh.checked;
    const words = raw.trim().split(/\s+/).filter(Boolean);
    const out = [];

    for (const word of words) {
      const letters = [];
      let i = 0;
      while (i < word.length) {
        const a = word[i];
        const b = word[i + 1];
        const pair = normalizeLetter(a) + (b ? normalizeLetter(b) : "");
        if (useCh && pair === "CH") {
          letters.push(MORSE.CH);
          i += 2;
          continue;
        }
        const n = normalizeLetter(a);
        if (MORSE[n]) letters.push(MORSE[n]);
        i += 1;
      }
      if (letters.length) out.push(letters.join(" "));
    }
    return out.join(" / ");
  }

  function morseToText(raw) {
    const useCh = czechCh.checked;
    const cleaned = raw
      .trim()
      .replace(/[·•]/g, ".")
      .replace(/[–—−]/g, "-")
      .replace(/\s*\/+\s*/g, " / ")
      .replace(/\s{3,}/g, " / ");
    if (!cleaned) return "";

    return cleaned
      .split(/\s*\/\s*/)
      .map((word) =>
        word
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((code) => {
            if (code === "----" && useCh) return "CH";
            return REVERSE[code] || "�";
          })
          .join("")
      )
      .join(" ");
  }

  function fromText() {
    if (syncing) return;
    syncing = true;
    morseIn.value = textToMorse(textIn.value);
    syncing = false;
  }

  function fromMorse() {
    if (syncing) return;
    syncing = true;
    textIn.value = morseToText(morseIn.value);
    syncing = false;
  }

  function unitMs() {
    return 1200 / Number(wpmRange.value);
  }

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function sleep(ms, token) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (token !== playToken) reject(new Error("stopped"));
        else resolve();
      }, ms);
      if (token !== playToken) {
        clearTimeout(timer);
        reject(new Error("stopped"));
      }
    });
  }

  async function tone(durationMs, token) {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 600;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    osc.start(now);
    beacon.classList.add("on");
    try {
      await sleep(durationMs, token);
    } finally {
      const end = ctx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, end);
      gain.gain.exponentialRampToValueAtTime(0.0001, end + 0.02);
      osc.stop(end + 0.03);
      beacon.classList.remove("on");
    }
  }

  async function playMorse(code) {
    const token = ++playToken;
    playBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = t("morse.statusPlaying");

    const u = unitMs();
    const symbols = code.trim();

    try {
      for (let i = 0; i < symbols.length; i++) {
        if (token !== playToken) throw new Error("stopped");
        const s = symbols[i];
        if (s === ".") {
          await tone(u, token);
          await sleep(u, token);
        } else if (s === "-") {
          await tone(u * 3, token);
          await sleep(u, token);
        } else if (s === " ") {
          await sleep(u * 2, token);
        } else if (s === "/") {
          await sleep(u * 4, token);
        }
      }
      status.textContent = t("morse.statusDone");
    } catch {
      status.textContent = t("morse.statusStopped");
    } finally {
      if (token === playToken) {
        playBtn.disabled = false;
        stopBtn.disabled = true;
        beacon.classList.remove("on");
      }
    }
  }

  function stopPlay() {
    playToken += 1;
    playBtn.disabled = false;
    stopBtn.disabled = true;
    beacon.classList.remove("on");
    status.textContent = t("morse.statusStopped");
  }

  function buildAlphabet() {
    const pack = MNEMONICS[lang()] || MNEMONICS.en;
    alphaGrid.innerHTML = "";
    for (const letter of LETTERS) {
      const code = MORSE[letter];
      if (!code) continue;
      const word = pack[letter] || "";
      const el = document.createElement("button");
      el.type = "button";
      el.className = "alpha-card";
      el.innerHTML =
        `<span class="letter">${letter}</span>` +
        `<span class="code">${code}</span>` +
        (word ? `<span class="word">${word}</span>` : "");
      el.addEventListener("click", () => playMorse(code));
      alphaGrid.appendChild(el);
    }
  }

  function applyLangUi() {
    if (I18n) I18n.apply();
    czechCh.checked = useChDefault();
    document.title = t("morse.title") + " · TomasekPlays";
    buildAlphabet();
    if (textIn.value.trim()) fromText();
  }

  textIn.addEventListener("input", fromText);
  morseIn.addEventListener("input", fromMorse);
  czechCh.addEventListener("change", () => {
    if (document.activeElement === morseIn) fromMorse();
    else fromText();
  });

  wpmRange.addEventListener("input", () => {
    wpmVal.textContent = wpmRange.value;
  });

  playBtn.addEventListener("click", () => {
    const code = morseIn.value.trim() || textToMorse(textIn.value);
    if (!code) {
      status.textContent = t("morse.statusEmpty");
      return;
    }
    if (!morseIn.value.trim()) morseIn.value = code;
    playMorse(code);
  });

  stopBtn.addEventListener("click", stopPlay);

  copyBtn.addEventListener("click", async () => {
    const val = morseIn.value.trim() || textIn.value.trim();
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      status.textContent = t("morse.statusCopied");
    } catch {
      status.textContent = t("morse.statusCopyFail");
    }
  });

  swapBtn.addEventListener("click", () => {
    const tmp = textIn.value;
    textIn.value = morseIn.value;
    morseIn.value = tmp;
  });

  document.querySelectorAll("[data-clear]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-clear");
      document.getElementById(id).value = "";
      if (id === "text-in") fromText();
      else fromMorse();
    });
  });

  if (I18n) {
    I18n.onChange(() => applyLangUi());
  }
  window.addEventListener("tomasekLang", () => applyLangUi());
  window.addEventListener("storage", (e) => {
    if (e.key === "tomasekSettings") applyLangUi();
  });

  applyLangUi();
})();
