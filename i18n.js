/**
 * TomasekPlays i18n — language lives in tomasekSettings.lang
 * Codes: en, cz, sk, de (easy to add more in LANGS + STRINGS)
 */
(function () {
  const SETTINGS_KEY = "tomasekSettings";
  const DEFAULT = "en";

  const LANGS = [
    { id: "en", label: "English", native: "English" },
    { id: "cz", label: "Czech", native: "Čeština" },
    { id: "sk", label: "Slovak", native: "Slovenčina" },
    { id: "de", label: "German", native: "Deutsch" }
  ];

  const STRINGS = {
    en: {
      "nav.contact": "Contact",
      "nav.beta": "Try Beta mode",
      "nav.settings": "Settings",
      "nav.primary": "Primary",
      "device.phone": "Phone layout",
      "device.pc": "PC",
      "hero.eyebrow": "Beta access",
      "hero.lede": "A clean drop-in arcade. Enter a beta code to unlock play — no installs, no clutter.",
      "hero.cta": "Try Beta mode",
      "hud.status": "status",
      "hud.ready": "ready",
      "hud.session": "session",
      "hud.online": "online",
      "beta.title": "Try Beta mode",
      "beta.lead": "Enter a beta code to unlock the games.",
      "beta.label": "Beta code",
      "beta.placeholder": "Enter code",
      "beta.submit": "Try Beta mode",
      "beta.cancel": "Cancel",
      "beta.wrong": "Wrong code. Try again.",
      "beta.arcadeLead": "Enter a beta code to unlock the arcade.",
      "unlock.badge": "Access unlocked",
      "contact.title": "Contact",
      "contact.lead": "Business inquiries, collabs, or feedback.",
      "contact.close": "Close",
      "contact.copy": "Copy to clipboard",
      "contact.copied": "Copied.",
      "contact.copyFail": "Couldn’t copy — select the email manually.",
      "redeem.title": "Redeem",
      "redeem.lead": "Enter a code.",
      "redeem.label": "Code",
      "redeem.placeholder": "Enter code",
      "redeem.submit": "Redeem",
      "redeem.cancel": "Cancel",
      "redeem.wrong": "Wrong code. Try again.",
      "redeem.checking": "Checking…",
      "redeem.granted": "Access granted.",
      "redeem.okDownload": "Downloading TomasekPlays.zip — unzip, then open TomasekPlays.exe",
      "redeem.okHomescreen": "Opening home screen guide…",
      "redeem.okOwners": "Downloading TomasekPlays-Owners.zip — unzip, then open the exe",
      "redeem.okMorse": "Opening Morseovka…",
      "morse.title": "Morseovka",
      "morse.tag": "TomasekPlays",
      "morse.lead": "Convert text ↔ Morse code. Plays the tone too.",
      "morse.text": "Text",
      "morse.morse": "Morse",
      "morse.clear": "Clear",
      "morse.ch": "CH as ----",
      "morse.speed": "Speed",
      "morse.play": "▶ Play",
      "morse.stop": "■ Stop",
      "morse.copy": "Copy",
      "morse.hint": "Letter gap: space · word gap: /",
      "morse.alpha": "Alphabet",
      "morse.alphaLead": "Tap a letter to hear it.",
      "morse.home": "← Home",
      "morse.statusReady": "Ready.",
      "morse.statusPlaying": "Playing…",
      "morse.statusDone": "Done.",
      "morse.statusStopped": "Stopped.",
      "morse.statusEmpty": "Enter text or Morse first.",
      "morse.statusCopied": "Copied.",
      "morse.statusCopyFail": "Couldn’t copy.",
      "morse.placeholderText": "Hello, how are you?",
      "morse.placeholderMorse": ".... . .-.. .-.. ---",
      "hs.title": "Add to Home Screen",
      "hs.lead": "Put TomasekPlays on your phone like an app.",
      "hs.gotit": "Got it",
      "hs.close": "Close",
      "hs.iosLead": "iPhone / iPad — Safari",
      "hs.androidLead": "Android — Chrome",
      "hs.otherLead": "Phone home screen",
      "hs.ios.1": "Open <strong>tomasekplays.com</strong> in <strong>Safari</strong> (not Chrome).",
      "hs.ios.2": "Tap the <strong>Share</strong> button (square with an arrow up).",
      "hs.ios.3": "Scroll and tap <strong>Add to Home Screen</strong>.",
      "hs.ios.4": "Tap <strong>Add</strong> — TomasekPlays appears like an app.",
      "hs.android.1": "Open <strong>tomasekplays.com</strong> in <strong>Chrome</strong>.",
      "hs.android.2": "Tap the <strong>⋮</strong> menu (top right).",
      "hs.android.3": "Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.",
      "hs.android.4": "Confirm — TomasekPlays appears like an app.",
      "hs.other.1": "<strong>iPhone:</strong> Safari → <strong>Share</strong> → <strong>Add to Home Screen</strong>.",
      "hs.other.2": "<strong>Android:</strong> Chrome → <strong>⋮</strong> → <strong>Add to Home screen</strong>.",
      "hs.other.3": "Open the new icon anytime — no App Store needed.",
      "hs.other.4": "PC download? Redeem code <strong>ONE4EXES</strong>.",
      "dl.title": "Owners download",
      "dl.lead": "Downloaded as a zip so Chrome won’t block it.",
      "dl.1": "Open <strong>{file}</strong> and extract it.",
      "dl.2": "Run <strong>TomasekPlays-Owners.exe</strong> inside the folder.",
      "dl.3": "If Windows asks → <strong>More info</strong> → <strong>Run anyway</strong>.",
      "dl.gotit": "Got it",
      "dl.close": "Close",
      "settings.title": "Settings",
      "settings.lead": "Saved on this device.",
      "settings.sound": "Sound",
      "settings.soundHint": "Beeps while playing",
      "settings.diff": "Difficulty",
      "settings.diffHint": "Default for new games",
      "settings.zoom": "PC zoom",
      "settings.zoomHint": "Only in PC mode",
      "settings.lang": "Language",
      "settings.langHint": "Site & arcade text",
      "settings.reset": "Reset scores",
      "settings.done": "Done",
      "settings.resetConfirm": "Reset all high scores?",
      "diff.easy": "Easy",
      "diff.normal": "Normal",
      "diff.hard": "Hard",
      "device.title": "Choose your setup",
      "device.lead": "Auto-detects phone or PC. You can override here anytime.",
      "device.pcStrong": "PC",
      "device.pcHint": "Keyboard · zoom ok",
      "device.mobileStrong": "Mobile",
      "device.mobileHint": "Touch · zoom off",
      "device.enter": "Enter arcade",
      "device.backHome": "Back home",
      "hub.title": "Pick a game. Play here.",
      "hub.lead": "Everything runs on this page — tap a card to start.",
      "hub.switch": "Switch device",
      "hub.home": "← Home",
      "hub.device": "device",
      "hub.best": "best",
      "player.arcade": "← Arcade",
      "player.home": "← Home",
      "player.score": "score",
      "player.best": "best",
      "player.restart": "Restart",
      "launch.before": "Before you play",
      "launch.pick": "Pick difficulty",
      "launch.andOpponent": " and opponent",
      "launch.diff": "Difficulty",
      "launch.players": "Players",
      "launch.bot": "vs Bot",
      "launch.botHint": "Play against AI",
      "launch.2p": "2 Players",
      "launch.2pHint": "Share one device",
      "launch.cancel": "Cancel",
      "launch.start": "Start game",
      "fx.home": "Back to home",
      "fx.starting": "Starting {name}",
      "game.over": "Game over · tap to retry",
      "pad.tap": "TAP / ACTION",
      "beta.arcadeTag": "Arcade beta",
      "blurb.flappy": "Space / tap to flap",
      "blurb.snake": "Arrow keys to steer",
      "blurb.pong": "Bot or 2 players",
      "blurb.breakout": "Move · break bricks",
      "blurb.dodge": "Move to survive",
      "blurb.catcher": "Catch good orbs",
      "blurb.runner": "Jump the gaps",
      "blurb.shooter": "Move + shoot",
      "blurb.reaction": "Tap when it flashes",
      "blurb.stack": "Tap to drop blocks",
      "blurb.whack": "Tap the circles",
      "blurb.aim": "Tap the moving mark",
      "blurb.memory": "Find all pairs",
      "blurb.ttt": "Bot or 2 players",
      "blurb.merge": "Swipe or arrows"
    },
    cz: {
      "nav.contact": "Kontakt",
      "nav.beta": "Vyzkoušet beta",
      "nav.settings": "Nastavení",
      "nav.primary": "Hlavní",
      "device.phone": "Telefon",
      "device.pc": "PC",
      "hero.eyebrow": "Beta přístup",
      "hero.lede": "Čistá arcade hned v prohlížeči. Zadej beta kód a hraj — bez instalace, bez zbytečností.",
      "hero.cta": "Vyzkoušet beta",
      "hud.status": "stav",
      "hud.ready": "připraveno",
      "hud.session": "relace",
      "hud.online": "online",
      "beta.title": "Vyzkoušet beta",
      "beta.lead": "Zadej beta kód a odemkni hry.",
      "beta.label": "Beta kód",
      "beta.placeholder": "Zadej kód",
      "beta.submit": "Vyzkoušet beta",
      "beta.cancel": "Zrušit",
      "beta.wrong": "Špatný kód. Zkus to znovu.",
      "beta.arcadeLead": "Zadej beta kód a odemkni arcade.",
      "unlock.badge": "Přístup odemčen",
      "contact.title": "Kontakt",
      "contact.lead": "Obchodní poptávky, spolupráce nebo feedback.",
      "contact.close": "Zavřít",
      "contact.copy": "Kopírovat e-mail",
      "contact.copied": "Zkopírováno.",
      "contact.copyFail": "Nepodařilo se zkopírovat — vyber e-mail ručně.",
      "redeem.title": "Uplatnit kód",
      "redeem.lead": "Zadej kód.",
      "redeem.label": "Kód",
      "redeem.placeholder": "Zadej kód",
      "redeem.submit": "Uplatnit",
      "redeem.cancel": "Zrušit",
      "redeem.wrong": "Špatný kód. Zkus to znovu.",
      "redeem.checking": "Kontroluji…",
      "redeem.granted": "Přístup povolen.",
      "redeem.okDownload": "Stahuji TomasekPlays.zip — rozbal a otevři TomasekPlays.exe",
      "redeem.okHomescreen": "Otevírám návod na plochu…",
      "redeem.okOwners": "Stahuji TomasekPlays-Owners.zip — rozbal a otevři exe",
      "redeem.okMorse": "Otevírám Morseovku…",
      "morse.title": "Morseovka",
      "morse.tag": "TomasekPlays",
      "morse.lead": "Převáděj text ↔ Morseovu abecedu. Umí i přehrát tón.",
      "morse.text": "Text",
      "morse.morse": "Morseovka",
      "morse.clear": "Smazat",
      "morse.ch": "České CH jako ----",
      "morse.speed": "Rychlost",
      "morse.play": "▶ Přehrát",
      "morse.stop": "■ Stop",
      "morse.copy": "Kopírovat",
      "morse.hint": "Mezera mezi písmeny · / mezi slovy",
      "morse.alpha": "Abeceda",
      "morse.alphaLead": "Klepni na písmeno a uslyšíš ho.",
      "morse.home": "← Domů",
      "morse.statusReady": "Připraveno.",
      "morse.statusPlaying": "Přehrávám…",
      "morse.statusDone": "Hotovo.",
      "morse.statusStopped": "Zastaveno.",
      "morse.statusEmpty": "Nejdřív napiš text nebo morseovku.",
      "morse.statusCopied": "Zkopírováno.",
      "morse.statusCopyFail": "Kopírování se nepovedlo.",
      "morse.placeholderText": "Ahoj, jak se máš?",
      "morse.placeholderMorse": ".- .... --- .---",
      "hs.title": "Přidat na plochu",
      "hs.lead": "Dej si TomasekPlays na telefon jako aplikaci.",
      "hs.gotit": "Rozumím",
      "hs.close": "Zavřít",
      "hs.iosLead": "iPhone / iPad — Safari",
      "hs.androidLead": "Android — Chrome",
      "hs.otherLead": "Plocha telefonu",
      "hs.ios.1": "Otevři <strong>tomasekplays.com</strong> v <strong>Safari</strong> (ne Chrome).",
      "hs.ios.2": "Klepni na <strong>Sdílet</strong> (čtverec se šipkou nahoru).",
      "hs.ios.3": "Sjeď dolů a klepni na <strong>Přidat na plochu</strong>.",
      "hs.ios.4": "Klepni na <strong>Přidat</strong> — TomasekPlays se objeví jako appka.",
      "hs.android.1": "Otevři <strong>tomasekplays.com</strong> v <strong>Chrome</strong>.",
      "hs.android.2": "Klepni na menu <strong>⋮</strong> (vpravo nahoře).",
      "hs.android.3": "Klepni na <strong>Přidat na plochu</strong> nebo <strong>Nainstalovat aplikaci</strong>.",
      "hs.android.4": "Potvrď — TomasekPlays se objeví jako appka.",
      "hs.other.1": "<strong>iPhone:</strong> Safari → <strong>Sdílet</strong> → <strong>Přidat na plochu</strong>.",
      "hs.other.2": "<strong>Android:</strong> Chrome → <strong>⋮</strong> → <strong>Přidat na plochu</strong>.",
      "hs.other.3": "Ikona funguje kdykoli — bez App Store.",
      "hs.other.4": "Stažení na PC? Uplatni kód <strong>ONE4EXES</strong>.",
      "dl.title": "Stažení Owners",
      "dl.lead": "Stahuje se jako zip, aby Chrome nic neblokoval.",
      "dl.1": "Otevři <strong>{file}</strong> a rozbal.",
      "dl.2": "Spusť <strong>TomasekPlays-Owners.exe</strong> ve složce.",
      "dl.3": "Když Windows ptá → <strong>Další informace</strong> → <strong>Přesto spustit</strong>.",
      "dl.gotit": "Rozumím",
      "dl.close": "Zavřít",
      "settings.title": "Nastavení",
      "settings.lead": "Uloženo na tomto zařízení.",
      "settings.sound": "Zvuk",
      "settings.soundHint": "Pípání během hry",
      "settings.diff": "Obtížnost",
      "settings.diffHint": "Výchozí pro nové hry",
      "settings.zoom": "PC zoom",
      "settings.zoomHint": "Jen v režimu PC",
      "settings.lang": "Jazyk",
      "settings.langHint": "Text webu a arcade",
      "settings.reset": "Reset skóre",
      "settings.done": "Hotovo",
      "settings.resetConfirm": "Resetovat všechna nejlepší skóre?",
      "diff.easy": "Lehká",
      "diff.normal": "Normální",
      "diff.hard": "Těžká",
      "device.title": "Vyber zařízení",
      "device.lead": "Automaticky pozná telefon nebo PC. Tady to můžeš kdykoli změnit.",
      "device.pcStrong": "PC",
      "device.pcHint": "Klávesnice · zoom OK",
      "device.mobileStrong": "Mobil",
      "device.mobileHint": "Dotyk · bez zoomu",
      "device.enter": "Vstoupit do arcade",
      "device.backHome": "Zpět domů",
      "hub.title": "Vyber hru. Hraj tady.",
      "hub.lead": "Vše běží na této stránce — klepni na kartu a start.",
      "hub.switch": "Změnit zařízení",
      "hub.home": "← Domů",
      "hub.device": "zařízení",
      "hub.best": "nejlepší",
      "player.arcade": "← Arcade",
      "player.home": "← Domů",
      "player.score": "skóre",
      "player.best": "nejlepší",
      "player.restart": "Restart",
      "launch.before": "Než začneš",
      "launch.pick": "Vyber obtížnost",
      "launch.andOpponent": " a soupeře",
      "launch.diff": "Obtížnost",
      "launch.players": "Hráči",
      "launch.bot": "proti botovi",
      "launch.botHint": "Hraj proti AI",
      "launch.2p": "2 hráči",
      "launch.2pHint": "Sdílené zařízení",
      "launch.cancel": "Zrušit",
      "launch.start": "Spustit hru",
      "fx.home": "Zpět domů",
      "fx.starting": "Spouštím {name}",
      "game.over": "Konec · klepni pro znovu",
      "pad.tap": "ŤUKNI / AKCE",
      "beta.arcadeTag": "Arcade beta",
      "blurb.flappy": "Mezerník / ťukni",
      "blurb.snake": "Šipky pro řízení",
      "blurb.pong": "Bot nebo 2 hráči",
      "blurb.breakout": "Pohyb · rozbij cihly",
      "blurb.dodge": "Hýbej se a přežij",
      "blurb.catcher": "Chytej dobré koule",
      "blurb.runner": "Skoč přes díry",
      "blurb.shooter": "Pohyb + střelba",
      "blurb.reaction": "Ťukni při záblesku",
      "blurb.stack": "Ťukni a pusť blok",
      "blurb.whack": "Ťukej na kruhy",
      "blurb.aim": "Ťukni na pohyblivý cíl",
      "blurb.memory": "Najdi všechny páry",
      "blurb.ttt": "Bot nebo 2 hráči",
      "blurb.merge": "Posun nebo šipky"
    },
    sk: {
      "nav.contact": "Kontakt",
      "nav.beta": "Vyskúšať beta",
      "nav.settings": "Nastavenia",
      "nav.primary": "Hlavné",
      "device.phone": "Telefón",
      "device.pc": "PC",
      "hero.eyebrow": "Beta prístup",
      "hero.lede": "Čistá arcade hneď v prehliadači. Zadaj beta kód a hraj — bez inštalácie.",
      "hero.cta": "Vyskúšať beta",
      "hud.status": "stav",
      "hud.ready": "pripravené",
      "hud.session": "relácia",
      "hud.online": "online",
      "beta.title": "Vyskúšať beta",
      "beta.lead": "Zadaj beta kód a odomkni hry.",
      "beta.label": "Beta kód",
      "beta.placeholder": "Zadaj kód",
      "beta.submit": "Vyskúšať beta",
      "beta.cancel": "Zrušiť",
      "beta.wrong": "Zlý kód. Skús znova.",
      "beta.arcadeLead": "Zadaj beta kód a odomkni arcade.",
      "unlock.badge": "Prístup odomknutý",
      "contact.title": "Kontakt",
      "contact.lead": "Obchodné dopyty, spolupráca alebo feedback.",
      "contact.close": "Zavrieť",
      "contact.copy": "Kopírovať e-mail",
      "contact.copied": "Skopírované.",
      "contact.copyFail": "Nepodarilo sa skopírovať — vyber e-mail ručne.",
      "redeem.title": "Uplatniť kód",
      "redeem.lead": "Zadaj kód.",
      "redeem.label": "Kód",
      "redeem.placeholder": "Zadaj kód",
      "redeem.submit": "Uplatniť",
      "redeem.cancel": "Zrušiť",
      "redeem.wrong": "Zlý kód. Skús znova.",
      "redeem.checking": "Kontrolujem…",
      "redeem.granted": "Prístup povolený.",
      "redeem.okDownload": "Sťahujem TomasekPlays.zip — rozbaľ a otvor TomasekPlays.exe",
      "redeem.okHomescreen": "Otváram návod na plochu…",
      "redeem.okOwners": "Sťahujem TomasekPlays-Owners.zip — rozbaľ a otvor exe",
      "redeem.okMorse": "Otváram Morseovku…",
      "morse.title": "Morseovka",
      "morse.tag": "TomasekPlays",
      "morse.lead": "Prevádzaj text ↔ Morseovu abecedu. Vie aj prehrať tón.",
      "morse.text": "Text",
      "morse.morse": "Morseovka",
      "morse.clear": "Zmazať",
      "morse.ch": "Slovenské CH ako ----",
      "morse.speed": "Rýchlosť",
      "morse.play": "▶ Prehrať",
      "morse.stop": "■ Stop",
      "morse.copy": "Kopírovať",
      "morse.hint": "Medzera medzi písmenami · / medzi slovami",
      "morse.alpha": "Abeceda",
      "morse.alphaLead": "Ťukni na písmeno a počuješ ho.",
      "morse.home": "← Domov",
      "morse.statusReady": "Pripravené.",
      "morse.statusPlaying": "Prehrávam…",
      "morse.statusDone": "Hotovo.",
      "morse.statusStopped": "Zastavené.",
      "morse.statusEmpty": "Najprv napíš text alebo morseovku.",
      "morse.statusCopied": "Skopírované.",
      "morse.statusCopyFail": "Kopírovanie zlyhalo.",
      "morse.placeholderText": "Ahoj, ako sa máš?",
      "morse.placeholderMorse": ".- .... --- .---",
      "hs.title": "Pridať na plochu",
      "hs.lead": "Daj si TomasekPlays na telefón ako aplikáciu.",
      "hs.gotit": "Rozumiem",
      "hs.close": "Zavrieť",
      "hs.iosLead": "iPhone / iPad — Safari",
      "hs.androidLead": "Android — Chrome",
      "hs.otherLead": "Plocha telefónu",
      "hs.ios.1": "Otvor <strong>tomasekplays.com</strong> v <strong>Safari</strong> (nie Chrome).",
      "hs.ios.2": "Ťukni na <strong>Zdieľať</strong> (štvorec so šípkou hore).",
      "hs.ios.3": "Posuň sa a ťukni na <strong>Pridať na plochu</strong>.",
      "hs.ios.4": "Ťukni na <strong>Pridať</strong> — TomasekPlays sa objaví ako appka.",
      "hs.android.1": "Otvor <strong>tomasekplays.com</strong> v <strong>Chrome</strong>.",
      "hs.android.2": "Ťukni na menu <strong>⋮</strong> (vpravo hore).",
      "hs.android.3": "Ťukni na <strong>Pridať na plochu</strong> alebo <strong>Nainštalovať aplikáciu</strong>.",
      "hs.android.4": "Potvrď — TomasekPlays sa objaví ako appka.",
      "hs.other.1": "<strong>iPhone:</strong> Safari → <strong>Zdieľať</strong> → <strong>Pridať na plochu</strong>.",
      "hs.other.2": "<strong>Android:</strong> Chrome → <strong>⋮</strong> → <strong>Pridať na plochu</strong>.",
      "hs.other.3": "Ikona funguje kedykoľvek — bez App Store.",
      "hs.other.4": "Sťahovanie na PC? Uplatni kód <strong>ONE4EXES</strong>.",
      "dl.title": "Sťahovanie Owners",
      "dl.lead": "Sťahuje sa ako zip, aby Chrome nič neblokoval.",
      "dl.1": "Otvor <strong>{file}</strong> a rozbaľ.",
      "dl.2": "Spusti <strong>TomasekPlays-Owners.exe</strong> v priečinku.",
      "dl.3": "Ak Windows pýta → <strong>Ďalšie informácie</strong> → <strong>Aj tak spustiť</strong>.",
      "dl.gotit": "Rozumiem",
      "dl.close": "Zavrieť",
      "settings.title": "Nastavenia",
      "settings.lead": "Uložené na tomto zariadení.",
      "settings.sound": "Zvuk",
      "settings.soundHint": "Pípanie počas hry",
      "settings.diff": "Obtiažnosť",
      "settings.diffHint": "Predvolené pre nové hry",
      "settings.zoom": "PC zoom",
      "settings.zoomHint": "Len v režime PC",
      "settings.lang": "Jazyk",
      "settings.langHint": "Text webu a arcade",
      "settings.reset": "Reset skóre",
      "settings.done": "Hotovo",
      "settings.resetConfirm": "Resetovať všetky najlepšie skóre?",
      "diff.easy": "Ľahká",
      "diff.normal": "Normálna",
      "diff.hard": "Ťažká",
      "device.title": "Vyber zariadenie",
      "device.lead": "Automaticky rozpozná telefón alebo PC. Tu to môžeš kedykoľvek zmeniť.",
      "device.pcStrong": "PC",
      "device.pcHint": "Klávesnica · zoom OK",
      "device.mobileStrong": "Mobil",
      "device.mobileHint": "Dotyk · bez zoomu",
      "device.enter": "Vstúpiť do arcade",
      "device.backHome": "Späť domov",
      "hub.title": "Vyber hru. Hraj tu.",
      "hub.lead": "Všetko beží na tejto stránke — ťukni na kartu a štart.",
      "hub.switch": "Zmeniť zariadenie",
      "hub.home": "← Domov",
      "hub.device": "zariadenie",
      "hub.best": "najlepšie",
      "player.arcade": "← Arcade",
      "player.home": "← Domov",
      "player.score": "skóre",
      "player.best": "najlepšie",
      "player.restart": "Restart",
      "launch.before": "Pred štartom",
      "launch.pick": "Vyber obtiažnosť",
      "launch.andOpponent": " a súpera",
      "launch.diff": "Obtiažnosť",
      "launch.players": "Hráči",
      "launch.bot": "proti botovi",
      "launch.botHint": "Hraj proti AI",
      "launch.2p": "2 hráči",
      "launch.2pHint": "Zdieľané zariadenie",
      "launch.cancel": "Zrušiť",
      "launch.start": "Spustiť hru",
      "fx.home": "Späť domov",
      "fx.starting": "Spúšťam {name}",
      "game.over": "Koniec · ťukni pre znova",
      "pad.tap": "ŤUKNI / AKCIA",
      "beta.arcadeTag": "Arcade beta",
      "blurb.flappy": "Medzerník / ťukni",
      "blurb.snake": "Šípky na riadenie",
      "blurb.pong": "Bot alebo 2 hráči",
      "blurb.breakout": "Pohyb · rozbi tehly",
      "blurb.dodge": "Hýb sa a preži",
      "blurb.catcher": "Chytaj dobré gule",
      "blurb.runner": "Skoč cez medzery",
      "blurb.shooter": "Pohyb + streľba",
      "blurb.reaction": "Ťukni pri záblesku",
      "blurb.stack": "Ťukni a pusť blok",
      "blurb.whack": "Ťukaj na kruhy",
      "blurb.aim": "Ťukni na pohyblivý cieľ",
      "blurb.memory": "Nájdi všetky páry",
      "blurb.ttt": "Bot alebo 2 hráči",
      "blurb.merge": "Posun alebo šípky"
    },
    de: {
      "nav.contact": "Kontakt",
      "nav.beta": "Beta testen",
      "nav.settings": "Einstellungen",
      "nav.primary": "Hauptnavigation",
      "device.phone": "Handy-Layout",
      "device.pc": "PC",
      "hero.eyebrow": "Beta-Zugang",
      "hero.lede": "Eine klare Arcade im Browser. Beta-Code eingeben und spielen — ohne Installation.",
      "hero.cta": "Beta testen",
      "hud.status": "status",
      "hud.ready": "bereit",
      "hud.session": "sitzung",
      "hud.online": "online",
      "beta.title": "Beta testen",
      "beta.lead": "Beta-Code eingeben, um die Spiele freizuschalten.",
      "beta.label": "Beta-Code",
      "beta.placeholder": "Code eingeben",
      "beta.submit": "Beta testen",
      "beta.cancel": "Abbrechen",
      "beta.wrong": "Falscher Code. Nochmal versuchen.",
      "beta.arcadeLead": "Beta-Code eingeben, um die Arcade freizuschalten.",
      "unlock.badge": "Zugang freigeschaltet",
      "contact.title": "Kontakt",
      "contact.lead": "Business, Collabs oder Feedback.",
      "contact.close": "Schließen",
      "contact.copy": "In Zwischenablage",
      "contact.copied": "Kopiert.",
      "contact.copyFail": "Kopieren fehlgeschlagen — E-Mail manuell markieren.",
      "redeem.title": "Code einlösen",
      "redeem.lead": "Code eingeben.",
      "redeem.label": "Code",
      "redeem.placeholder": "Code eingeben",
      "redeem.submit": "Einlösen",
      "redeem.cancel": "Abbrechen",
      "redeem.wrong": "Falscher Code. Nochmal versuchen.",
      "redeem.checking": "Prüfe…",
      "redeem.granted": "Zugang erlaubt.",
      "redeem.okDownload": "Lade TomasekPlays.zip — entpacken, dann TomasekPlays.exe öffnen",
      "redeem.okHomescreen": "Öffne Home-Screen-Anleitung…",
      "redeem.okOwners": "Lade TomasekPlays-Owners.zip — entpacken, dann die exe öffnen",
      "redeem.okMorse": "Öffne Morseovka…",
      "morse.title": "Morseovka",
      "morse.tag": "TomasekPlays",
      "morse.lead": "Text ↔ Morsecode umwandeln. Spielt auch den Ton ab.",
      "morse.text": "Text",
      "morse.morse": "Morse",
      "morse.clear": "Löschen",
      "morse.ch": "CH als ----",
      "morse.speed": "Tempo",
      "morse.play": "▶ Abspielen",
      "morse.stop": "■ Stop",
      "morse.copy": "Kopieren",
      "morse.hint": "Buchstabenabstand: Leerzeichen · Wortabstand: /",
      "morse.alpha": "Alphabet",
      "morse.alphaLead": "Buchstaben antippen zum Anhören.",
      "morse.home": "← Start",
      "morse.statusReady": "Bereit.",
      "morse.statusPlaying": "Spielt…",
      "morse.statusDone": "Fertig.",
      "morse.statusStopped": "Gestoppt.",
      "morse.statusEmpty": "Zuerst Text oder Morse eingeben.",
      "morse.statusCopied": "Kopiert.",
      "morse.statusCopyFail": "Kopieren fehlgeschlagen.",
      "morse.placeholderText": "Hallo, wie geht’s?",
      "morse.placeholderMorse": ".... .- .-.. .-.. ---",
      "hs.title": "Zum Home-Bildschirm",
      "hs.lead": "TomasekPlays wie eine App aufs Handy legen.",
      "hs.gotit": "Verstanden",
      "hs.close": "Schließen",
      "hs.iosLead": "iPhone / iPad — Safari",
      "hs.androidLead": "Android — Chrome",
      "hs.otherLead": "Handy-Startbildschirm",
      "hs.ios.1": "Öffne <strong>tomasekplays.com</strong> in <strong>Safari</strong> (nicht Chrome).",
      "hs.ios.2": "Tippe auf <strong>Teilen</strong> (Quadrat mit Pfeil nach oben).",
      "hs.ios.3": "Scrolle und tippe auf <strong>Zum Home-Bildschirm</strong>.",
      "hs.ios.4": "Tippe auf <strong>Hinzufügen</strong> — TomasekPlays erscheint wie eine App.",
      "hs.android.1": "Öffne <strong>tomasekplays.com</strong> in <strong>Chrome</strong>.",
      "hs.android.2": "Tippe auf das Menü <strong>⋮</strong> (oben rechts).",
      "hs.android.3": "Tippe auf <strong>Zum Startbildschirm</strong> oder <strong>App installieren</strong>.",
      "hs.android.4": "Bestätigen — TomasekPlays erscheint wie eine App.",
      "hs.other.1": "<strong>iPhone:</strong> Safari → <strong>Teilen</strong> → <strong>Zum Home-Bildschirm</strong>.",
      "hs.other.2": "<strong>Android:</strong> Chrome → <strong>⋮</strong> → <strong>Zum Startbildschirm</strong>.",
      "hs.other.3": "Neues Symbol jederzeit öffnen — kein App Store nötig.",
      "hs.other.4": "PC-Download? Code <strong>ONE4EXES</strong> einlösen.",
      "dl.title": "Owners-Download",
      "dl.lead": "Als Zip, damit Chrome nichts blockiert.",
      "dl.1": "Öffne <strong>{file}</strong> und entpacke es.",
      "dl.2": "Starte <strong>TomasekPlays-Owners.exe</strong> im Ordner.",
      "dl.3": "Wenn Windows fragt → <strong>Weitere Infos</strong> → <strong>Trotzdem ausführen</strong>.",
      "dl.gotit": "Verstanden",
      "dl.close": "Schließen",
      "settings.title": "Einstellungen",
      "settings.lead": "Auf diesem Gerät gespeichert.",
      "settings.sound": "Ton",
      "settings.soundHint": "Pieptöne beim Spielen",
      "settings.diff": "Schwierigkeit",
      "settings.diffHint": "Standard für neue Spiele",
      "settings.zoom": "PC-Zoom",
      "settings.zoomHint": "Nur im PC-Modus",
      "settings.lang": "Sprache",
      "settings.langHint": "Website- & Arcade-Text",
      "settings.reset": "Scores zurücksetzen",
      "settings.done": "Fertig",
      "settings.resetConfirm": "Alle Highscores zurücksetzen?",
      "diff.easy": "Leicht",
      "diff.normal": "Normal",
      "diff.hard": "Schwer",
      "device.title": "Setup wählen",
      "device.lead": "Erkennt Handy oder PC automatisch. Hier jederzeit ändern.",
      "device.pcStrong": "PC",
      "device.pcHint": "Tastatur · Zoom ok",
      "device.mobileStrong": "Mobil",
      "device.mobileHint": "Touch · kein Zoom",
      "device.enter": "Zur Arcade",
      "device.backHome": "Zurück zur Startseite",
      "hub.title": "Spiel wählen. Hier spielen.",
      "hub.lead": "Alles läuft auf dieser Seite — Karte tippen zum Start.",
      "hub.switch": "Gerät wechseln",
      "hub.home": "← Start",
      "hub.device": "gerät",
      "hub.best": "best",
      "player.arcade": "← Arcade",
      "player.home": "← Start",
      "player.score": "score",
      "player.best": "best",
      "player.restart": "Neustart",
      "launch.before": "Bevor du spielst",
      "launch.pick": "Schwierigkeit wählen",
      "launch.andOpponent": " und Gegner",
      "launch.diff": "Schwierigkeit",
      "launch.players": "Spieler",
      "launch.bot": "vs Bot",
      "launch.botHint": "Gegen die KI",
      "launch.2p": "2 Spieler",
      "launch.2pHint": "Ein Gerät teilen",
      "launch.cancel": "Abbrechen",
      "launch.start": "Spiel starten",
      "fx.home": "Zurück zur Startseite",
      "fx.starting": "Starte {name}",
      "game.over": "Game over · tippen für Neustart",
      "pad.tap": "TIPPEN / ACTION",
      "beta.arcadeTag": "Arcade-Beta",
      "blurb.flappy": "Leertaste / tippen",
      "blurb.snake": "Pfeiltasten steuern",
      "blurb.pong": "Bot oder 2 Spieler",
      "blurb.breakout": "Bewegen · Steine brechen",
      "blurb.dodge": "Bewegen und überleben",
      "blurb.catcher": "Gute Orbs fangen",
      "blurb.runner": "Über Lücken springen",
      "blurb.shooter": "Bewegen + schießen",
      "blurb.reaction": "Tippen beim Aufleuchten",
      "blurb.stack": "Tippen zum Ablegen",
      "blurb.whack": "Kreise tippen",
      "blurb.aim": "Bewegende Marke tippen",
      "blurb.memory": "Alle Paare finden",
      "blurb.ttt": "Bot oder 2 Spieler",
      "blurb.merge": "Wischen oder Pfeile"
    }
  };

  const listeners = [];
  let lang = DEFAULT;

  function loadSettings() {
    try {
      return Object.assign({}, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"));
    } catch (_) {
      return {};
    }
  }

  function saveSettings(patch) {
    const next = Object.assign(loadSettings(), patch);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (_) {}
    return next;
  }

  function detectLang() {
    const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    if (nav.startsWith("cs") || nav.startsWith("cz")) return "cz";
    if (nav.startsWith("sk")) return "sk";
    if (nav.startsWith("de")) return "de";
    return DEFAULT;
  }

  function normalize(code) {
    const id = String(code || "").toLowerCase();
    if (id === "cs") return "cz";
    return LANGS.some((l) => l.id === id) ? id : DEFAULT;
  }

  function initLang() {
    const stored = loadSettings().lang;
    // Always start in English unless the user picked a language in Settings.
    lang = stored ? normalize(stored) : DEFAULT;
    if (!stored) saveSettings({ lang: DEFAULT });
  }

  function t(key, vars) {
    const pack = STRINGS[lang] || STRINGS[DEFAULT];
    let out = (pack && pack[key]) || (STRINGS[DEFAULT] && STRINGS[DEFAULT][key]) || key;
    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach((k) => {
        out = out.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return out;
  }

  function setAttr(el, name, value) {
    if (name === "text") {
      el.textContent = value;
      return;
    }
    if (name === "html") {
      el.innerHTML = value;
      return;
    }
    el.setAttribute(name, value);
  }

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      setAttr(el, "text", t(key));
    });
    scope.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      setAttr(el, "html", t(key));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(key));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.setAttribute("title", t(key));
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(key));
    });
    document.documentElement.lang = lang === "cz" ? "cs" : lang;
  }

  function fillLangSelect(select) {
    if (!select) return;
    const cur = lang;
    select.innerHTML = LANGS.map((l) =>
      `<option value="${l.id}"${l.id === cur ? " selected" : ""}>${l.native}</option>`
    ).join("");
  }

  function setLang(code, opts) {
    const next = normalize(code);
    const silent = opts && opts.silent;
    if (next === lang && !(opts && opts.force)) {
      if (!silent) apply();
      return lang;
    }
    lang = next;
    saveSettings({ lang });
    apply();
    if (!silent) {
      listeners.forEach((fn) => {
        try { fn(lang); } catch (_) {}
      });
      try {
        window.dispatchEvent(new CustomEvent("tomasekLang", { detail: { lang } }));
      } catch (_) {}
    }
    return lang;
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function syncFromStorage() {
    const stored = normalize(loadSettings().lang || lang);
    if (stored !== lang) setLang(stored, { force: true });
    else apply();
  }

  initLang();

  window.TomasekI18n = {
    LANGS,
    t,
    apply,
    getLang: () => lang,
    setLang,
    fillLangSelect,
    onChange,
    syncFromStorage
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => apply());
  } else {
    apply();
  }

  window.addEventListener("storage", (e) => {
    if (e.key === SETTINGS_KEY) syncFromStorage();
  });
})();
