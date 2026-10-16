/* Git Good — shared prototype logic: state, layout injection, UI helpers. */

const GG = (() => {
  const KEY = "gitgood-demo-v1";
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // ---------- state ----------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(clone(DEFAULT_STATE), JSON.parse(raw));
    } catch (e) { /* storage blocked: fall back to seed data */ }
    return clone(DEFAULT_STATE);
  }
  const state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function startFresh(profile) {
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, clone(FRESH_STATE), profile);
    save();
  }
  function restart() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    location.href = "index.html";
  }
  // Jump a new user one week ahead so the leaderboard/streak screens have real-looking data.
  function fastForward() {
    const keep = { name: state.name, username: state.username, email: state.email, avatar: state.avatar, skills: state.skills };
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, clone(DEFAULT_STATE));
    Object.entries(keep).forEach(([k, v]) => { if (v && (!Array.isArray(v) || v.length)) state[k] = v; });
    save();
  }

  // ---------- derived ----------
  const PER_LEVEL = 200;
  function level(xp = state.xp) {
    return { n: Math.floor(xp / PER_LEVEL) + 1, into: xp % PER_LEVEL, need: PER_LEVEL, pct: Math.round((xp % PER_LEVEL) / PER_LEVEL * 100) };
  }
  const displayName = () => state.name || state.username || "Coder";
  const firstName = () => displayName().split(/[ _]/)[0].replace(/^./, (c) => c.toUpperCase());
  const badge = (id) => BADGES.find((b) => b.id === id);
  const earned = (id) => state.earned.includes(id);
  function badgeProgress(b) {
    if (earned(b.id)) return { have: 1, goal: 1, pct: 100 };
    const goal = b.goal || 1;
    const have = b.track === "streak" ? state.streak : (b.have || 0);
    return { have: Math.min(have, goal), goal, pct: Math.round(Math.min(have, goal) / goal * 100) };
  }
  function ranked(list, myXp) {
    const rows = list.map(([name, av, xp]) => ({ name, av, xp, me: false }));
    rows.push({ name: "You", av: state.avatar, xp: myXp, me: true });
    rows.sort((a, b) => b.xp - a.xp || (a.me ? -1 : 1));
    rows.forEach((r, i) => (r.rank = i + 1));
    return rows;
  }
  const appRank = () => ranked(LB_APP, state.xp).find((r) => r.me).rank;
  const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const doneDaily = () => DAILY.filter((q) => state.doneToday.includes(q)).length;

  // ---------- actions ----------
  function unlockBadge(id) {
    if (earned(id)) return false;
    state.earned.push(id);
    state.earnedOn[id] = today();
    state.justUnlocked = id;
    state.newBadge = true;
    save();
    return true;
  }
  // Returns what changed so the reward modal can celebrate it.
  function completeQuest(qid, classQuestId) {
    const q = Object.assign({}, QUESTS[qid]);
    if (classQuestId) q.classQuest = classQuestId;
    const out = { xp: q.xp, streakUp: false, badges: [], rankBefore: appRank() };
    const firstToday = state.doneToday.length === 0;
    if (firstToday) {
      state.streak += 1;
      state.week[6] = 1;
      out.streakUp = true;
    }
    if (!state.doneToday.includes(qid)) state.doneToday.push(qid);
    if (q.classQuest && !state.classDone.includes(q.classQuest)) state.classDone.push(q.classQuest);
    state.xp += q.xp;
    if (q.classQuest) state.classXp += q.xp;
    state.questsTotal += 1;
    if (q.badge && unlockBadge(q.badge)) out.badges.push(q.badge);
    if (state.streak >= 3 && unlockBadge("streak-3")) out.badges.push("streak-3");
    if (state.streak >= 7 && unlockBadge("streak-7")) out.badges.push("streak-7");
    if (new Date().getHours() >= 22 && unlockBadge("night-owl")) out.badges.push("night-owl");
    if (q.timed) { const sr = badge("speed-runner"); sr.have = (sr.have || 0) + 1; }
    out.rankAfter = appRank();
    state.lastRankMove = q.fromLeaderboard ? { from: out.rankBefore, to: out.rankAfter } : null;
    save();
    return out;
  }
  function addXP(n) { state.xp += n; save(); }

  // ---------- UI helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const device = () => $(".device") || document.body;

  function badgeHTML(b, size = "", forceLocked = false) {
    const on = !forceLocked && earned(b.id);
    return `<span class="badge ${size} ${on ? "earned" : "locked"}" aria-label="${b.name}">${on ? b.icon : "🔒"}</span>`;
  }
  const avatarHTML = (emoji, cls = "") => `<span class="avatar ${cls}">${emoji}</span>`;

  function toast(msg, ms = 2200) {
    let t = $(".toast", device());
    if (!t) { t = document.createElement("div"); t.className = "toast"; device().appendChild(t); }
    t.innerHTML = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), ms);
  }

  function backdrop(onClick) {
    let b = $(".backdrop", device());
    if (!b) { b = document.createElement("div"); b.className = "backdrop"; device().appendChild(b); }
    b.onclick = onClick;
    requestAnimationFrame(() => b.classList.add("show"));
    return b;
  }
  function openSheet(html, onOpen) {
    closeSheet(true);
    const s = document.createElement("div");
    s.className = "sheet";
    s.innerHTML = `<div class="grab"></div>${html}`;
    device().appendChild(s);
    backdrop(() => closeSheet());
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add("show")));
    $$("[data-close]", s).forEach((x) => (x.onclick = () => closeSheet()));
    if (onOpen) onOpen(s);
    return s;
  }
  function closeSheet(instant) {
    $$(".sheet", device()).forEach((s) => {
      s.classList.remove("show");
      setTimeout(() => s.remove(), instant ? 0 : 320);
    });
    const b = $(".backdrop", device());
    if (b && !$(".modal.show", device())) b.classList.remove("show");
  }
  function openModal(html, onOpen) {
    const m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = `<div class="box">${html}</div>`;
    device().appendChild(m);
    backdrop(null);
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add("show")));
    if (onOpen) onOpen(m);
    return m;
  }
  function closeModal() {
    $$(".modal", device()).forEach((m) => { m.classList.remove("show"); setTimeout(() => m.remove(), 250); });
    const b = $(".backdrop", device());
    if (b) b.classList.remove("show");
  }

  function confettiBurst(opts = {}) {
    if (typeof confetti !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = device().getBoundingClientRect();
    const origin = { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height * 0.35) / innerHeight };
    const colors = ["#00A651", "#2BD97C", "#F5C542", "#B3A369", "#FF7A1A", "#3BA6FF"];
    confetti(Object.assign({ particleCount: 110, spread: 75, startVelocity: 38, origin, colors, zIndex: 1000, scalar: 0.9 }, opts));
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: r.left / innerWidth, y: origin.y + 0.2 }, colors, zIndex: 1000 }), 180);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: r.right / innerWidth, y: origin.y + 0.2 }, colors, zIndex: 1000 }), 280);
  }

  function countUp(el, to, ms = 900, from = 0, prefix = "") {
    if (!el) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(from + (to - from) * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Animate any .bar > span[data-w] and .ring[data-p] after paint.
  function animateBars(root = document) {
    requestAnimationFrame(() => setTimeout(() => {
      $$(".bar > span[data-w]", root).forEach((s) => (s.style.width = s.dataset.w + "%"));
      $$(".ring[data-p]", root).forEach((r) => {
        const target = +r.dataset.p; let p = 0;
        const tick = () => { p = Math.min(target, p + Math.max(1, target / 30)); r.style.setProperty("--p", p); if (p < target) requestAnimationFrame(tick); };
        tick();
      });
    }, 60));
  }

  async function copy(text, msg = "Copied!") {
    try { await navigator.clipboard.writeText(text); toast("📋 " + msg); }
    catch (e) { toast("Copy: " + text, 3500); }
  }

  // Absolute URL for a page in this site (works locally and on GitHub Pages).
  const siteURL = (path) => new URL(path, location.href).href;

  // ---------- layout injection ----------
  const currentFile = () => (location.pathname.split("/").pop() || "index.html");
  function pageEntry() {
    const f = currentFile();
    return PAGES.find((p) => p.file.split("?")[0] === f);
  }

  function injectStatusbar() {
    const d = $(".device");
    if (!d || document.body.dataset.statusbar === "none") return;
    const sb = document.createElement("div");
    sb.className = "statusbar" + (document.body.dataset.statusbar === "light" ? " light" : "");
    sb.innerHTML = `<span>9:41</span><span class="notch"></span><span>📶 🔋</span>`;
    d.prepend(sb);
  }

  function injectTabbar() {
    const tab = document.body.dataset.tab;
    const d = $(".device");
    if (!tab || !d) return;
    const tabs = [
      ["home", "home.html", "🏠", "Home"],
      ["classes", "classes.html", "🎓", "Classes"],
      ["ranks", "leaderboard.html", "🏆", "Ranks"],
      ["badges", "achievements.html", "🏅", "Badges"],
      ["profile", "profile.html", "🦊", "Profile"],
    ];
    const nav = document.createElement("nav");
    nav.className = "tabbar";
    nav.innerHTML = tabs.map(([id, href, ic, label]) => {
      const icon = id === "profile" ? state.avatar : ic;
      const dot = id === "badges" && state.newBadge && tab !== "badges" ? `<span class="dot"></span>` : "";
      return `<a href="${href}" class="${id === tab ? "on" : ""}"><span class="ic">${icon}</span>${label}${dot}</a>`;
    }).join("");
    d.appendChild(nav);
  }

  function demoListHTML() {
    const cur = pageEntry();
    let html = "", group = "";
    PAGES.forEach((p, i) => {
      if (p.group !== group) { group = p.group; html += `<h4>${group}</h4>`; }
      html += `<a class="jump ${cur === p ? "on" : ""}" href="${p.file}"><span class="n">${i + 1}</span>${p.title}</a>`;
    });
    return html;
  }

  function injectDemoPanels() {
    const stage = $(".stage");
    if (!stage) return;
    const left = document.createElement("aside");
    left.className = "demo-panel left";
    left.innerHTML = `
      <div class="brand"><img src="assets/logo.png" alt=""><div><b>Git Good</b><small>Clickable prototype · ITSC 3155 Group 7</small></div></div>
      ${demoListHTML()}
      <div class="tools">
        <button data-ff>⏩ Fast-forward one week</button>
        <button data-restart>↺ Restart demo</button>
      </div>`;
    stage.prepend(left);

    const p = pageEntry();
    const right = document.createElement("aside");
    right.className = "demo-panel right";
    right.innerHTML = `
      <div class="note-card">
        <span class="tag">${p ? p.group : "Git Good"}</span>
        <h3>${p ? p.title : document.title}</h3>
        <p>${p ? p.tip : ""}</p>
      </div>
      ${p && p.ask.length ? `<div class="note-card"><div class="q">💬 Feedback questions</div><ul>${p.ask.map((a) => `<li>${a}</li>`).join("")}</ul></div>` : ""}
      <div class="note-card small">“Quit Forking Around.” — Git Good turns 10 minutes a day into a coding habit for UNCC computing students.</div>`;
    stage.appendChild(right);

    const fab = document.createElement("button");
    fab.className = "demo-fab";
    fab.textContent = "☰ Screens";
    fab.onclick = () => openSheet(`<h3 style="margin-bottom:6px">Jump to a screen</h3><div class="demo-sheet">${demoListHTML()}</div>
      <div class="row" style="margin-top:14px"><button class="btn btn-ghost btn-sm grow" data-ff>⏩ Fast-forward</button><button class="btn btn-ghost btn-sm grow" data-restart>↺ Restart</button></div>`, wireTools);
    device().appendChild(fab);
    wireTools(left);
  }
  function wireTools(root) {
    $$("[data-restart]", root).forEach((b) => (b.onclick = restart));
    $$("[data-ff]", root).forEach((b) => (b.onclick = () => { fastForward(); location.href = "home.html"; }));
    $$(".demo-sheet h4", root).forEach((h) => { h.style.cssText = "font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8a7426;margin:12px 0 4px"; });
    $$(".demo-sheet a.jump", root).forEach((a) => { a.style.cssText = "display:flex;gap:8px;padding:7px 4px;font-weight:800;border-bottom:1px solid #eef1ee"; });
  }

  function init() {
    injectStatusbar();
    injectTabbar();
    injectDemoPanels();
    $$("[data-back]").forEach((b) => (b.onclick = (e) => { e.preventDefault(); history.length > 1 ? history.back() : (location.href = b.getAttribute("href") || "home.html"); }));
    animateBars();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    state, save, startFresh, restart, fastForward, level, displayName, firstName, badge, earned, badgeProgress,
    ranked, appRank, today, doneDaily, unlockBadge, completeQuest, addXP,
    $, $$, badgeHTML, avatarHTML, toast, openSheet, closeSheet, openModal, closeModal, confettiBurst, countUp, animateBars, copy, siteURL,
  };
})();
